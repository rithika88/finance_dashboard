from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ml.predict import predict_category, reload_model
from mongo import feedback_collection
from routes.auth_routes import get_current_user
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

router = APIRouter()

class Transaction(BaseModel):
    description: str

class Feedback(BaseModel):
    description: str
    category: str

@router.post("/categorize")
def categorize(transaction: Transaction):
    category = predict_category(transaction.description)
    return {"description": transaction.description, "category": category}

@router.post("/feedback")
def submit_feedback(feedback: Feedback, user_id: str = Depends(get_current_user)):
    feedback_collection.insert_one({
        "description": feedback.description.upper(),
        "category": feedback.category,
        "user_id": user_id
    })
    return {"message": "Feedback recorded"}

@router.post("/retrain")
def retrain_model(user_id: str = Depends(get_current_user)):
    base_path = os.path.dirname(__file__)
    data_path = os.path.join(base_path, "..", "ml", "data", "transactions.csv")

    df_original = pd.read_csv(data_path)
    df_original.columns = ["description", "category"]

    feedback_docs = list(feedback_collection.find({}))
    if len(feedback_docs) < 5:
        return {"message": f"Not enough feedback yet ({len(feedback_docs)}/5 minimum). Add more transactions first."}

    df_feedback = pd.DataFrame([{"description": f["description"], "category": f["category"]} for f in feedback_docs])
    df_combined = pd.concat([df_original, df_feedback], ignore_index=True).drop_duplicates()
    df_combined["description"] = df_combined["description"].str.upper()

    X = df_combined["description"]
    y = df_combined["category"]

    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
        ("clf", LogisticRegression(max_iter=1000))
    ])
    model.fit(X, y)

    model_path = os.path.join(base_path, "..", "ml", "model.pkl")
    joblib.dump(model, model_path)
    reload_model()

    return {"message": f"Model retrained with {len(df_combined)} total examples ({len(feedback_docs)} from user feedback)!"}

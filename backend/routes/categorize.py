from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ml.predict import predict_category, reload_model
from mongo import feedback_collection
from routes.auth_routes import get_current_user
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

router = APIRouter()

class Transaction(BaseModel):
    description: str

class Feedback(BaseModel):
    description: str
    category: str

CATEGORY_MAP = {
    "Restaurants": "Food", "Fast Food": "Food", "Coffee Shops": "Food",
    "Groceries": "Food", "Food & Dining": "Food", "Alcohol & Bars": "Food",
    "Gas & Fuel": "Transport", "Auto Insurance": "Transport",
    "Movies & Dvds": "Entertainment", "Music": "Entertainment", "Entertainment": "Entertainment",
    "Television": "Subscriptions", "Internet": "Subscriptions", "Mobile Phone": "Subscriptions",
    "Shopping": "Shopping", "Electronics & Software": "Shopping", "Home Improvement": "Shopping",
    "Paycheck": "Income", "Credit Card Payment": "Finance",
    "Mortgage & Rent": "Housing", "Utilities": "Utilities", "Haircut": "Personal Care",
}

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
    # --- Admin gate ---
    admin_id = os.environ.get("ADMIN_USER_ID")
    if admin_id and user_id != admin_id:
        raise HTTPException(status_code=403, detail="Only the admin can trigger retraining.")

    base_path = os.path.dirname(__file__)
    ml_path = os.path.join(base_path, "..", "ml")

    # --- Load same base datasets as train.py (Kaggle Excel + Indian CSV) ---
    excel_path = os.path.join(ml_path, "data", "personal_transactions_dashboard_ready (2).xlsx")
    csv_path   = os.path.join(ml_path, "data", "transactions.csv")

    df1 = pd.read_excel(excel_path)
    df1 = df1[["Description", "Category"]].dropna()
    df1.columns = ["description", "category"]
    df1["category"] = df1["category"].map(CATEGORY_MAP).fillna(df1["category"])

    df2 = pd.read_csv(csv_path)

    df_base = pd.concat([df1, df2], ignore_index=True)
    df_base["description"] = df_base["description"].str.upper()

    # --- Only use the requesting user's own feedback, not all users' ---
    feedback_docs = list(feedback_collection.find({"user_id": user_id}))
    if len(feedback_docs) < 5:
        return {
            "message": (
                f"Not enough feedback yet ({len(feedback_docs)}/5 minimum). "
                "Correct more transaction categories first."
            )
        }

    df_feedback = pd.DataFrame([
        {"description": f["description"], "category": f["category"]}
        for f in feedback_docs
    ])
    df_combined = (
        pd.concat([df_base, df_feedback], ignore_index=True)
        .drop_duplicates()
    )

    X = df_combined["description"]
    y = df_combined["category"]

    # --- 80/20 split so accuracy is verifiable ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
        ("clf",   LogisticRegression(max_iter=1000)),
    ])
    model.fit(X_train, y_train)
    accuracy = round(accuracy_score(y_test, model.predict(X_test)) * 100, 1)

    model_path = os.path.join(ml_path, "model.pkl")
    joblib.dump(model, model_path)
    reload_model()

    return {
        "message": (
            f"Model retrained on {len(df_combined)} examples "
            f"({len(feedback_docs)} from your feedback). "
            f"Test accuracy: {accuracy}%"
        )
    }

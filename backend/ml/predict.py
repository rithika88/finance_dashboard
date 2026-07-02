import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = joblib.load(model_path)

def predict_category(description: str) -> str:
    return model.predict([description.upper()])[0]

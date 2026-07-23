import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
_model = joblib.load(model_path)

def predict_category(description: str) -> str:
    return _model.predict([description.upper()])[0]

def reload_model():
    global _model
    _model = joblib.load(model_path)

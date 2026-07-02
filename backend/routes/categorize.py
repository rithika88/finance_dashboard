from fastapi import APIRouter
from pydantic import BaseModel
from ml.predict import predict_category

router = APIRouter()

class Transaction(BaseModel):
    description: str

@router.post("/categorize")
def categorize(transaction: Transaction):
    category = predict_category(transaction.description)
    return {"description": transaction.description, "category": category}

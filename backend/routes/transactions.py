from fastapi import APIRouter, Depends
from pydantic import BaseModel
from mongo import transactions_collection
from bson import ObjectId
from routes.auth_routes import get_current_user

router = APIRouter()

class Transaction(BaseModel):
    amount: float
    category: str
    description: str
    date: str

def serialize(t):
    return {
        "id": str(t["_id"]),
        "amount": t["amount"],
        "category": t["category"],
        "description": t["description"],
        "date": t["date"],
    }

@router.get("/transactions")
def get_transactions(user_id: str = Depends(get_current_user)):
    transactions = list(transactions_collection.find({"user_id": user_id}).sort("date", -1))
    return [serialize(t) for t in transactions]

@router.post("/transactions")
def create_transaction(transaction: Transaction, user_id: str = Depends(get_current_user)):
    data = transaction.dict()
    data["user_id"] = user_id
    result = transactions_collection.insert_one(data)
    new_transaction = transactions_collection.find_one({"_id": result.inserted_id})
    return serialize(new_transaction)

@router.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: str, transaction: Transaction, user_id: str = Depends(get_current_user)):
    transactions_collection.update_one(
        {"_id": ObjectId(transaction_id), "user_id": user_id},
        {"$set": transaction.dict()}
    )
    updated = transactions_collection.find_one({"_id": ObjectId(transaction_id)})
    return serialize(updated)

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: str, user_id: str = Depends(get_current_user)):
    transactions_collection.delete_one({"_id": ObjectId(transaction_id), "user_id": user_id})
    return {"message": "Deleted successfully"}

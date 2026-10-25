from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
import io
from ml.predict import predict_category
from mongo import transactions_collection
from routes.auth_routes import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_statement(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df.columns = [col.strip() for col in df.columns]

    return {
        "filename": file.filename,
        "columns": list(df.columns),
        "preview": df.head(3).to_dict(orient="records")
    }

@router.post("/parse")
async def parse_statement(
    file: UploadFile = File(...),
    date_col: str = "",
    desc_col: str = "",
    amount_col: str = "",
    user_id: str = Depends(get_current_user),
):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df.columns = [col.strip() for col in df.columns]

    transactions = []
    for _, row in df.iterrows():
        description = str(row[desc_col])
        t = {
            "date": str(row[date_col]),
            "description": description,
            "amount": float(row[amount_col]),
            "category": predict_category(description),
            "user_id": user_id,
        }
        transactions.append(t)

    # Save to MongoDB
    if transactions:
        transactions_collection.insert_many(transactions)

    return {
        "total_transactions": len(transactions),
        "transactions": transactions,
    }

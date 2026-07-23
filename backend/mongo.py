from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["finance_dashboard"]
transactions_collection = db["transactions"]
users_collection = db["users"]
feedback_collection = db["ml_feedback"]

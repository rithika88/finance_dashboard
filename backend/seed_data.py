from mongo import transactions_collection
from datetime import datetime, timedelta
import random

USER_ID = "6a493fab24f22a7a1bd1e08f"

categories_expenses = ["Food", "Transport", "Shopping", "Subscriptions", "Entertainment", "Utilities"]
descriptions = {
    "Food": ["Swiggy order", "Zomato dinner", "Grocery shopping", "Coffee"],
    "Transport": ["Uber ride", "Petrol", "Metro card"],
    "Shopping": ["Amazon purchase", "Myntra order", "Flipkart order"],
    "Subscriptions": ["Netflix", "Spotify", "Prime Video"],
    "Entertainment": ["Movie tickets", "Gaming purchase"],
    "Utilities": ["Electricity bill", "Internet bill", "Mobile recharge"],
}

transactions = []
today = datetime.now()

# Salary - one per month for last 6 months
for i in range(6):
    date = today - timedelta(days=30 * i)
    transactions.append({
        "user_id": USER_ID,
        "amount": 50000,
        "category": "Income",
        "description": "Monthly Salary",
        "date": date.strftime("%Y-%m-%d")
    })

# Random expenses over last 90 days
for i in range(60):
    days_ago = random.randint(0, 90)
    date = today - timedelta(days=days_ago)
    category = random.choice(categories_expenses)
    description = random.choice(descriptions[category])
    amount = -random.randint(50, 3000)
    transactions.append({
        "user_id": USER_ID,
        "amount": amount,
        "category": category,
        "description": description,
        "date": date.strftime("%Y-%m-%d")
    })

result = transactions_collection.insert_many(transactions)
print(f"Inserted {len(result.inserted_ids)} transactions!")

from mongo import transactions_collection
from datetime import datetime, timedelta
import random

USER_ID = "6a9662eb099f135ae9e8d127"

categories_expenses = ["Food", "Transport", "Shopping", "Subscriptions", "Entertainment", "Utilities", "Healthcare", "Housing"]
descriptions = {
    "Food": ["Swiggy order", "Zomato dinner", "Grocery shopping", "Coffee at cafe", "Lunch at restaurant", "Zepto order"],
    "Transport": ["Uber ride", "Petrol", "Metro card recharge", "Ola cabs"],
    "Shopping": ["Amazon purchase", "Myntra order", "Flipkart order", "Nykaa order"],
    "Subscriptions": ["Netflix", "Spotify", "Prime Video", "iCloud storage"],
    "Entertainment": ["Movie tickets", "Gaming purchase", "Concert ticket"],
    "Utilities": ["Electricity bill", "Internet bill", "Mobile recharge", "Water bill"],
    "Healthcare": ["Pharmacy", "Doctor consultation", "Gym membership"],
    "Housing": ["House rent", "Maintenance fee"],
}

transactions = []
today = datetime.now()

# Salary - one per month for last 6 months
for i in range(6):
    date = today - timedelta(days=30 * i)
    transactions.append({
        "user_id": USER_ID,
        "amount": 65000,
        "category": "Income",
        "description": "Monthly Salary",
        "date": date.strftime("%Y-%m-%d")
    })

# Occasional freelance income
for i in range(3):
    date = today - timedelta(days=random.randint(0, 150))
    transactions.append({
        "user_id": USER_ID,
        "amount": random.randint(5000, 15000),
        "category": "Income",
        "description": "Freelance payment",
        "date": date.strftime("%Y-%m-%d")
    })

# Random expenses over last 180 days
for i in range(80):
    days_ago = random.randint(0, 180)
    date = today - timedelta(days=days_ago)
    category = random.choice(categories_expenses)
    description = random.choice(descriptions[category])
    amount = -random.randint(50, 3500)
    transactions.append({
        "user_id": USER_ID,
        "amount": amount,
        "category": category,
        "description": description,
        "date": date.strftime("%Y-%m-%d")
    })

result = transactions_collection.insert_many(transactions)
print(f"Inserted {len(result.inserted_ids)} transactions for Ritu!")

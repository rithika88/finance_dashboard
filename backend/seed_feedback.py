from mongo import feedback_collection

sample_feedback = [
    {"description": "PAYTM RECHARGE", "category": "Utilities"},
    {"description": "ZEPTO GROCERY ORDER", "category": "Food"},
    {"description": "OLA CABS RIDE", "category": "Transport"},
    {"description": "MYNTRA FASHION SALE", "category": "Shopping"},
    {"description": "PVR MOVIE TICKET", "category": "Entertainment"},
    {"description": "APOLLO PHARMACY", "category": "Healthcare"},
    {"description": "HOUSE RENT PAYMENT", "category": "Housing"},
]

for item in sample_feedback:
    item["description"] = item["description"].upper()
    item["user_id"] = "seed_script"

result = feedback_collection.insert_many(sample_feedback)
print(f"Inserted {len(result.inserted_ids)} feedback entries!")

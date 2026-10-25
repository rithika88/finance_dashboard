from mongo import users_collection, transactions_collection

users = list(users_collection.find({}))
for u in users:
    count = transactions_collection.count_documents({"user_id": str(u["_id"])})
    print(f"{u['email']} — {count} transactions")

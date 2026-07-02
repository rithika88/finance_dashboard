import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

# Load real dataset
df1 = pd.read_excel(os.path.join(os.path.dirname(__file__), 'data/personal_transactions_dashboard_ready (2).xlsx'))
df1 = df1[['Description', 'Category']].dropna()
df1.columns = ['description', 'category']

# Map categories to simpler names
category_map = {
    'Restaurants': 'Food', 'Fast Food': 'Food', 'Coffee Shops': 'Food',
    'Groceries': 'Food', 'Food & Dining': 'Food', 'Alcohol & Bars': 'Food',
    'Gas & Fuel': 'Transport', 'Auto Insurance': 'Transport',
    'Movies & Dvds': 'Entertainment', 'Music': 'Entertainment', 'Entertainment': 'Entertainment',
    'Television': 'Subscriptions', 'Internet': 'Subscriptions', 'Mobile Phone': 'Subscriptions',
    'Shopping': 'Shopping', 'Electronics & Software': 'Shopping', 'Home Improvement': 'Shopping',
    'Paycheck': 'Income', 'Credit Card Payment': 'Finance',
    'Mortgage & Rent': 'Housing', 'Utilities': 'Utilities', 'Haircut': 'Personal Care',
}
df1['category'] = df1['category'].map(category_map).fillna(df1['category'])

# Load our Indian transactions dataset
df2 = pd.read_csv(os.path.join(os.path.dirname(__file__), 'data/transactions.csv'))

# Combine both
df = pd.concat([df1, df2], ignore_index=True)
df['description'] = df['description'].str.upper()

print(f"Total samples: {len(df)}")
print(f"Categories: {df['category'].unique()}")

X = df['description']
y = df['category']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
    ('clf', LogisticRegression(max_iter=1000))
])

model.fit(X_train, y_train)

print("\n=== Model Evaluation ===")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, zero_division=0))

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
joblib.dump(model, model_path)
print(f"✅ Model saved to {model_path}")

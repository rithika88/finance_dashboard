from fastapi import APIRouter, Depends
import google.generativeai as genai
from mongo import transactions_collection
from routes.auth_routes import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

router = APIRouter()

@router.get("/insights")
def get_insights(user_id: str = Depends(get_current_user)):
    transactions = list(transactions_collection.find({"user_id": user_id}))

    if len(transactions) < 3:
        return {"insight": "Add a few more transactions to unlock AI insights!"}

    income = sum(t["amount"] for t in transactions if t["amount"] > 0)
    expenses = sum(abs(t["amount"]) for t in transactions if t["amount"] < 0)

    category_totals = {}
    for t in transactions:
        if t["amount"] < 0:
            category_totals[t["category"]] = category_totals.get(t["category"], 0) + abs(t["amount"])

    top_categories = sorted(category_totals.items(), key=lambda x: -x[1])[:5]
    category_summary = ", ".join([f"{cat}: ₹{amt:.0f}" for cat, amt in top_categories])

    prompt = f"""You are a personal finance advisor. Analyze this user's spending data and give 3 short, specific, actionable insights.

Total Income: ₹{income:.0f}
Total Expenses: ₹{expenses:.0f}
Top spending categories: {category_summary}
Total transactions: {len(transactions)}

Give your response as 3 concise bullet points (max 25 words each). Be specific with numbers. Be encouraging but honest. Do not use markdown formatting, just plain text bullet points starting with a dash."""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return {"insight": response.text}
    except Exception as e:
        return {"insight": "AI insights are temporarily unavailable (rate limit reached). Try again in a minute."}

@router.get("/insights/analytics")
def get_analytics_insights(user_id: str = Depends(get_current_user)):
    transactions = list(transactions_collection.find({"user_id": user_id}))

    if len(transactions) < 5:
        return {"insight": "Add a few more transactions to unlock deeper analytics insights!"}

    from collections import defaultdict

    daily_totals = defaultdict(float)
    monthly_totals = defaultdict(float)
    category_totals = defaultdict(float)

    for t in transactions:
        if t["amount"] < 0:
            amt = abs(t["amount"])
            date_str = t["date"]
            daily_totals[date_str] += amt
            month_key = date_str[:7]
            monthly_totals[month_key] += amt
            category_totals[t["category"]] += amt

    avg_daily = sum(daily_totals.values()) / len(daily_totals) if daily_totals else 0
    highest_day = max(daily_totals.items(), key=lambda x: x[1]) if daily_totals else ("N/A", 0)
    months_sorted = sorted(monthly_totals.items())
    top_categories = sorted(category_totals.items(), key=lambda x: -x[1])[:5]

    category_summary = ", ".join([f"{cat}: ₹{amt:.0f}" for cat, amt in top_categories])
    monthly_summary = ", ".join([f"{m}: ₹{amt:.0f}" for m, amt in months_sorted[-4:]])

    prompt = f"""You are a personal finance advisor analyzing detailed spending patterns.

Average daily spending: ₹{avg_daily:.0f}
Highest single spending day: {highest_day[0]} with ₹{highest_day[1]:.0f}
Monthly spending trend (recent months): {monthly_summary}
Top spending categories: {category_summary}
Total transactions analyzed: {len(transactions)}

Give exactly 3 sections, each with 1-2 short sentences (max 30 words per section):
1. DAILY PATTERN: Comment on daily spending habits and any spikes.
2. MONTHLY TREND: Comment on whether spending is increasing, decreasing, or stable month to month.
3. REDUCE EXPENSES: Give one specific, actionable tip to cut unnecessary spending based on the top categories.

Format your response as exactly 3 lines, each starting with the section name in caps followed by a colon, then the advice. No markdown, no extra text."""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return {"insight": response.text}
    except Exception as e:
        return {"insight": "DAILY PATTERN: Temporarily unavailable due to rate limits.\nMONTHLY TREND: Try refreshing in a minute.\nREDUCE EXPENSES: AI analysis will be back shortly."}

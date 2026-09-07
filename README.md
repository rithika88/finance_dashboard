
# Moneta — AI-Powered Personal Finance Dashboard

A full-stack personal finance tracker that helps you log transactions, visualize spending patterns, and get AI-powered insights to manage your money better.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Features

- **Secure Authentication** — JWT-based signup/login with bcrypt password hashing
- **Transaction Management** — Add, edit, and delete income/expense entries
- **ML-Powered Categorization** — TF-IDF and Logistic Regression model auto-suggests categories as you type, with a self-improving feedback loop
- **AI Insights** — Gemini-powered analysis of spending habits, monthly trends, and personalized saving tips
- **Rich Analytics** — Category breakdowns, monthly trends, day-of-week patterns, and year-over-year comparisons
- **Flexible Time Filters** — View your finances by Week, Month, Year, or All Time
- **Dark/Light Mode** — Fully themed UI that adapts to your preference
- **Responsive Design** — Works seamlessly on desktop and mobile

---

## Tech Stack

**Frontend**
- React and React Router
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

**Backend**
- FastAPI (Python)
- MongoDB Atlas (via PyMongo)
- JWT authentication (python-jose and passlib/bcrypt)

**Machine Learning**
- scikit-learn (TF-IDF Vectorizer and Logistic Regression)
- Trained on 100+ labeled transaction descriptions
- Self-improving via a feedback loop that retrains on user corrections

**AI**
- Google Gemini API for natural language financial insights

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- A MongoDB Atlas account (free tier works)
- A Google Gemini API key (free tier available)

### 1. Clone the repository
```bash
git clone https://github.com/rithika88/finance_dashboard.git
cd finance_dashboard
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
GEMINI_API_KEY=your_gemini_api_key


Run the backend:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app running.

---

## Machine Learning Pipeline

1. **Training** — A TF-IDF vectorizer converts transaction descriptions into numerical features, fed into a Logistic Regression classifier trained on labeled data
2. **Inference** — The `/api/categorize` endpoint predicts a category in real time as users type
3. **Feedback Loop** — Every transaction a user saves logs their chosen category as new training data
4. **Retraining** — The `/api/retrain` endpoint incorporates accumulated feedback and hot-reloads the updated model without downtime

---

## Project Structure

```text
finance_dashboard/
backend/
  main.py
  auth.py
  mongo.py
  routes/
    auth_routes.py
    transactions.py
    categorize.py
    insights.py
  ml/
    train.py
    predict.py
    model.pkl
    data/
frontend/
  src/
    components/
    pages/
    utils/
README.md
```

## License

This project is open source and available under the MIT License.

---

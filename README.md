# Finance Dashboard

A full-stack personal finance tracker built for the Indian market. Track income and expenses, auto-categorize transactions using a trained ML model, and get AI-generated spending insights powered by Gemini.

---

## Features

- **JWT authentication** — sign up / log in, all data is user-scoped
- **Transaction CRUD** — add, edit, delete transactions with category + date
- **ML auto-categorization** — TF-IDF + Logistic Regression trained on 911 labeled descriptions (93% test accuracy across 11 categories)
- **Active learning** — correct a category, save feedback, retrain the model on the full dataset + your own corrections
- **AI Insights** — Gemini 2.5 Flash generates 3 actionable spending tips on the dashboard and a structured analytics report
- **Charts** — monthly income vs. expenses area chart, spending-by-category donut, day-of-week bar chart, year-over-year comparison
- **Dark mode** — persisted in `localStorage`
- **CSV upload** — parse a bank statement, auto-categorize every row, save directly to your account

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TailwindCSS v4, Framer Motion, Recharts |
| Backend | FastAPI (Python), MongoDB (PyMongo) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| ML | scikit-learn — TF-IDF bigrams + Logistic Regression |
| AI | Google Gemini 2.5 Flash |

---

## ML Model

- **Training data**: 728 rows from a real Kaggle transactions dataset + 183 hand-labeled Indian transactions
- **Total samples**: 911
- **Test set**: 183 samples (20% split, `random_state=42`)
- **Test accuracy**: 93%
- **Categories**: Food, Transport, Shopping, Housing, Finance, Entertainment, Subscriptions, Utilities, Income, Personal Care, Healthcare

To retrain from scratch:

```bash
cd backend
python ml/train.py
```

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<a long random secret>
GEMINI_API_KEY=<your Gemini API key>
ADMIN_USER_ID=<your MongoDB user _id — grants access to /api/retrain>
```

Run the server:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (min 32 chars) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `ADMIN_USER_ID` | Optional | If set, only this user can call `POST /api/retrain` |

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/transactions` | JWT | List all user transactions |
| POST | `/api/transactions` | JWT | Create transaction |
| PUT | `/api/transactions/:id` | JWT | Update (user-scoped) |
| DELETE | `/api/transactions/:id` | JWT | Delete (user-scoped) |
| POST | `/api/categorize` | — | Predict category for a description |
| POST | `/api/feedback` | JWT | Save a category correction |
| POST | `/api/retrain` | JWT + admin | Retrain model on base data + your feedback |
| POST | `/api/upload` | — | Preview a CSV bank statement |
| POST | `/api/parse` | JWT | Parse + import a CSV bank statement |
| GET | `/api/insights` | JWT | Gemini dashboard insights |
| GET | `/api/insights/analytics` | JWT | Gemini analytics report |

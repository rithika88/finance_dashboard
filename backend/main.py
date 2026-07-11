from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.categorize import router as categorize_router
from routes.transactions import router as transactions_router
from routes.auth_routes import router as auth_router
from routes.insights import router as insights_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(categorize_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(insights_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Finance Dashboard API is running!"}

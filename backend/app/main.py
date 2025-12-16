from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import orders

app = FastAPI(
    title="Orders Dashboard API",
    description="API for managing orders synced from Airtable",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}

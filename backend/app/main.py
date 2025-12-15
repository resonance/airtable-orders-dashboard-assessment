"""Application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import orders
from app.config import settings

async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown."""
    print("Starting up...")
    yield
    print("Shutting down...")

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return { "status": "ok" }

app.include_router(orders.router, prefix="/api", tags=["orders"])

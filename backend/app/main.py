"""Application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routers import orders
from app.config import settings
from app.services.cache_service import cache_service

async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown."""
    print("Starting up...")
    try:
        await cache_service.connect()
        print("Connected to redis.")
    except Exception as e:
        print(f"Failed to connect to redis: {str(e)}. Continuing without cache.")
    yield
    try:
        await cache_service.disconnect()
        print("Disconnected from redis.")
    except Exception as e:
            pass
    print("Shutting down...")

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
    return { "status": "ok", "redis": "connected" if cache_service.client else "disconnected" }

app.include_router(orders.router, prefix="/api", tags=["orders"])

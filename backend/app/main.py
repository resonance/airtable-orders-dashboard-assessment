"""Application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown."""
    print("Starting up...")
    yield
    print("Shutting down...")

app = FastAPI(
    title="My FastAPI Application",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return { "status": "ok" }

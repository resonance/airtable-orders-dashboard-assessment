from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # 👈 AÑADIR
from app.routes import order_routes
from app.config import DEBUG, SYNC_INTERVAL_MINUTES
from app.services.sync_service import sync_all
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = FastAPI(title="Airtable Orders Sync API")

# 👇 CORS DEBE IR AQUÍ
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 ROUTERS DESPUÉS
app.include_router(order_routes.router, prefix="/api/orders", tags=["Orders"])

scheduler = BackgroundScheduler()

def scheduled_sync():
    try:
        res = sync_all()
        if DEBUG:
            print("Scheduled sync result:", res)
    except Exception as e:
        print("Scheduled sync error:", e)

@app.on_event("startup")
def startup_event():
    try:
        print("Running initial sync...")
        sync_all()
    except Exception as e:
        print("Initial sync failed:", e)

    scheduler.add_job(
        scheduled_sync,
        'interval',
        minutes=SYNC_INTERVAL_MINUTES,
        id='airtable_sync',
        replace_existing=True
    )
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

@app.on_event("shutdown")
def shutdown_event():
    if scheduler:
        scheduler.shutdown()

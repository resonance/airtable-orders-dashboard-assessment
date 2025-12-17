import os 
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID")
AIRTABLE_TABLE_ID = os.getenv("AIRTABLE_TABLE_ID")

DATABASE_URL = os.getenv("DATABASE_URL")
SYNC_INTERVAL_MINUTES = int(os.getenv("SYNC_INTERVAL_MINUTES", "5"))

DEBUG = os.getenv("DEBUG", "False") == "True"

VALID_STATES = ["Pending", "Processing", "Completed", "Cancelled", "Delivered", "Send"]
VALID_PRIORITIES = ["Low", "Medium", "High", "Urgent"]
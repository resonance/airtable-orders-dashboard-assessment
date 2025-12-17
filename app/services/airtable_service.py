import requests
from app.config import AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID
from typing import List, Dict, Any

if not AIRTABLE_API_KEY or not AIRTABLE_BASE_ID:
    raise RuntimeError("Airtable Config Missing .env")

class AirtableService:
    def __init__(self):
        self.base_url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_ID}"
        print(self.base_url);
        self.headers = {
            "Authorization": f"Bearer {AIRTABLE_API_KEY}",
            "Content-Type": "application/json"
        }

    def get_all_records(self) -> List[Dict[str,any]]:
        """Handles Airtable pagination: returns aggregated list of records"""
        records = []
        params = {}
        while True:
            resp = requests.get(self.base_url, headers=self.headers, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            records.extend(data.get("records", []))
            offset = data.get("offset")
            if not offset:
                break
            params["offset"] = offset
        return records

    def get_record(self, record_id: str) -> Dict[str, Any]:
        resp = requests.get(f"{self.base_url}/{record_id}", headers=self.headers, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def filter_by_formula(self, formula: str) -> List[Dict[str, Any]]:
        params = {"filterByFormula": formula}
        resp = requests.get(self.base_url, headers=self.headers, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json().get("records", [])

    def update_record(self, record_id: str, fields: dict) -> Dict[str, Any]:
        body = {"fields": fields}
        resp = requests.patch(f"{self.base_url}/{record_id}", json=body, headers=self.headers, timeout=30)
        resp.raise_for_status()
        return resp.json()
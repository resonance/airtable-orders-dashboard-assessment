"""Service for Airtable integration."""

import asyncio
from pyairtable import Api
from app.config import settings
from typing import List
from app.schemas.order import Order
from datetime import datetime

class AirtableService:
    """Service for interacting with Airtable"""

    def __init__(self):
        """Initialize the Airtable service."""
        self.api = Api(settings.airtable_api_key)
        self.table = self.api.table(
            settings.airtable_base_id,
            settings.airtable_table_id,
        )

    async def get_all_orders(self) -> List[Order]:
        """Fetch all orders from Airtable."""
        loop = asyncio.get_event_loop()
        records = await loop.run_in_executor(None, self.table.all)

        orders = []

        for record in records:
            fields = record.get("fields", {})
            orders.append(Order(
                airtable_id=record.get("id"),
                order_id=fields.get("Order ID", ""),
                customer=fields.get("Customer Name", ""),
                status=fields.get("Status", "Pending"),
                priority=fields.get("Priority", "Medium"),
                order_total=float(fields.get("Order Total", 0)),
                created_at=datetime.fromisoformat(
                    fields.get("Created At", datetime.now().isoformat())
                )
            ))
        return orders

airtable_service = AirtableService()

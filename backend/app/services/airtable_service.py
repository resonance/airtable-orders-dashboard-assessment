"""Service for Airtable integration."""

import asyncio
from pyairtable import Api
from app.config import settings
from typing import List
from app.schemas.order import Order
from datetime import datetime
from functools import partial

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
        records = await asyncio.to_thread(self.table.all)

        orders = []
        for record in records:
            orders.append(self._record_to_order(record))
        return orders

    def _record_to_order(self, record: dict) -> Order:
        """Convert Airtable record to Order object."""
        fields = record.get("fields", {})
        return Order(
            airtable_id=record.get("id"),
            order_id=fields.get("Order ID", ""),
            customer=fields.get("Customer Name", ""),
            status=fields.get("Status", "Pending"),
            priority=fields.get("Priority", "Medium"),
            order_total=float(fields.get("Order Total", 0)),
            created_at=datetime.fromisoformat(
                fields.get("Created At", datetime.now().isoformat())
            )
        )

    async def get_orders_paginated(
        self,
        page: int = 1,
        page_size: int = 100,
    ) -> tuple[List[Order], int]:
        """Fetch paginated orders from Airtable."""
        offset_count = (page - 1) * page_size

        all_records = await asyncio.to_thread(self.table.all)
        total_count = len(all_records)

        paginated_records = all_records[offset_count:offset_count + page_size]

        orders = [self._record_to_order(record) for record in paginated_records]

        return orders, total_count

    async def get_order_by_id(self, order_id: str) -> Order | None:
        """Fetch a single order by its Airtable ID."""
        record = await asyncio.to_thread(
            self.table.first,
            formula=f"{{Order ID}} = '{order_id}'"
        )

        if not record:
            return None

        fields = record.get("fields", {})
        order = Order(
            airtable_id=record.get("id"),
            order_id=fields.get("Order ID", ""),
            customer=fields.get("Customer Name", ""),
            status=fields.get("Status", "Pending"),
            priority=fields.get("Priority", "Medium"),
            order_total=float(fields.get("Order Total", 0)),
            created_at=datetime.fromisoformat(
                fields.get("Created At", datetime.now().isoformat())
            )
        )

        if not order:
            return None

        return order

    async def update_order(
        self,
        airtable_id: str,
        status: str | None = None,
        priority: str | None = None,
    ) -> Order:
        """Update an order in Airtable."""
        update_data = {}

        if status:
            update_data["Status"] = status
        if priority:
            update_data["Priority"] = priority


        func = partial(self.table.update, airtable_id, update_data)
        record = await asyncio.to_thread(func)

        fields = record.get("fields", {})
        return Order(
            airtable_id=record.get("id"),
            order_id=fields.get("Order ID", ""),
            customer=fields.get("Customer Name", ""),
            status=fields.get("Status", "Pending"),
            priority=fields.get("Priority", "Medium"),
            order_total=float(fields.get("Order Total", 0)),
            created_at=datetime.fromisoformat(
                fields.get("Created At", datetime.now().isoformat())
            )
        )

airtable_service = AirtableService()

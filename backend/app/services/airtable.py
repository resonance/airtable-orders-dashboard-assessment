import httpx
from typing import Optional
from datetime import datetime

from app.config import get_settings
from app.models.order import Order, OrderStatus, OrderPriority, OrderUpdate

AIRTABLE_API_URL = "https://api.airtable.com/v0"


class AirtableService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.airtable_api_key
        self.base_id = settings.airtable_base_id
        self.table_id = settings.airtable_table_id
        self.base_url = f"{AIRTABLE_API_URL}/{self.base_id}/{self.table_id}"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _parse_record(self, record: dict) -> Order:
        fields = record.get("fields", {})
        created_at = fields.get("Created At")
        updated_at = fields.get("Updated At")

        return Order(
            id=record["id"],
            order_id=fields.get("Order ID", ""),
            customer=fields.get("Customer", ""),
            status=OrderStatus(fields.get("Status", "Pending")),
            order_total=float(fields.get("Order Total", 0)),
            created_at=datetime.fromisoformat(created_at.replace("Z", "+00:00")) if created_at else datetime.now(),
            updated_at=datetime.fromisoformat(updated_at.replace("Z", "+00:00")) if updated_at else datetime.now(),
            priority=OrderPriority(fields.get("Priority", "Medium")),
        )

    async def fetch_all_orders(self) -> list[Order]:
        orders: list[Order] = []
        offset: Optional[str] = None

        async with httpx.AsyncClient(timeout=30.0) as client:
            while True:
                params = {"pageSize": 100}
                if offset:
                    params["offset"] = offset

                response = await client.get(
                    self.base_url,
                    headers=self.headers,
                    params=params,
                )

                if response.status_code == 429:
                    import asyncio
                    await asyncio.sleep(1)
                    continue

                response.raise_for_status()
                data = response.json()

                records = data.get("records", [])
                for record in records:
                    try:
                        order = self._parse_record(record)
                        orders.append(order)
                    except Exception as e:
                        print(f"Error parsing record {record.get('id')}: {e}")
                        continue

                offset = data.get("offset")
                if not offset:
                    break

        return orders

    async def update_order(self, record_id: str, update: OrderUpdate) -> Order:
        fields = {}

        if update.status is not None:
            fields["Status"] = update.status.value
        if update.priority is not None:
            fields["Priority"] = update.priority.value

        fields["Updated At"] = datetime.now().isoformat()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.patch(
                f"{self.base_url}/{record_id}",
                headers=self.headers,
                json={"fields": fields},
            )
            response.raise_for_status()
            data = response.json()

        return self._parse_record(data)


# Singleton instance
airtable_service = AirtableService()

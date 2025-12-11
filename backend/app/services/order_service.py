"""Business logic for managing orders."""

from app.schemas.order import (
    OrdersListResponse,
)
from app.services.airtable_service import airtable_service

class OrderService:
    """Service for managing orders."""

    async def get_orders_list(self) -> OrdersListResponse:
        """Retrieve the list of orders."""
        orders = await airtable_service.get_all_orders()
        return OrdersListResponse(orders=orders, total=len(orders))


order_service = OrderService()

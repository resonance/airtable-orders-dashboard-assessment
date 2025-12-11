"""Business logic for managing orders."""

from app.schemas.order import (
    OrdersListResponse,
)
from app.services.airtable_service import airtable_service

class OrderService:
    """Service for managing orders."""

    async def get_orders_list(
        self,
        page: int = 1,
        page_size: int = 100,
    ) -> OrdersListResponse:
        """Retrieve the list of orders."""
        orders = await airtable_service.get_all_orders()

        total = len(orders)
        total_pages = (total + page_size - 1)
        start = (page - 1) * page_size
        end = start + page_size
        page_orders = orders[start:end]


        return OrdersListResponse(
            data=page_orders,
            meta={
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": total_pages,
            }
        )

order_service = OrderService()

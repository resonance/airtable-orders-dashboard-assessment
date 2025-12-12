"""Business logic for managing orders."""

from app.schemas.order import (
    Order,
    OrderResponse,
    OrderUpdateResponse,
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

    async def get_order(self, order_id: str) -> OrderResponse:
        """Retrieve a single order by its ID."""
        order = await airtable_service.get_order_by_id(order_id)
        return OrderResponse(data=order) if order else None

    async def update_order(
        self,
        order_id: str,
        status: str | None = None,
        priority: str | None = None,
    ) -> Order | None:
        """Update an order."""
        order = await airtable_service.get_order_by_id(order_id)

        if not order:
            raise ValueError("Order not found")

        updated_order = await airtable_service.update_order(
            airtable_id=order.airtable_id,
            status=status,
            priority=priority,
        )

        return OrderUpdateResponse(data=updated_order)


order_service = OrderService()

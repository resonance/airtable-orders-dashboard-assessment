"""Business logic for managing orders."""

from app.schemas.order import (
    Order,
    OrderResponse,
    OrderUpdateResponse,
    OrdersListResponse,
    OrdersSummaryResponse,
    StatusSummary,
    OrderStatus,
    DailySummary,
    AnalyticsData,
    OrderPriority,
    SyncData,
    SyncResponse,
)
from app.services.airtable_service import airtable_service
from collections import defaultdict
from typing import Dict, List
from datetime import datetime, timedelta, timezone

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
        status: OrderStatus | None = None,
        priority: OrderPriority | None = None,
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

    async def get_orders_summary(self):
        """Get summary statistics for orders in the last 30 days."""
        all_orders = await airtable_service.get_all_orders()

        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        orders = [
            order for order in all_orders
            if order.created_at >= thirty_days_ago
        ]

        total_orders = len(orders)
        total_revenue = sum(order.order_total for order in orders)

        status_groups: Dict[str, List[Order]] = defaultdict(list)
        for order in orders:
            status_groups[order.status].append(order)

        by_status: List[StatusSummary] = []
        for status in OrderStatus:
            orders_in_status = status_groups.get(status.value, [])
            by_status.append(
                StatusSummary(
                    status=status.value,
                    count=len(orders_in_status),
                    total_revenue=sum(o.order_total for o in orders_in_status),
                )
            )

        last_30_days = await self._compute_daily_summary(orders, days=30)

        return OrdersSummaryResponse(
            data=AnalyticsData(
                total_orders=total_orders,
                total_revenue=total_revenue,
                by_status=by_status,
                last_30_days=last_30_days,
            )
        )


    async def _compute_daily_summary(self, orders: List[Order], days: int = 30) -> List[DailySummary]:
        """Compute daily summary of orders for the last given number of days."""
        if not orders:
            return []

        daily_counts: Dict[str, int] = defaultdict(int)

        for order in orders:
            date_str = order.created_at.strftime("%Y-%m-%d")
            daily_counts[date_str] += 1

        sorted_dates = sorted(daily_counts.keys())
        result: List[DailySummary] = []

        for date_str in sorted_dates:
            result.append(
                DailySummary(
                    date=date_str,
                    order_count=daily_counts[date_str],
                )
            )

        return result

    async def sync_orders(self) -> SyncResponse:
        """Sync orders from Airtable and return sync summary."""
        records_synced = await airtable_service.get_all_orders()
        records_count = len(records_synced)

        summary = await self.get_orders_summary()

        return SyncResponse(
            data=SyncData(
                success=True,
                message=f"Successfully synced {records_count} orders",
                records_synced=records_count,
                summary=summary.data,
            )
        )

order_service = OrderService()

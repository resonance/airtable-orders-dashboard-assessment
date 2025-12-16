from datetime import datetime, timedelta
from collections import defaultdict
from typing import Optional
import asyncio

from app.models.order import Order, OrderSummary, PaginatedOrders
from app.services.airtable import airtable_service


class OrdersCache:
    def __init__(self):
        self._orders: dict[str, Order] = {}
        self._summary: Optional[OrderSummary] = None
        self._last_synced_at: Optional[datetime] = None
        self._lock = asyncio.Lock()
        self._is_syncing = False

    @property
    def is_initialized(self) -> bool:
        return len(self._orders) > 0

    @property
    def is_syncing(self) -> bool:
        return self._is_syncing

    async def sync_from_airtable(self) -> OrderSummary:
        async with self._lock:
            self._is_syncing = True

        try:
            orders = await airtable_service.fetch_all_orders()

            async with self._lock:
                self._orders = {order.id: order for order in orders}
                self._last_synced_at = datetime.now()
                self._summary = self._compute_summary()

            return self._summary

        finally:
            async with self._lock:
                self._is_syncing = False

    def _compute_summary(self) -> OrderSummary:
        orders = list(self._orders.values())

        count_by_status: dict[str, int] = defaultdict(int)
        total_by_status: dict[str, float] = defaultdict(float)

        for order in orders:
            status = order.status.value
            count_by_status[status] += 1
            total_by_status[status] += order.order_total

        today = datetime.now().date()
        thirty_days_ago = today - timedelta(days=30)

        orders_per_day: dict[str, int] = defaultdict(int)
        for order in orders:
            order_date = order.created_at.date()
            if order_date >= thirty_days_ago:
                date_str = order_date.isoformat()
                orders_per_day[date_str] += 1

        orders_per_day_list = [
            {"date": date, "count": count}
            for date, count in sorted(orders_per_day.items())
        ]

        return OrderSummary(
            total_orders=len(orders),
            count_by_status=dict(count_by_status),
            total_by_status=dict(total_by_status),
            orders_per_day=orders_per_day_list,
            last_synced_at=self._last_synced_at,
        )

    async def get_summary(self) -> OrderSummary:
        if not self.is_initialized:
            return await self.sync_from_airtable()

        async with self._lock:
            return self._summary or self._compute_summary()

    async def get_orders(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> PaginatedOrders:
        if not self.is_initialized:
            await self.sync_from_airtable()

        async with self._lock:
            orders = list(self._orders.values())

        # Filter
        if status:
            orders = [o for o in orders if o.status.value == status]
        if priority:
            orders = [o for o in orders if o.priority.value == priority]

        # Sort by created_at descending (most recent first)
        orders.sort(key=lambda o: o.created_at, reverse=True)

        # Paginate
        total = len(orders)
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size
        paginated_orders = orders[start:end]

        return PaginatedOrders(
            orders=paginated_orders,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    async def get_order_by_id(self, record_id: str) -> Optional[Order]:
        async with self._lock:
            return self._orders.get(record_id)

    async def update_order_in_cache(self, order: Order):
        async with self._lock:
            self._orders[order.id] = order
            self._summary = self._compute_summary()


# Singleton instance
orders_cache = OrdersCache()

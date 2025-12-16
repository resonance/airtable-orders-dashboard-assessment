from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"


class OrderPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Order(BaseModel):
    id: str  # Airtable record ID
    order_id: str
    customer: str
    status: OrderStatus
    order_total: float
    created_at: datetime
    updated_at: datetime
    priority: OrderPriority


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    priority: Optional[OrderPriority] = None


class OrderSummary(BaseModel):
    total_orders: int
    count_by_status: dict[str, int]
    total_by_status: dict[str, float]
    orders_per_day: list[dict]  # [{date: str, count: int}]
    last_synced_at: Optional[datetime] = None


class PaginatedOrders(BaseModel):
    orders: list[Order]
    total: int
    page: int
    page_size: int
    total_pages: int

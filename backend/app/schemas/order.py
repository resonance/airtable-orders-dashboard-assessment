"""Schemas for Order operations."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class OrderStatus(str, Enum):
    """Enumeration for Order Status."""

    PENDING = "Pending"
    PROCESSING = "Processing"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELED = "Cancelled"

class OrderPriority(str, Enum):
    """Enumeration for Order Priority."""

    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Order(BaseModel):
    """Order Model."""

    airtable_id: str
    order_id: str
    customer: str
    status: OrderStatus
    priority: OrderPriority
    order_total: float
    created_at: datetime

    class Config:
        populate_by_name = True

class OrdersListResponse(BaseModel):
    """Orders List Response Model."""

    data: List[Order]
    meta: dict

class OrderResponse(BaseModel):
    """Order Response Model."""

    data: Order

class OrderUpdate(BaseModel):
    """Order Update Model."""

    status: Optional[OrderStatus] = None
    priority: Optional[OrderPriority] = None

class OrderUpdateResponse(BaseModel):
    """Order Update Response Model."""

    data: Order


class StatusSummary(BaseModel):
    """Status Summary Model."""

    status: str
    count: int
    total_revenue: float

class DailySummary(BaseModel):
    """Daily Summary Model."""

    date: str
    count: int

class AnalyticsData(BaseModel):
    """Analytics Data Model."""

    total_orders: int
    total_revenue: float
    by_status: List[StatusSummary]
    last_30_days: List[DailySummary]

class OrdersSummaryResponse(BaseModel):
    """Orders Summary Response Model."""

    data: AnalyticsData


class SyncData(BaseModel):
    """Sync Data Model."""

    success: bool
    message: str
    records_synced: int
    summary: AnalyticsData

class SyncResponse(BaseModel):
    """Sync Response Model."""

    data: SyncData

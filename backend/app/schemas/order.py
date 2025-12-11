"""Schemas for Order operations."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Order(BaseModel):
    """Order Model."""

    airtable_id: str
    order_id: str
    customer: str = Field(..., alias="customer_name")
    status: str
    priority: str
    order_total: float
    created_at: datetime

    class Config:
        populate_by_name = True

class OrdersListResponse(BaseModel):
    """Orders List Response Model."""

    orders: List[Order]
    total: int

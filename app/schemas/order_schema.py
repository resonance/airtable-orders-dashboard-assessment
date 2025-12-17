from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class  OrderBase(BaseModel):
    order_id: Optional[str]
    customer: Optional[str]
    status: Optional[str]
    priority: Optional[str]
    order_total: Optional[float]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class OrderResponse(OrderBase):
    record_id: str

    class Config:
        orm_mode = True

class UpdateOrder(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None 

class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class PaginatedOrders(BaseModel):
    data: list[OrderResponse]
    pagination: PaginationMeta
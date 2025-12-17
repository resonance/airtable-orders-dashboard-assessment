from fastapi import APIRouter, Query
from typing import Optional
from app.controllers.order_controller import (
    list_orders,
    get_order,
    update_order,
    get_summary,
    trigger_sync
)
from app.schemas.order_schema import OrderResponse, UpdateOrder, PaginatedOrders
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/", summary="List orders with filters and pagination")
def route_list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    customer: Optional[str] = Query(None),
    order_by: str = Query("created_at"),
    desc: bool = Query(True)
):
    from datetime import datetime
    sd = datetime.fromisoformat(start_date) if start_date else None
    ed = datetime.fromisoformat(end_date) if end_date else None
    return list_orders(
        page=page, page_size=page_size, start_date=sd, end_date=ed,
        status=status, priority=priority, customer=customer,
        order_by=order_by, desc=desc
    )

@router.get("/id/{record_id}", response_model=OrderResponse)
def route_get_order(record_id: str):
    return get_order(record_id)

@router.patch("/{record_id}", response_model=OrderResponse)
def route_update_order(record_id: str, payload: UpdateOrder):
    return update_order(record_id, payload)

@router.get("/summary")
def route_summary():
    return get_summary()

@router.post("/sync")
def route_sync():
    res = trigger_sync()
    return JSONResponse(content=res)

@router.get(
    "",
    response_model=PaginatedOrders,
    summary="List orders with pagination and filters"
)
def route_list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    customer: Optional[str] = None,
    order_by: str = "created_at",
    desc: bool = True
):
    from datetime import datetime

    sd = datetime.fromisoformat(start_date) if start_date else None
    ed = datetime.fromisoformat(end_date) if end_date else None

    return list_orders(
        page=page,
        page_size=page_size,
        start_date=sd,
        end_date=ed,
        status=status,
        priority=priority,
        customer=customer,
        order_by=order_by,
        desc=desc
    )

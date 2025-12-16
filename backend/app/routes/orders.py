from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.models.order import OrderSummary, OrderUpdate, PaginatedOrders, Order
from app.services.cache import orders_cache
from app.services.airtable import airtable_service

router = APIRouter()


@router.get("/summary", response_model=OrderSummary)
async def get_orders_summary():
    try:
        summary = await orders_cache.get_summary()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching summary: {str(e)}")


@router.post("/sync", response_model=OrderSummary)
async def sync_orders():
    if orders_cache.is_syncing:
        raise HTTPException(status_code=409, detail="Sync already in progress")

    try:
        summary = await orders_cache.sync_from_airtable()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing: {str(e)}")


@router.get("", response_model=PaginatedOrders)
async def get_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
):
    try:
        orders = await orders_cache.get_orders(
            page=page,
            page_size=page_size,
            status=status,
            priority=priority,
        )
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await orders_cache.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}", response_model=Order)
async def update_order(order_id: str, update: OrderUpdate):
    existing_order = await orders_cache.get_order_by_id(order_id)
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")

    if update.status is None and update.priority is None:
        raise HTTPException(status_code=400, detail="Provide status or priority")

    try:
        updated_order = await airtable_service.update_order(order_id, update)
        await orders_cache.update_order_in_cache(updated_order)
        return updated_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")

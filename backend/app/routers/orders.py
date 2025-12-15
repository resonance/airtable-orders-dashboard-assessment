from fastapi import APIRouter, HTTPException, Query, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings
from app.schemas.order import (
    OrderUpdateResponse,
    OrdersListResponse,
    OrderUpdate,
    OrderResponse,
    OrdersSummaryResponse,
    SyncResponse,
)
from app.services.order_service import order_service

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)

@router.get("/", response_model=OrdersListResponse)
@limiter.limit(settings.rate_limit_orders_list)
async def list_orders(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
):
    """Endpoint to list all orders."""
    try:
        return await order_service.get_orders_list(page=page, page_size=page_size)
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to fetch orders: {str(e)}",
        )

@router.get("/summary", response_model=OrdersSummaryResponse)
@limiter.limit(settings.rate_limit_orders_summary)
async def get_orders_summary(request: Request):
    """Endpoint to get orders summary."""
    try:
        return await order_service.get_orders_summary()
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to fetch orders summary: {str(e)}",
        )

@router.post("/sync", response_model=SyncResponse)
@limiter.limit(settings.rate_limit_orders_sync)
async def sync_orders(request: Request):
    """Endpoint to sync orders from Airtable."""
    try:
        return await order_service.sync_orders()
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to sync orders: {str(e)}",
        )


@router.get("/{order_id}", response_model=OrderResponse)
@limiter.limit(settings.rate_limit_orders_get)
async def get_order(request: Request, order_id: str):
    """Endpoint to get a single order by ID."""
    try:
        order = await order_service.get_order(order_id)
        if not order:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                "Order not found",
            )
        return order
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to fetch order: {str(e)}",
        )

@router.patch("/{order_id}", response_model=OrderUpdateResponse)
@limiter.limit(settings.rate_limit_orders_update)
async def update_order(
    request: Request,
    order_id: str,
    data: OrderUpdate,
):
    """Endpoint to update an order."""
    try:
        return await order_service.update_order(
            order_id=order_id,
            status=data.status,
            priority=data.priority,
        )
    except ValueError as e:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            str(e),
        )
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to update order: {str(e)}",
        )

from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.order import (
    OrderUpdateResponse,
    OrdersListResponse,
    OrderUpdate,
    OrderResponse,
    OrdersSummaryResponse,
)
from app.services.order_service import order_service

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)

@router.get("/", response_model=OrdersListResponse)
async def list_orders(
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
async def get_orders_summary():
    """Endpoint to get orders summary."""
    try:
        return await order_service.get_orders_summary()
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to fetch orders summary: {str(e)}",
        )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
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
async def update_order(
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

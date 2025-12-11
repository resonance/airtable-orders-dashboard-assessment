from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.order import (
    OrdersListResponse,
)
from app.services.order_service import order_service

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
)

@router.get("/", response_model=OrdersListResponse)
async def list_orders():
    """Endpoint to list all orders."""
    try:
        return await order_service.get_orders_list()
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error to fetch orders: {str(e)}",
        )

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Order as OrderModel
from app.schemas.order_schema import OrderResponse, UpdateOrder
from app.services.airtable_service import AirtableService
from app.services.sync_service import parse_iso, sync_all
from app.config import VALID_STATES, VALID_PRIORITIES
from fastapi import HTTPException
from datetime import datetime
from math import ceil

air = AirtableService()

def _to_response(o: OrderModel) -> OrderResponse:
    return OrderResponse(
        record_id=o.record_id,
        order_id=o.order_id,
        customer=o.customer,
        status=o.status,
        priority=o.priority,
        order_total=o.order_total,
        created_at=o.created_at,
        updated_at=o.updated_at
    )

def list_orders(
    *,
    page: int = 1,
    page_size: int = 20,
    start_date: datetime = None,
    end_date: datetime = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    customer: Optional[str] = None,
    order_by: str = "created_at",
    desc: bool = True
) -> Dict[str, Any]:
    db: Session = SessionLocal()
    try:
        q = db.query(OrderModel)

        if customer:
            q = q.filter(OrderModel.customer.ilike(f"%{customer}%"))
        if status:
            q = q.filter(OrderModel.status == status)
        if priority:
            q = q.filter(OrderModel.priority == priority)
        if start_date:
            q = q.filter(OrderModel.created_at >= start_date)
        if end_date:
            q = q.filter(OrderModel.created_at <= end_date)

        total = q.count()

        order_col = getattr(OrderModel, order_by, None)
        if order_col is not None:
            if desc:
                q = q.order_by(order_col.desc())
            else:
                q = q.order_by(order_col.asc())

        offset = (page - 1) * page_size
        items = q.offset(offset).limit(page_size).all()

        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "items": [ _to_response(i) for i in items ]
        }
    finally:
        db.close()

def get_order(record_id: str) -> OrderResponse:
    db = SessionLocal()
    try:
        o = db.query(OrderModel).filter_by(record_id=record_id).first()
        if not o:
            raise HTTPException(status_code=404, detail="Order not found")
        return _to_response(o)
    finally:
        db.close()

def update_order(record_id: str, payload):
    db = SessionLocal()
    try:
        order = db.query(OrderModel).filter_by(record_id=record_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if payload.status:
            order.status = payload.status

        if payload.priority:
            order.priority = payload.priority

        order.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(order)
        return order

    except:
        db.rollback()
        raise
    finally:
        db.close()

def get_summary() -> Dict[str, Any]:
    db = SessionLocal()
    try:
        total = db.query(OrderModel).count()
        pending = db.query(OrderModel).filter(OrderModel.status == "Pending").count()
        completed = db.query(OrderModel).filter(OrderModel.status == "Completed").count()
        cancelled = db.query(OrderModel).filter(OrderModel.status == "Cancelled").count()
        Processing = db.query(OrderModel).filter(OrderModel.status == "Processing").count()
        Delivered = db.query(OrderModel).filter(OrderModel.status == "Delivered").count()
        low_priority = db.query(OrderModel).filter(OrderModel.priority == "Low").count()
        medium_priority = db.query(OrderModel).filter(OrderModel.priority == "Medium").count()
        urgent_priority = db.query(OrderModel).filter(OrderModel.priority == "Urgent").count()
        high_priority = db.query(OrderModel).filter(OrderModel.priority == "High").count()
        total_amount = db.query(OrderModel).with_entities(
            (OrderModel.order_total)
        ).all()
        
        s = 0.0
        for t in total_amount:
            try:
                s += float(t[0]) if t[0] is not None else 0.0
            except:
                pass
        return {
            "total_orders": total,
            "pending": pending,
            "completed": completed,
            "high_priority": high_priority,
            "medium_priority": medium_priority,
            "low_priority": low_priority,
            "urgent_priority": urgent_priority,
            "processing": Processing,
            "cancelled": cancelled,
            "delivered": Delivered,
            "total_amount": s
        }
    finally:
        db.close()

def trigger_sync():
    return sync_all()


def list_orders(
    page: int,
    page_size: int,
    start_date=None,
    end_date=None,
    status=None,
    priority=None,
    customer=None,
    order_by="created_at",
    desc=True
):
    db: Session = SessionLocal()

    try:
        query = db.query(OrderModel)

        # 🔍 Filtros
        if start_date:
            query = query.filter(OrderModel.created_at >= start_date)
        if end_date:
            query = query.filter(OrderModel.created_at <= end_date)
        if status:
            query = query.filter(OrderModel.status == status)
        if priority:
            query = query.filter(OrderModel.priority == priority)
        if customer:
            query = query.filter(OrderModel.customer.ilike(f"%{customer}%"))

        total = query.count()

        column = getattr(OrderModel, order_by, OrderModel.created_at)
        query = query.order_by(column.desc() if desc else column.asc())

        offset = (page - 1) * page_size
        orders = query.offset(offset).limit(page_size).all()

        return {
            "data": orders,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": ceil(total / page_size) if total else 1
            }
        }

    finally:
        db.close()
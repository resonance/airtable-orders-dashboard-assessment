from app.services.airtable_service import AirtableService
from app.database import SessionLocal
from app.models import Order as OrderModel
from datetime import datetime, timezone
import json
from app.config import VALID_STATES, VALID_PRIORITIES

air = AirtableService()

def parse_iso(dt_str):
    if not dt_str:
        return None
    # Airtable returns e.g. "2025-12-05T19:47:15.000Z"
    try:
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except Exception:
        return None

def normalize_datetime(dt):
    if not dt:
        return None
    if dt.tzinfo:
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt

def upsert_from_record(record: dict, db):
    record_id = record.get("id")
    fields = record.get("fields", {})

    order_id = fields.get("Order ID")
    customer = fields.get("Customer")
    status = fields.get("Status")
    priority = fields.get("Priority")
    order_total = fields.get("Order Total")
    created_at = parse_iso(fields.get("Created At") or record.get("createdTime"))
    updated_at = parse_iso(fields.get("Updated At") or record.get("createdTime"))

    existing = db.query(OrderModel).filter_by(record_id=record_id).first()

    existing_update= normalize_datetime(existing.updated_at)
    incoming_update = normalize_datetime(updated_at)

    if existing_update and incoming_update and existing_update >= incoming_update:
        return False
        existing.order_id = order_id
        existing.customer = customer
        existing.status = status
        existing.priority = priority
        existing.order_total = order_total
        existing.created_at = created_at
        existing.updated_at = updated_at
        existing.raw_fields = json.dumps(fields)
        db.add(existing)
        return True
    else:
        new = OrderModel(
            record_id=record_id,
            order_id=order_id,
            customer=customer,
            status=status,
            priority=priority,
            order_total=order_total,
            created_at=created_at,
            updated_at=updated_at,
            raw_fields=json.dumps(fields)
        )
        db.add(new)
        return True

def sync_all():
    db = SessionLocal()
    try:
        records = air.get_all_records()
        inserted = 0
        updated = 0
        for r in records:
            changed = upsert_from_record(r, db)
            if changed:
                inserted += 1
        db.commit()
        return {"fetched": len(records), "affected": inserted}
    except Exception as e:
        db.rollback()
        raise
    finally:
        db.close()

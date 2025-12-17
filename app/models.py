from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base
import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(String, unique=True, index=True) 
    order_id = Column(String, index=True, nullable=True) 
    customer = Column(String, index=True, nullable=True)
    status = Column(String, index=True, nullable=True)
    priority = Column(String, index=True, nullable=True)
    order_total = Column(Float, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)  
    raw_fields = Column(Text, nullable=True) 
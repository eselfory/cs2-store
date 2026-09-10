from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, Text, JSON, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class OrderStatus(str, enum.Enum):
    PENDING     = "pending"
    PAID        = "paid"
    PROCESSING  = "processing"
    SHIPPED     = "shipped"
    DELIVERED   = "delivered"
    CANCELLED   = "cancelled"
    REFUNDED    = "refunded"

class Order(Base):
    __tablename__ = "orders"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id             = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Estado
    status              = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    # Precios
    subtotal            = Column(Float, nullable=False)
    shipping_cost       = Column(Float, default=0)
    discount            = Column(Float, default=0)
    total               = Column(Float, nullable=False)
    
    # MercadoPago
    mp_payment_id       = Column(String(200), nullable=True)
    mp_preference_id    = Column(String(200), nullable=True)
    mp_status           = Column(String(100), nullable=True)
    
    # Envío
    shipping_name       = Column(String(200), nullable=True)
    shipping_email      = Column(String(200), nullable=True)
    shipping_phone      = Column(String(50), nullable=True)
    shipping_address    = Column(String(500), nullable=True)
    shipping_city       = Column(String(100), nullable=True)
    shipping_province   = Column(String(100), nullable=True)
    shipping_zip        = Column(String(20), nullable=True)
    tracking_number     = Column(String(200), nullable=True)
    
    # Notas
    notes               = Column(Text, nullable=True)
    
    # Timestamps
    created_at          = Column(DateTime(timezone=True), server_default=func.now())
    updated_at          = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at             = Column(DateTime(timezone=True), nullable=True)
    shipped_at          = Column(DateTime(timezone=True), nullable=True)

    # Relaciones
    user                = relationship("User", back_populates="orders")
    items               = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id    = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id  = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    
    quantity    = Column(Integer, nullable=False)
    size        = Column(String(10), nullable=False)
    back_option = Column(String(200), nullable=True)
    unit_price  = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Relaciones
    order       = relationship("Order", back_populates="items")
    product     = relationship("Product", back_populates="order_items")

class CartItem(Base):
    __tablename__ = "cart_items"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    product_id  = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    
    quantity    = Column(Integer, default=1)
    size        = Column(String(10), nullable=False)
    back_option = Column(String(200), nullable=True)
    
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    user        = relationship("User", back_populates="cart_items")
    product     = relationship("Product", back_populates="cart_items")
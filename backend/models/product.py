from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class Product(Base):
    __tablename__ = "products"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Info básica
    name        = Column(String(200), nullable=False)
    slug        = Column(String(200), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    type        = Column(String(50), nullable=False)  # crewneck, hoodie, tshirt
    map_ref     = Column(String(100), nullable=True)  # Cache, Mirage, Dust, etc.
    
    # Precios
    price       = Column(Float, nullable=False)
    old_price   = Column(Float, nullable=True)
    
    # Stock
    in_stock    = Column(Boolean, default=True)
    stock_count = Column(Integer, default=0)
    
    # Talles disponibles
    sizes       = Column(JSON, default=["S", "M", "L", "XL", "XXL"])
    
    # Opciones de estampado trasero
    back_options = Column(JSON, default=[])
    
    # Imágenes
    images      = Column(JSON, default=[])
    
    # Specs técnicas
    material    = Column(String(200), nullable=True)  # 380GSM / WASHED
    weight      = Column(String(50), nullable=True)   # OVERSIZE
    
    # CS2 / Steam
    cs2_skin_ref    = Column(String(200), nullable=True)
    cs2_skin_float  = Column(Float, nullable=True)
    cs2_skin_seed   = Column(Integer, nullable=True)
    
    # 3D
    model_3d_url    = Column(String(500), nullable=True)
    texture_url     = Column(String(500), nullable=True)
    
    # SEO
    meta_title      = Column(String(200), nullable=True)
    meta_description = Column(String(500), nullable=True)
    
    # Estado
    is_active       = Column(Boolean, default=True)
    is_featured     = Column(Boolean, default=False)
    drop_number     = Column(Integer, default=1)
    
    # Timestamps
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    cart_items      = relationship("CartItem", back_populates="product")
    order_items     = relationship("OrderItem", back_populates="product")

    def __repr__(self):
        return f"<Product {self.name}>"
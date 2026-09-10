from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email             = Column(String(255), unique=True, nullable=True)
    username          = Column(String(100), unique=True, nullable=False)
    hashed_password   = Column(String(255), nullable=True)
    
    # Steam
    steam_id          = Column(String(50), unique=True, nullable=True)
    steam_username    = Column(String(100), nullable=True)
    steam_avatar      = Column(String(500), nullable=True)
    steam_profile_url = Column(String(500), nullable=True)
    
    # Roles y estado
    is_active         = Column(Boolean, default=True)
    is_admin          = Column(Boolean, default=False)
    is_verified       = Column(Boolean, default=False)
    
    # Timestamps
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
    updated_at        = Column(DateTime(timezone=True), onupdate=func.now())
    last_login        = Column(DateTime(timezone=True), nullable=True)

    # Relaciones
    orders            = relationship("Order", back_populates="user")
    cart_items        = relationship("CartItem", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
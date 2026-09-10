from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models.order import Order, OrderItem, OrderStatus, CartItem
from models.product import Product
from models.user import User
from routers.auth import get_current_user, get_admin_user
from config import settings
import mercadopago

router = APIRouter()

class ShippingInfo(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    province: str
    zip: str
    notes: Optional[str] = None

@router.post("/checkout")
async def checkout(
    shipping: ShippingInfo,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(CartItem).where(CartItem.user_id == current_user.id))
    cart_items = result.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="El carrito está vacío")

    subtotal = 0
    order_items = []
    mp_items = []

    for cart_item in cart_items:
        prod_result = await db.execute(select(Product).where(Product.id == cart_item.product_id))
        product = prod_result.scalar_one_or_none()
        if not product or not product.in_stock:
            raise HTTPException(status_code=400, detail="Producto no disponible")

        item_total = product.price * cart_item.quantity
        subtotal += item_total

        order_items.append(OrderItem(
            product_id=product.id,
            quantity=cart_item.quantity,
            size=cart_item.size,
            back_option=cart_item.back_option,
            unit_price=product.price,
            total_price=item_total
        ))

        mp_items.append({
            "id": str(product.id),
            "title": f"{product.name} - Talle {cart_item.size}",
            "quantity": cart_item.quantity,
            "unit_price": product.price,
            "currency_id": "ARS"
        })

    order = Order(
        user_id=current_user.id,
        subtotal=subtotal,
        total=subtotal,
        shipping_name=shipping.name,
        shipping_email=shipping.email,
        shipping_phone=shipping.phone,
        shipping_address=shipping.address,
        shipping_city=shipping.city,
        shipping_province=shipping.province,
        shipping_zip=shipping.zip,
        notes=shipping.notes
    )
    db.add(order)
    await db.flush()

    for item in order_items:
        item.order_id = order.id
        db.add(item)

    sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
    preference_data = {
        "items": mp_items,
        "payer": {"email": shipping.email},
        "back_urls": {
            "success": "http://localhost:3000/orden/exitosa",
            "failure": "http://localhost:3000/orden/fallida",
            "pending": "http://localhost:3000/orden/pendiente"
        },
        "auto_return": "approved",
        "external_reference": str(order.id)
    }
    preference = sdk.preference().create(preference_data)["response"]
    order.mp_preference_id = preference.get("id")
    await db.commit()

    return {
        "order_id": str(order.id),
        "mp_init_point": preference.get("init_point"),
        "mp_sandbox_init_point": preference.get("sandbox_init_point")
    }

@router.get("/")
async def get_my_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    return [format_order(o) for o in orders]

@router.get("/{order_id}")
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return format_order
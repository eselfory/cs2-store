from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from database import get_db
from models.order import CartItem
from models.product import Product
from models.user import User
from routers.auth import get_current_user
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class CartAdd(BaseModel):
    product_id: str
    quantity: int = 1
    size: str
    back_option: str = ""

class CartUpdate(BaseModel):
    quantity: int

@router.get("/")
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == current_user.id)
    )
    items = result.scalars().all()
    total = 0
    cart = []
    for item in items:
        prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = prod_result.scalar_one_or_none()
        if product:
            subtotal = product.price * item.quantity
            total += subtotal
            cart.append({
                "id": str(item.id),
                "product_id": str(item.product_id),
                "name": product.name,
                "price": product.price,
                "image": product.images[0] if product.images else None,
                "size": item.size,
                "back_option": item.back_option,
                "quantity": item.quantity,
                "subtotal": subtotal
            })
    return {"items": cart, "total": total}

@router.post("/")
async def add_to_cart(
    data: CartAdd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prod_result = await db.execute(select(Product).where(Product.id == data.product_id))
    product = prod_result.scalar_one_or_none()
    if not product or not product.in_stock:
        raise HTTPException(status_code=404, detail="Producto no disponible")

    result = await db.execute(
        select(CartItem).where(
            CartItem.user_id == current_user.id,
            CartItem.product_id == data.product_id,
            CartItem.size == data.size,
            CartItem.back_option == data.back_option
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.quantity += data.quantity
    else:
        item = CartItem(
            user_id=current_user.id,
            product_id=data.product_id,
            quantity=data.quantity,
            size=data.size,
            back_option=data.back_option
        )
        db.add(item)

    await db.commit()
    return {"message": "Producto agregado al carrito"}

@router.put("/{item_id}")
async def update_cart_item(
    item_id: str,
    data: CartUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    if data.quantity <= 0:
        await db.delete(item)
    else:
        item.quantity = data.quantity

    await db.commit()
    return {"message": "Carrito actualizado"}

@router.delete("/{item_id}")
async def remove_from_cart(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    await db.delete(item)
    await db.commit()
    return {"message": "Item eliminado del carrito"}

@router.delete("/")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(CartItem).where(CartItem.user_id == current_user.id))
    items = result.scalars().all()
    for item in items:
        await db.delete(item)
    await db.commit()
    return {"message": "Carrito vaciado"}
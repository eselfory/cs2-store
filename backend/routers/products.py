from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from pydantic import BaseModel
from database import get_db
from models.product import Product
from routers.auth import get_current_user, get_admin_user
from config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address
import uuid

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# ── Schemas ──────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    type: str
    map_ref: Optional[str] = None
    price: float
    old_price: Optional[float] = None
    stock_count: int = 0
    sizes: list = ["S", "M", "L", "XL", "XXL"]
    back_options: list = []
    images: list = []
    material: Optional[str] = None
    weight: Optional[str] = None
    cs2_skin_ref: Optional[str] = None
    model_3d_url: Optional[str] = None
    texture_url: Optional[str] = None
    is_featured: bool = False
    drop_number: int = 1

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    stock_count: Optional[int] = None
    in_stock: Optional[bool] = None
    images: Optional[list] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None

# ── Endpoints públicos ───────────────────────────────────
@router.get("/")
@limiter.limit("60/minute")
async def get_products(
    request: Request,
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    type: Optional[str] = None,
    in_stock: Optional[bool] = None,
    sort: Optional[str] = Query(None, regex="^(price_asc|price_desc|name|newest)$"),
    search: Optional[str] = None,
):
    query = select(Product).where(Product.is_active == True)

    if type:
        query = query.where(Product.type == type)
    if in_stock is not None:
        query = query.where(Product.in_stock == in_stock)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    # Total
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar()

    # Paginación
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()

    return {
        "products": [format_product(p) for p in products],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@router.get("/{slug}")
@limiter.limit("60/minute")
async def get_product(
    request: Request,
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return format_product(product)

# ── Endpoints admin ──────────────────────────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return format_product(product)

@router.put("/{product_id}")
async def update_product(
    product_id: str,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return format_product(product)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    product.is_active = False
    await db.commit()
    return {"message": "Producto eliminado correctamente"}

# ── Helper ───────────────────────────────────────────────
def format_product(p: Product) -> dict:
    return {
        "id": str(p.id),
        "name": p.name,
        "slug": p.slug,
        "description": p.description,
        "type": p.type,
        "map_ref": p.map_ref,
        "price": p.price,
        "old_price": p.old_price,
        "in_stock": p.in_stock,
        "stock_count": p.stock_count,
        "sizes": p.sizes,
        "back_options": p.back_options,
        "images": p.images,
        "material": p.material,
        "cs2_skin_ref": p.cs2_skin_ref,
        "model_3d_url": p.model_3d_url,
        "texture_url": p.texture_url,
        "is_featured": p.is_featured,
        "drop_number": p.drop_number,
        "created_at": p.created_at,
    }
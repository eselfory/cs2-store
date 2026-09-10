from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from database import get_db
from models.user import User
from routers.auth import get_current_user, get_admin_user, hash_password

router = APIRouter()

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

@router.put("/me")
async def update_profile(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.username:
        current_user.username = data.username
    if data.email:
        current_user.email = data.email
    if data.password:
        current_user.hashed_password = hash_password(data.password)
    await db.commit()
    return {"message": "Perfil actualizado"}

@router.get("/admin/all")
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [{"id": str(u.id), "username": u.username, "email": u.email, "is_admin": u.is_admin, "created_at": u.created_at} for u in users]

@router.put("/admin/{user_id}/toggle")
async def toggle_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.is_active = not user.is_active
    await db.commit()
    return {"message": f"Usuario {'activado' if user.is_active else 'desactivado'}"}
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from database import get_db
from models.user import User
from config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ── Schemas ──────────────────────────────────────────────
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str | None = None

# ── Helpers ──────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permisos de administrador"
        )
    return current_user

# ── Endpoints ────────────────────────────────────────────
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, data: UserRegister, db: AsyncSession = Depends(get_db)):
    # Verificar si ya existe
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="El username ya está en uso")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_token(
        {"sub": str(user.id)},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": str(user.id), "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return Token(access_token=access_token, refresh_token=refresh_token)

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Cuenta desactivada")

    user.last_login = datetime.utcnow()
    await db.commit()

    access_token = create_token(
        {"sub": str(user.id)},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": str(user.id), "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return Token(access_token=access_token, refresh_token=refresh_token)

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "steam_id": current_user.steam_id,
        "steam_username": current_user.steam_username,
        "steam_avatar": current_user.steam_avatar,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Sesión cerrada correctamente"}
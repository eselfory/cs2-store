from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis.asyncio as aioredis
from contextlib import asynccontextmanager

from routers import auth, products, cart, orders, steam, users
from database import engine, Base
from config import settings

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    app.state.redis = await aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    print("✅ Base de datos conectada")
    print("✅ Redis conectado")
    yield
    # Shutdown
    await app.state.redis.close()
    print("🔴 Servidor apagado")

app = FastAPI(
    title="CS2 Store API",
    description="Backend para plataforma e-commerce CS2",
    version="1.0.0",
    lifespan=lifespan
)

# Seguridad
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Routers
app.include_router(auth.router,     prefix="/api/auth",     tags=["Auth"])
app.include_router(users.router,    prefix="/api/users",    tags=["Users"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router,     prefix="/api/cart",     tags=["Cart"])
app.include_router(orders.router,   prefix="/api/orders",   tags=["Orders"])
app.include_router(steam.router,    prefix="/api/steam",    tags=["Steam"])

@app.get("/")
async def root():
    return {"status": "CS2 Store API corriendo 🚀"}

@app.get("/health")
async def health():
    return {"status": "ok"}
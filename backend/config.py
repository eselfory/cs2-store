from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Base
    APP_NAME: str = "CS2 Store"
    DEBUG: bool = False
    VERSION: str = "1.0.0"

    # Base de datos
    DATABASE_URL: str = "postgresql+asyncpg://cs2user:cs2pass@db:5432/cs2store"
                       //postgresql+asyncpg://cs2user:cs2pass@db:5432/cs2store
    # Redis
    REDIS_URL: str = "redis://redis:6379"

    # Seguridad
    SECRET_KEY: str = "supersecretkey123cambiaesto"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Steam
    STEAM_API_KEY: str = ""
    STEAM_OPENID_URL: str = "https://steamcommunity.com/openid"

    # MercadoPago
    MP_ACCESS_TOKEN: str = ""
    MP_PUBLIC_KEY: str = ""

    # CORS y hosts
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://tu-dominio.com"
    ]
    ALLOWED_HOSTS: List[str] = [
        "localhost",
        "tu-dominio.com",
        "*"
    ]

    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Uploads
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
from routers.auth import get_current_user, create_token
from config import settings
from datetime import timedelta
import httpx
import re

router = APIRouter()

STEAM_OPENID = "https://steamcommunity.com/openid/login"
RETURN_URL = "http://localhost:8000/api/steam/callback"

@router.get("/login")
async def steam_login():
    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": RETURN_URL,
        "openid.realm": "http://localhost:8000",
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{STEAM_OPENID}?{query}")

@router.get("/callback")
async def steam_callback(request: Request, db: AsyncSession = Depends(get_db)):
    params = dict(request.query_params)
    params["openid.mode"] = "check_authentication"

    async with httpx.AsyncClient() as client:
        response = await client.post(STEAM_OPENID, data=params)
        if "is_valid:true" not in response.text:
            raise HTTPException(status_code=401, detail="Steam auth inválida")

    claimed_id = params.get("openid.claimed_id", "")
    match = re.search(r"/id/(\d+)$", claimed_id)
    if not match:
        raise HTTPException(status_code=400, detail="No se pudo obtener Steam ID")

    steam_id = match.group(1)

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
            params={"key": settings.STEAM_API_KEY, "steamids": steam_id}
        )
        profile = resp.json().get("response", {}).get("players", [{}])[0]

    result = await db.execute(select(User).where(User.steam_id == steam_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            username=profile.get("personaname", f"user_{steam_id}"),
            steam_id=steam_id,
            steam_username=profile.get("personaname"),
            steam_avatar=profile.get("avatarfull"),
            steam_profile_url=profile.get("profileurl"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        user.steam_username = profile.get("personaname")
        user.steam_avatar = profile.get("avatarfull")
        await db.commit()

    access_token = create_token(
        {"sub": str(user.id)},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return RedirectResponse(f"http://localhost:3000/auth/steam?token={access_token}")

@router.get("/inventory")
async def get_steam_inventory(current_user: User = Depends(get_current_user)):
    if not current_user.steam_id:
        raise HTTPException(status_code=400, detail="No tenés Steam vinculado")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://steamcommunity.com/inventory/{current_user.steam_id}/730/2",
            params={"l": "english", "count": 50}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="No se pudo obtener el inventario")
        return resp.json()
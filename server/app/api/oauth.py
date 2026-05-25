from urllib.parse import quote

import httpx
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.services import auth_service

router = APIRouter(tags=["oauth"])

_oauth = OAuth()
_oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)
_oauth.register(
    name="github",
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)


def _redirect(token: str, name: str) -> RedirectResponse:
    return RedirectResponse(f"{settings.FE_ORIGIN}/#token={token}&name={quote(name or '')}")


@router.get("/auth/google")
async def google_login(request: Request):
    return await _oauth.google.authorize_redirect(
        request, f"{settings.API_BASE}/auth/google/callback"
    )


@router.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        token = await _oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=str(e))
    info = token.get("userinfo") or await _oauth.google.parse_id_token(request, token)
    jwt_token, name = await auth_service.oauth_login(
        email=info["email"],
        provider="google",
        provider_id=info["sub"],
        name=info.get("name"),
    )
    return _redirect(jwt_token, name)


@router.get("/auth/github")
async def github_login(request: Request):
    return await _oauth.github.authorize_redirect(
        request, f"{settings.API_BASE}/auth/github/callback"
    )


@router.get("/auth/github/callback")
async def github_callback(request: Request):
    try:
        token = await _oauth.github.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=str(e))

    headers = {
        "Authorization": f"Bearer {token['access_token']}",
        "Accept": "application/json",
    }
    async with httpx.AsyncClient() as client:
        profile = (await client.get("https://api.github.com/user", headers=headers)).json()
        emails = (
            await client.get("https://api.github.com/user/emails", headers=headers)
        ).json()

    email = None
    if isinstance(emails, list):
        primary = next((e for e in emails if e.get("primary") and e.get("verified")), None)
        if primary:
            email = primary["email"]
    if not email:
        raise HTTPException(status_code=400, detail="Unable to retrieve email from GitHub.")

    jwt_token, name = await auth_service.oauth_login(
        email=email,
        provider="github",
        provider_id=str(profile["id"]),
        name=profile.get("login"),
    )
    return _redirect(jwt_token, name)

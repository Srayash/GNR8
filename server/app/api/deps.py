import jwt as pyjwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_token

_bearer = HTTPBearer(auto_error=False)

_UNAUTHORIZED = "You're not authorized to access this page."


async def require_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail=_UNAUTHORIZED)
    try:
        payload = decode_token(creds.credentials)
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail=_UNAUTHORIZED)
    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail=_UNAUTHORIZED)
    return user_id

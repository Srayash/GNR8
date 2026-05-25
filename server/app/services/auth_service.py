from fastapi import HTTPException

from app.core.security import issue_token
from app.repositories import users


async def signup(email: str, password: str, confirm_password: str) -> tuple[str, str]:
    if password != confirm_password:
        raise HTTPException(status_code=411, detail="Passwords don't match")
    if await users.find_by_email(email):
        raise HTTPException(status_code=411, detail="Email already in use.")
    user = await users.create({"email": email, "password": password})
    return issue_token(user["_id"]), user["email"]


async def signin(email: str, password: str) -> tuple[str, str]:
    user = await users.find_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="No user found with that email")
    if user.get("password") != password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return issue_token(user["_id"]), user.get("name") or user["email"]


async def refresh(user_id: str) -> tuple[str, str]:
    user = await users.find_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return issue_token(user["_id"]), user.get("name") or user.get("email")


async def oauth_login(
    *, email: str, provider: str, provider_id: str, name: str | None
) -> tuple[str, str]:
    field = "googleId" if provider == "google" else "githubId"
    user = await users.find_or_create(
        {"email": email},
        {"email": email, field: str(provider_id), "name": name},
    )
    return issue_token(user["_id"]), user.get("name") or email

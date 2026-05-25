from datetime import datetime, timezone
from typing import Any

from bson import ObjectId

from app.db.mongo import db

_users = db["users"]


async def find_by_email(email: str) -> dict | None:
    return await _users.find_one({"email": email})


async def find_by_id(user_id: str) -> dict | None:
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    return await _users.find_one({"_id": oid})


async def create(doc: dict[str, Any]) -> dict:
    now = datetime.now(timezone.utc)
    doc = {**doc, "createdAt": now, "updatedAt": now}
    result = await _users.insert_one(doc)
    return {**doc, "_id": result.inserted_id}


async def find_or_create(match: dict, data: dict[str, Any]) -> dict:
    existing = await _users.find_one(match)
    if existing:
        return existing
    return await create(data)

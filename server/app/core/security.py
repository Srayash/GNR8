import jwt

from app.core.config import settings

JWT_ALG = "HS256"


def issue_token(user_id) -> str:
    return jwt.encode({"userId": str(user_id)}, settings.JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[JWT_ALG])

from fastapi import APIRouter, Depends, Response

from app.api.deps import require_user
from app.schemas.auth import SigninBody, SignupBody
from app.services import auth_service

router = APIRouter(tags=["auth"])


@router.post("/user/signup")
async def signup(body: SignupBody, response: Response):
    token, name = await auth_service.signup(body.email, body.password, body.confirmPassword)
    response.headers["Authorization"] = f"Bearer {token}"
    return {"message": "User Created Successfully", "name": name}


@router.post("/user/signin")
async def signin(body: SigninBody, response: Response):
    token, name = await auth_service.signin(body.email, body.password)
    response.headers["Authorization"] = f"Bearer {token}"
    return {"message": "Signed in successfully", "name": name}


@router.get("/user_data")
async def user_data(response: Response, user_id: str = Depends(require_user)):
    token, name = await auth_service.refresh(user_id)
    response.headers["Authorization"] = f"Bearer {token}"
    return {"name": name}

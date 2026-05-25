from fastapi import APIRouter

from app.api.v1 import auth, deploy, generate

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router)
router.include_router(generate.router)
router.include_router(deploy.router)

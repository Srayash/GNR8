from fastapi import APIRouter, Depends

from app.api.deps import require_user
from app.schemas.deploy import DeployBody
from app.services import deploy_service

router = APIRouter(prefix="/deploy", tags=["deploy"])


@router.post("/")
async def deploy(body: DeployBody, _: str = Depends(require_user)):
    return await deploy_service.deploy(body.files)

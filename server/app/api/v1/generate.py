from fastapi import APIRouter, Depends

from app.api.deps import require_user
from app.schemas.generate import ImprovementBody, PromptBody, ReadmeBody
from app.services import generate_service

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("/")
async def generate(body: PromptBody, _: str = Depends(require_user)):
    output = await generate_service.predict(body.prompt)
    # Envelope shape preserved from the old Express proxy: FE reads response.data.data.
    return {"message": "Prediction successful", "data": [output]}


@router.post("/improvement")
async def improvement(body: ImprovementBody, _: str = Depends(require_user)):
    output = await generate_service.improve(body.prompt, body.code)
    return {"message": "Prediction successful", "data": {"updated_code": output}}


@router.post("/readme")
async def readme(body: ReadmeBody, _: str = Depends(require_user)):
    return {"readme": await generate_service.readme(body.code)}

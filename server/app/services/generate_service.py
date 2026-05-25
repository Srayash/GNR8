import asyncio

from fastapi import HTTPException

from app.agents.loader import model, model2


async def predict(prompt: str) -> str:
    try:
        return await asyncio.to_thread(model.predict, prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {e}")


async def improve(prompt: str, code: str) -> str:
    try:
        return await asyncio.to_thread(model2.predict, prompt, code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {e}")


async def readme(code: str) -> str:
    try:
        return await asyncio.to_thread(model.readme, code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {e}")

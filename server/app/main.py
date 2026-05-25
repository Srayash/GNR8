from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.oauth import router as oauth_router
from app.api.v1.router import router as v1_router
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(title="GNR8")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FE_ORIGIN],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Authorization"],
    )
    # SessionMiddleware is used only by Authlib for the short-lived OAuth state
    # cookie during the redirect dance. App auth is JWT, not session.
    app.add_middleware(SessionMiddleware, secret_key=settings.JWT_SECRET)

    app.include_router(v1_router)
    app.include_router(oauth_router)

    @app.get("/health")
    async def health() -> dict:
        return {"ok": True}

    return app


app = create_app()

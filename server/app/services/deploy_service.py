import base64
import time

import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.schemas.deploy import File

_GH_HEADERS = {
    "Authorization": f"token {settings.GITHUB_ACCESS_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
}


def _base36(n: int) -> str:
    if n == 0:
        return "0"
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = []
    while n:
        n, r = divmod(n, 36)
        out.append(digits[r])
    return "".join(reversed(out))


def _unique_site_name() -> str:
    return f"gnr8-site-{_base36(int(time.time() * 1000))}"


async def deploy(files: list[File]) -> dict:
    if not files or not any(f.content and f.content.strip() for f in files):
        raise HTTPException(
            status_code=400,
            detail="No valid files provided. At least one file must contain content.",
        )

    repo_name = _unique_site_name()
    owner = settings.GITHUB_USERNAME

    async with httpx.AsyncClient(headers=_GH_HEADERS, timeout=30.0) as client:
        try:
            r = await client.post(
                "https://api.github.com/user/repos",
                json={
                    "name": repo_name,
                    "description": "Auto-generated website",
                    "private": False,
                    "has_pages": True,
                },
            )
            r.raise_for_status()

            for f in files:
                encoded = base64.b64encode(f.content.encode()).decode()
                put = await client.put(
                    f"https://api.github.com/repos/{owner}/{repo_name}/contents/{f.name}",
                    json={
                        "message": f"Added {f.name}",
                        "content": encoded,
                        "branch": "main",
                    },
                )
                put.raise_for_status()

            pages = await client.post(
                f"https://api.github.com/repos/{owner}/{repo_name}/pages",
                json={"source": {"branch": "main", "path": "/"}},
            )
            pages.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail="Failed to deploy site") from e

    return {
        "success": True,
        "url": f"https://{owner}.github.io/{repo_name}/",
        "siteName": repo_name,
    }

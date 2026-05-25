from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DB_URL: str
    DB_NAME: str = "gnr8"
    JWT_SECRET: str

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""

    GITHUB_ACCESS_TOKEN: str = ""
    GITHUB_USERNAME: str = "GNR8-Kriti"

    FE_ORIGIN: str = "http://localhost:5173"
    API_BASE: str = "http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

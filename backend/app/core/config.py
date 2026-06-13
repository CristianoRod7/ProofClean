from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


APP_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = APP_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_prefix="PROOFCLEAN_",
        extra="ignore",
    )

    app_name: str = "ProofClean FastAPI"
    api_host: str = "0.0.0.0"
    api_port: int = 8080
    jwt_secret: str = "proofclean-development-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 1440
    upload_dir: Path = APP_DIR / "storage" / "uploads"
    masked_dir: Path = APP_DIR / "storage" / "masked"
    allowed_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    openai_api_key: str = Field(default="", validation_alias=AliasChoices("OPENAI_API_KEY", "PROOFCLEAN_OPENAI_API_KEY"))
    openai_model: str = Field(default="gpt-4o-mini", validation_alias=AliasChoices("OPENAI_MODEL", "PROOFCLEAN_OPENAI_MODEL"))
    openai_timeout_seconds: float = Field(
        default=45.0,
        ge=5.0,
        le=120.0,
        validation_alias=AliasChoices("OPENAI_TIMEOUT_SECONDS", "PROOFCLEAN_OPENAI_TIMEOUT_SECONDS"),
    )
    openai_max_retries: int = Field(
        default=1,
        ge=0,
        le=3,
        validation_alias=AliasChoices("OPENAI_MAX_RETRIES", "PROOFCLEAN_OPENAI_MAX_RETRIES"),
    )


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.masked_dir.mkdir(parents=True, exist_ok=True)

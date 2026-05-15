from pathlib import Path


class Settings:
    PROJECT_NAME = "ProofClean"
    API_PREFIX = "/api"
    JWT_SECRET = "proofclean-local-development-secret-change-before-production"
    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

    BACKEND_DIR = Path(__file__).resolve().parents[2]
    ROOT_DIR = BACKEND_DIR.parent
    DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'proofclean.db'}"
    UPLOAD_ORIGINAL_DIR = ROOT_DIR / "uploads" / "original"
    UPLOAD_MASKED_DIR = ROOT_DIR / "uploads" / "masked"
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

    ALLOWED_MIME_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    }
    MAX_FILE_SIZE = 10 * 1024 * 1024


settings = Settings()

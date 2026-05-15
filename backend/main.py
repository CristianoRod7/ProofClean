from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analyses, auth, demo, files, health
from app.core.config import settings
from app.db.database import SessionLocal
from app.db.init_db import init_db

app = FastAPI(
    title="ProofClean FastAPI Backend",
    description="AI 기반 업로드 전 개인정보 노출 위험 분석 및 자동 비식별화 플랫폼 MVP",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(analyses.router, prefix=settings.API_PREFIX)
app.include_router(files.router, prefix=settings.API_PREFIX)
app.include_router(demo.router, prefix=settings.API_PREFIX)


@app.on_event("startup")
def on_startup() -> None:
    settings.UPLOAD_ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    settings.UPLOAD_MASKED_DIR.mkdir(parents=True, exist_ok=True)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

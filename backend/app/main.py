from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import analyses, auth, files
from app.services.analysis_service import seed_demo_analyses
from app.services.auth_service import seed_demo_user


@asynccontextmanager
async def lifespan(_: FastAPI):
    seed_demo_user()
    seed_demo_analyses()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
app.mount("/static/masked", StaticFiles(directory=settings.masked_dir), name="masked")
app.include_router(auth.router)
app.include_router(analyses.router)
app.include_router(files.router)


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}

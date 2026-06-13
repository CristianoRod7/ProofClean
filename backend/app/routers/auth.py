from fastapi import APIRouter

from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from app.services.auth_service import authenticate_user, register_user


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest) -> dict:
    return register_user(payload.name, payload.email, payload.password)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> dict:
    return authenticate_user(payload.email, payload.password)

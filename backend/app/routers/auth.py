from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import get_current_user_id
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from app.services.auth_service import authenticate_user, get_user_by_id, register_user


router = APIRouter(prefix="/api/auth", tags=["auth"])
CurrentUser = Annotated[str, Depends(get_current_user_id)]


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest) -> dict:
    return register_user(payload.name, payload.email, payload.password)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> dict:
    return authenticate_user(payload.email, payload.password)


@router.get("/me", response_model=UserResponse)
def me(user_id: CurrentUser) -> dict:
    return get_user_by_id(user_id)

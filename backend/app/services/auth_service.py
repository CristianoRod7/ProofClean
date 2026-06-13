from uuid import uuid4

from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.data.store import store


DEMO_EMAIL = "demo@proofclean.com"
DEMO_PASSWORD = "password1234"


def public_user(user: dict) -> dict:
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


def seed_demo_user() -> None:
    with store.lock:
        if DEMO_EMAIL in store.users_by_email:
            return
        user = {
            "id": "demo-user",
            "name": "데모 사용자",
            "email": DEMO_EMAIL,
            "password_hash": hash_password(DEMO_PASSWORD),
        }
        store.users[user["id"]] = user
        store.users_by_email[user["email"]] = user["id"]


def register_user(name: str, email: str, password: str) -> dict:
    normalized_email = email.lower().strip()
    with store.lock:
        if normalized_email in store.users_by_email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 가입된 이메일입니다.")
        user = {
            "id": f"user-{uuid4()}",
            "name": name.strip(),
            "email": normalized_email,
            "password_hash": hash_password(password),
        }
        store.users[user["id"]] = user
        store.users_by_email[normalized_email] = user["id"]
    return {"user": public_user(user), "token": create_access_token(user["id"])}


def authenticate_user(email: str, password: str) -> dict:
    user_id = store.users_by_email.get(email.lower().strip())
    user = store.users.get(user_id or "")
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호를 확인하세요.")
    return {"user": public_user(user), "token": create_access_token(user["id"])}


def get_user_by_id(user_id: str) -> dict:
    user = store.users.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 인증 사용자입니다.")
    return public_user(user)

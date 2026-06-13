import re
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from app.core.config import settings
from app.data.store import store


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 12 * 1024 * 1024


def safe_name(filename: str) -> str:
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", Path(filename).name).strip("-.") or "upload"
    return stem[:120]


async def save_upload(analysis_id: str, upload: UploadFile) -> dict:
    suffix = Path(upload.filename or "").suffix.lower()
    if upload.content_type not in ALLOWED_CONTENT_TYPES or suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="jpg, png, webp 이미지 파일만 업로드할 수 있습니다.")
    content = await upload.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="업로드된 파일이 비어 있습니다.")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="파일 크기는 12MB 이하여야 합니다.")

    file_id = f"file-{uuid4()}"
    stored_name = f"{file_id}{suffix}"
    path = settings.upload_dir / stored_name
    path.write_bytes(content)
    try:
        with Image.open(path) as image:
            image.verify()
    except (UnidentifiedImageError, OSError) as exc:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="올바른 이미지 파일이 아닙니다.") from exc

    record = {
        "fileId": file_id,
        "analysisId": analysis_id,
        "fileName": safe_name(upload.filename or stored_name),
        "contentType": upload.content_type or "application/octet-stream",
        "size": len(content),
        "path": str(path),
        "previewUrl": f"/static/uploads/{stored_name}",
    }
    with store.lock:
        store.files[file_id] = record
    return record


def get_file(file_id: str) -> dict | None:
    return store.files.get(file_id)


def get_masked_file(masked_id: str) -> dict | None:
    return store.masked_files.get(masked_id)


def create_sample_file(analysis_id: str) -> dict:
    file_id = f"file-{uuid4()}"
    stored_name = f"{file_id}.png"
    path = settings.upload_dir / stored_name
    image = Image.new("RGB", (900, 620), "#e8f3f4")
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((70, 55, 830, 565), radius=30, fill="#ffffff", outline="#cbd5e1", width=2)
    draw.rounded_rectangle((110, 95, 430, 140), radius=14, fill="#0f172a")
    for index, width in enumerate((610, 520, 655, 470)):
        top = 185 + index * 70
        draw.rounded_rectangle((110, top, 110 + width, top + 34), radius=10, fill="#dbe4ee")
    draw.text((125, 107), "ProofClean sample document", fill="white", font=ImageFont.load_default())
    image.save(path, format="PNG", optimize=True)
    record = {
        "fileId": file_id,
        "analysisId": analysis_id,
        "fileName": "proofclean-sample-image.png",
        "contentType": "image/png",
        "size": path.stat().st_size,
        "path": str(path),
        "previewUrl": f"/static/uploads/{stored_name}",
    }
    with store.lock:
        store.files[file_id] = record
    return record

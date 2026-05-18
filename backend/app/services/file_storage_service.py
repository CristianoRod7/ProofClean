from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image

from app.core.config import settings
from app.models.file import UploadedFile


async def store_upload_file(analysis_project_id: int, file: UploadFile) -> UploadedFile:
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="빈 파일은 업로드할 수 없습니다.")
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="파일 크기는 10MB 이하만 지원합니다.")
    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")

    settings.UPLOAD_ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    original_name = file.filename or "upload.bin"
    ext = Path(original_name).suffix.lower() or ".bin"
    stored_name = f"{uuid4()}{ext}"
    target_path = settings.UPLOAD_ORIGINAL_DIR / stored_name
    target_path.write_bytes(content)

    width = None
    height = None
    file_type = "PDF" if file.content_type == "application/pdf" else "IMAGE"
    if file_type == "IMAGE":
        try:
            with Image.open(target_path) as image:
                width, height = image.size
        except Exception:
            raise HTTPException(status_code=400, detail="이미지 파일을 읽을 수 없습니다. jpg/png/webp 파일을 사용하세요.")

    return UploadedFile(
        analysis_project_id=analysis_project_id,
        original_file_name=original_name,
        stored_file_name=stored_name,
        file_path=str(target_path),
        file_type=file_type,
        mime_type=file.content_type or "application/octet-stream",
        file_size=len(content),
        width=width,
        height=height,
    )

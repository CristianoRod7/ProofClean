from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.file import MaskedFile, UploadedFile

router = APIRouter(prefix="/files", tags=["files"])


def _safe_file_response(path: str, media_type: str | None = None, filename: str | None = None) -> FileResponse:
    file_path = Path(path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(path=file_path, media_type=media_type, filename=filename)


@router.get("/{file_id}/preview")
def preview_file(file_id: int, db: Session = Depends(get_db)):
    uploaded_file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not uploaded_file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return _safe_file_response(uploaded_file.file_path, media_type=uploaded_file.mime_type)


@router.get("/masked/{masked_file_id}/preview")
def preview_masked_file(masked_file_id: int, db: Session = Depends(get_db)):
    masked_file = db.query(MaskedFile).filter(MaskedFile.id == masked_file_id).first()
    if not masked_file:
        raise HTTPException(status_code=404, detail="안전본 파일을 찾을 수 없습니다.")
    return _safe_file_response(masked_file.masked_file_path, media_type="image/png")


@router.get("/masked/{masked_file_id}/download")
def download_masked_file(masked_file_id: int, db: Session = Depends(get_db)):
    masked_file = db.query(MaskedFile).filter(MaskedFile.id == masked_file_id).first()
    if not masked_file:
        raise HTTPException(status_code=404, detail="안전본 파일을 찾을 수 없습니다.")
    return _safe_file_response(masked_file.masked_file_path, media_type="application/octet-stream", filename=masked_file.masked_file_name)

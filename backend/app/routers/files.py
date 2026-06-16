from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.services.file_storage_service import get_file, get_masked_file


router = APIRouter(prefix="/api/files", tags=["files"])


def file_response(record: dict | None, download: bool = False) -> FileResponse:
    if not record or not Path(record["path"]).exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="파일을 찾을 수 없습니다.")
    return FileResponse(
        record["path"],
        media_type=record.get("contentType", "application/octet-stream"),
        filename=record.get("fileName") if download else None,
        content_disposition_type="attachment" if download else "inline",
    )


@router.get("/{file_id}/preview")
def preview(file_id: str) -> FileResponse:
    return file_response(get_file(file_id))


@router.get("/masked/{masked_id}/preview")
def masked_preview(masked_id: str) -> FileResponse:
    return file_response(get_masked_file(masked_id))


@router.get("/masked/{masked_id}/download")
def masked_download(masked_id: str) -> FileResponse:
    return file_response(get_masked_file(masked_id), download=True)

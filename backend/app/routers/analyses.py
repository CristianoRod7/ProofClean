from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from app.core.security import get_current_user_id
from app.schemas.analysis import AnalysisCreateRequest, AnalysisResponse
from app.schemas.file import FileUploadResponse, MaskResponse
from app.services.analysis_service import attach_file, create_analysis, list_analyses, mask_analysis, require_analysis, run_analysis, serialize_analysis
from app.services.file_storage_service import save_upload


router = APIRouter(prefix="/api/analyses", tags=["analyses"])
CurrentUser = Annotated[str, Depends(get_current_user_id)]


@router.get("", response_model=list[AnalysisResponse])
def analyses(user_id: CurrentUser) -> list[dict]:
    return list_analyses(user_id)


@router.post("", response_model=AnalysisResponse, status_code=201)
def create(payload: AnalysisCreateRequest, user_id: CurrentUser) -> dict:
    return create_analysis(payload.title, payload.mode, user_id)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def detail(analysis_id: str, user_id: CurrentUser) -> dict:
    return serialize_analysis(require_analysis(analysis_id, user_id))


@router.post("/{analysis_id}/files", response_model=FileUploadResponse)
async def upload_file(analysis_id: str, user_id: CurrentUser, file: UploadFile = File(...)) -> dict:
    require_analysis(analysis_id, user_id)
    record = await save_upload(analysis_id, file)
    attach_file(analysis_id, record, user_id)
    return {key: record[key] for key in ("fileId", "analysisId", "fileName", "contentType", "size", "previewUrl")}


@router.post("/{analysis_id}/run", response_model=AnalysisResponse)
def run(analysis_id: str, user_id: CurrentUser) -> dict:
    return run_analysis(analysis_id, user_id)


@router.get("/{analysis_id}/findings")
def findings(analysis_id: str, user_id: CurrentUser) -> list[dict]:
    return require_analysis(analysis_id, user_id).get("detections", [])


@router.get("/{analysis_id}/scenarios")
def scenarios(analysis_id: str, user_id: CurrentUser) -> list[dict]:
    return require_analysis(analysis_id, user_id).get("scenarios", [])


@router.get("/{analysis_id}/recommendations")
def recommendations(analysis_id: str, user_id: CurrentUser) -> list[dict]:
    return require_analysis(analysis_id, user_id).get("recommendations", [])


@router.post("/{analysis_id}/mask", response_model=MaskResponse)
def mask(analysis_id: str, user_id: CurrentUser) -> dict:
    return mask_analysis(analysis_id, user_id)

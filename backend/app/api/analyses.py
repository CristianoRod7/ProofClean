from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, selectinload

from app.core.security import get_optional_user
from app.db.database import get_db
from app.models.analysis import AnalysisProject, DetectionFinding, Recommendation, RiskScenario
from app.models.file import MaskedFile, UploadedFile
from app.models.user import User
from app.schemas.analysis import AnalysisCreateRequest
from app.services.file_storage_service import store_upload_file
from app.services.masking_service import create_masked_file
from app.services.mock_analysis_service import MockAnalysisService
from app.services.risk_scoring_service import calculate_risk_score

router = APIRouter(prefix="/analyses", tags=["analyses"])
mock_analysis_service = MockAnalysisService()


def _project_query(db: Session):
    return db.query(AnalysisProject).options(
        selectinload(AnalysisProject.files),
        selectinload(AnalysisProject.findings),
        selectinload(AnalysisProject.scenarios),
        selectinload(AnalysisProject.recommendations),
        selectinload(AnalysisProject.masked_files),
    )


def _get_project(db: Session, analysis_id: int) -> AnalysisProject:
    analysis = _project_query(db).filter(AnalysisProject.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="분석 프로젝트를 찾을 수 없습니다.")
    return analysis


def _analysis_card(analysis: AnalysisProject) -> dict:
    return {
        "id": analysis.id,
        "title": analysis.title,
        "purpose": analysis.purpose,
        "status": analysis.status,
        "riskScore": analysis.risk_score,
        "createdAt": analysis.created_at,
    }


def _file_response(file: UploadedFile) -> dict:
    return {
        "id": file.id,
        "fileId": file.id,
        "originalFileName": file.original_file_name,
        "fileUrl": f"/api/files/{file.id}/preview",
        "width": file.width,
        "height": file.height,
    }


def _finding_response(finding: DetectionFinding) -> dict:
    return {
        "id": finding.id,
        "detectionType": finding.detection_type,
        "label": finding.label,
        "description": finding.description,
        "confidence": finding.confidence,
        "severity": finding.severity,
        "x": finding.x,
        "y": finding.y,
        "width": finding.width,
        "height": finding.height,
        "extractedText": finding.extracted_text,
    }


def _scenario_response(scenario: RiskScenario) -> dict:
    return {"id": scenario.id, "title": scenario.title, "scenarioText": scenario.scenario_text, "riskLevel": scenario.risk_level}


def _recommendation_response(recommendation: Recommendation) -> dict:
    return {
        "id": recommendation.id,
        "title": recommendation.title,
        "description": recommendation.description,
        "priority": recommendation.priority,
        "completed": recommendation.completed,
    }


def _masked_response(masked_file: MaskedFile) -> dict:
    return {
        "id": masked_file.id,
        "maskedFileId": masked_file.id,
        "previewUrl": f"/api/files/masked/{masked_file.id}/preview",
        "downloadUrl": f"/api/files/masked/{masked_file.id}/download",
    }


def _detail_response(analysis: AnalysisProject) -> dict:
    return {
        **_analysis_card(analysis),
        "summary": analysis.summary,
        "files": [_file_response(file) for file in analysis.files],
        "findings": [_finding_response(finding) for finding in analysis.findings],
        "scenarios": [_scenario_response(scenario) for scenario in analysis.scenarios],
        "recommendations": [_recommendation_response(recommendation) for recommendation in sorted(analysis.recommendations, key=lambda item: item.priority)],
        "maskedFiles": [_masked_response(masked_file) for masked_file in analysis.masked_files],
    }


@router.get("")
def list_analyses(db: Session = Depends(get_db), current_user: User | None = Depends(get_optional_user)):
    query = db.query(AnalysisProject)
    if current_user:
        query = query.filter(AnalysisProject.user_id == current_user.id)
    return [_analysis_card(analysis) for analysis in query.order_by(AnalysisProject.created_at.desc()).all()]


@router.post("")
def create_analysis(payload: AnalysisCreateRequest, db: Session = Depends(get_db), current_user: User | None = Depends(get_optional_user)):
    analysis = AnalysisProject(
        user_id=current_user.id if current_user else None,
        title=payload.title,
        purpose=payload.purpose,
        status="CREATED",
        risk_score=0,
        summary="분석 프로젝트가 생성되었습니다. 파일을 업로드하고 분석을 시작하세요.",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return _analysis_card(analysis)


@router.get("/{analysis_id}")
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    return _detail_response(_get_project(db, analysis_id))


@router.post("/{analysis_id}/files")
async def upload_file(analysis_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    analysis = _get_project(db, analysis_id)
    uploaded_file = await store_upload_file(analysis.id, file)
    db.add(uploaded_file)
    analysis.status = "UPLOADED"
    db.commit()
    db.refresh(uploaded_file)
    return _file_response(uploaded_file)


@router.post("/{analysis_id}/run")
def run_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = _get_project(db, analysis_id)
    uploaded_file = analysis.files[0] if analysis.files else None

    db.query(DetectionFinding).filter(DetectionFinding.analysis_project_id == analysis.id).delete()
    db.query(RiskScenario).filter(RiskScenario.analysis_project_id == analysis.id).delete()
    db.query(Recommendation).filter(Recommendation.analysis_project_id == analysis.id).delete()
    db.flush()

    result = mock_analysis_service.analyze(analysis.purpose)
    for finding in result["findings"]:
        db.add(DetectionFinding(analysis_project_id=analysis.id, uploaded_file_id=uploaded_file.id if uploaded_file else None, **finding))
    for scenario in result["scenarios"]:
        db.add(RiskScenario(analysis_project_id=analysis.id, **scenario))
    for recommendation in result["recommendations"]:
        db.add(Recommendation(analysis_project_id=analysis.id, completed=False, **recommendation))

    analysis.risk_score = calculate_risk_score(analysis.purpose, result["findings"])
    analysis.summary = result["summary"]
    analysis.status = "ANALYZED"
    db.commit()
    db.refresh(analysis)
    return {"analysisId": analysis.id, "riskScore": analysis.risk_score, "status": analysis.status, "findingCount": len(result["findings"])}


@router.get("/{analysis_id}/findings")
def list_findings(analysis_id: int, db: Session = Depends(get_db)):
    return [_finding_response(finding) for finding in _get_project(db, analysis_id).findings]


@router.get("/{analysis_id}/scenarios")
def list_scenarios(analysis_id: int, db: Session = Depends(get_db)):
    return [_scenario_response(scenario) for scenario in _get_project(db, analysis_id).scenarios]


@router.get("/{analysis_id}/recommendations")
def list_recommendations(analysis_id: int, db: Session = Depends(get_db)):
    recommendations = sorted(_get_project(db, analysis_id).recommendations, key=lambda item: item.priority)
    return [_recommendation_response(recommendation) for recommendation in recommendations]


@router.post("/{analysis_id}/mask")
def mask_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = _get_project(db, analysis_id)
    if not analysis.files:
        raise HTTPException(status_code=400, detail="원본 파일이 없습니다.")
    if not analysis.findings:
        raise HTTPException(status_code=400, detail="마스킹할 탐지 후보가 없습니다. 먼저 분석을 실행하세요.")
    masked_file = create_masked_file(db, analysis, analysis.files[0])
    analysis.status = "MASKED"
    db.commit()
    return _masked_response(masked_file)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.analysis import AnalysisProject

router = APIRouter(prefix="/demo", tags=["demo"])


def _analysis_card(analysis: AnalysisProject) -> dict:
    return {
        "id": analysis.id,
        "title": analysis.title,
        "purpose": analysis.purpose,
        "status": analysis.status,
        "riskScore": analysis.risk_score,
        "createdAt": analysis.created_at,
    }


@router.get("/analyses")
def demo_analyses(db: Session = Depends(get_db)):
    analyses = (
        db.query(AnalysisProject)
        .filter(AnalysisProject.title.in_(["중고거래 게시글 사진 점검", "SNS 업로드 사진 점검", "과제 제출 캡처 점검"]))
        .order_by(AnalysisProject.id.asc())
        .all()
    )
    if analyses:
        return [_analysis_card(analysis) for analysis in analyses]
    return [
        {"id": 1, "title": "중고거래 게시글 사진 점검", "purpose": "SECOND_HAND", "status": "ANALYZED", "riskScore": 87},
        {"id": 2, "title": "SNS 업로드 사진 점검", "purpose": "SNS", "status": "ANALYZED", "riskScore": 74},
        {"id": 3, "title": "과제 제출 캡처 점검", "purpose": "ASSIGNMENT", "status": "ANALYZED", "riskScore": 68},
    ]

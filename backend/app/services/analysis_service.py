from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.data.store import store
from app.services.file_storage_service import create_sample_file
from app.services.masking_service import create_masked_image
from app.services.mock_ai_service import generate_analysis, normalize_mode
from app.services.risk_scoring_service import calculate_risk


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def serialize_analysis(analysis: dict) -> dict:
    return {
        "id": analysis["id"],
        "title": analysis["title"],
        "mode": analysis["mode"],
        "status": analysis["status"],
        "riskScore": analysis.get("riskScore"),
        "riskLevel": analysis.get("riskLevel"),
        "detections": analysis.get("detections", []),
        "scenarios": analysis.get("scenarios", []),
        "recommendations": analysis.get("recommendations", []),
        "originalImageUrl": analysis.get("originalImageUrl"),
        "maskedImageUrl": analysis.get("maskedImageUrl"),
        "fileName": analysis.get("fileName"),
        "createdAt": analysis["createdAt"],
        "updatedAt": analysis["updatedAt"],
    }


def create_analysis(title: str, mode: str, user_id: str) -> dict:
    timestamp = now()
    analysis = {
        "id": f"analysis-{uuid4()}",
        "title": title.strip(),
        "mode": normalize_mode(mode),
        "status": "created",
        "riskScore": None,
        "riskLevel": None,
        "detections": [],
        "scenarios": [],
        "recommendations": [],
        "originalImageUrl": None,
        "maskedImageUrl": None,
        "fileId": None,
        "fileName": None,
        "ownerId": user_id,
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }
    with store.lock:
        store.analyses[analysis["id"]] = analysis
    return serialize_analysis(analysis)


def require_analysis(analysis_id: str, user_id: str | None = None) -> dict:
    analysis = store.analyses.get(analysis_id)
    if not analysis or (user_id and analysis.get("ownerId") != user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="분석 프로젝트를 찾을 수 없습니다.")
    return analysis


def list_analyses(user_id: str) -> list[dict]:
    analyses = [item for item in store.analyses.values() if item.get("ownerId") == user_id]
    analyses.sort(key=lambda item: item["updatedAt"], reverse=True)
    return [serialize_analysis(item) for item in analyses]


def attach_file(analysis_id: str, file_record: dict, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    analysis.update({
        "fileId": file_record["fileId"],
        "fileName": file_record["fileName"],
        "originalImageUrl": file_record["previewUrl"],
        "status": "uploaded",
        "updatedAt": now(),
    })
    return serialize_analysis(analysis)


def run_analysis(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    if not analysis.get("fileId"):
        sample = create_sample_file(analysis_id)
        analysis.update({"fileId": sample["fileId"], "fileName": sample["fileName"], "originalImageUrl": sample["previewUrl"]})
    detections, scenarios, recommendations = generate_analysis(analysis["mode"])
    score, level = calculate_risk(detections)
    analysis.update({
        "status": "completed",
        "detections": detections,
        "scenarios": scenarios,
        "recommendations": recommendations,
        "riskScore": score,
        "riskLevel": level,
        "updatedAt": now(),
    })
    return serialize_analysis(analysis)


def mask_analysis(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    if not analysis.get("detections"):
        run_analysis(analysis_id, user_id)
    masked_record = create_masked_image(analysis)
    analysis.update({"status": "masked", "maskedImageUrl": masked_record["url"], "updatedAt": now()})
    return {
        "analysisId": analysis_id,
        "maskedImageUrl": masked_record["url"],
        "safeImageUrl": masked_record["url"],
    }


def seed_demo_analyses() -> None:
    if any(item.get("ownerId") == "demo-user" for item in store.analyses.values()):
        return
    for title, mode in (("SNS 사진 점검", "sns"), ("중고거래 게시글 사진 점검", "marketplace"), ("과제 캡처 점검", "assignment")):
        created = create_analysis(title, mode, "demo-user")
        run_analysis(created["id"], "demo-user")

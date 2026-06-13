from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.data.store import store
from app.services.ai import ai_service
from app.services.file_storage_service import create_sample_file
from app.services.masking_service import create_masked_image
from app.services.mock_ai_service import normalize_mode
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
        "sourceType": analysis.get("sourceType", "sample"),
        "isSample": analysis.get("isSample", True),
        "provider": analysis.get("provider"),
        "aiFallback": analysis.get("aiFallback", False),
        "fallbackReason": analysis.get("fallbackReason"),
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
        "uploadedFilePath": None,
        "sourceType": "sample",
        "isSample": True,
        "provider": None,
        "aiFallback": False,
        "fallbackReason": None,
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
        "uploadedFilePath": file_record["path"],
        "sourceType": "upload",
        "isSample": False,
        "status": "uploaded",
        "updatedAt": now(),
    })
    return serialize_analysis(analysis)


def select_source_type(analysis: dict) -> str:
    if analysis.get("sourceType") in {"sample", "upload"}:
        return analysis["sourceType"]
    if analysis.get("isSample"):
        return "sample"
    if analysis.get("uploadedFilePath"):
        return "upload"
    return "sample"


def mark_sample(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    sample = create_sample_file(analysis_id)
    analysis.update({
        "fileId": sample["fileId"],
        "fileName": sample["fileName"],
        "originalImageUrl": sample["previewUrl"],
        "uploadedFilePath": None,
        "sourceType": "sample",
        "isSample": True,
        "status": "uploaded",
        "provider": None,
        "aiFallback": False,
        "fallbackReason": None,
        "updatedAt": now(),
    })
    return {"analysisId": analysis_id, "sourceType": "sample", "previewUrl": sample["previewUrl"]}


async def run_analysis(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    source_type = select_source_type(analysis)
    if source_type == "sample" and not analysis.get("fileId"):
        mark_sample(analysis_id, user_id)
    file_path = analysis.get("uploadedFilePath") if source_type == "upload" else None
    ai_result = await ai_service.analyze_image(file_path=file_path, mode=analysis["mode"], source_type=source_type)
    score, level = calculate_risk(ai_result["detections"])
    analysis.update({
        "status": "completed",
        "detections": ai_result["detections"],
        "scenarios": ai_result["scenarios"],
        "recommendations": ai_result["recommendations"],
        "riskScore": score,
        "riskLevel": level,
        "provider": ai_result["provider"],
        "sourceType": source_type,
        "isSample": source_type == "sample",
        "aiFallback": ai_result["aiFallback"],
        "fallbackReason": ai_result["fallbackReason"],
        "updatedAt": now(),
    })
    return serialize_analysis(analysis)


async def mask_analysis(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    if not analysis.get("detections"):
        await run_analysis(analysis_id, user_id)
    masked_record = create_masked_image(analysis)
    analysis.update({"status": "masked", "maskedImageUrl": masked_record["url"], "updatedAt": now()})
    return {
        "analysisId": analysis_id,
        "maskedImageUrl": masked_record["url"],
        "safeImageUrl": masked_record["url"],
    }


async def seed_demo_analyses() -> None:
    if any(item.get("ownerId") == "demo-user" for item in store.analyses.values()):
        return
    for title, mode in (("SNS 사진 점검", "sns"), ("중고거래 게시글 사진 점검", "marketplace"), ("과제 캡처 점검", "assignment")):
        created = create_analysis(title, mode, "demo-user")
        await run_analysis(created["id"], "demo-user")

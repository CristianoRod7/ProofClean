from datetime import datetime, timezone
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, status

from app.data.store import store
from app.services.ai import ai_service
from app.services.file_storage_service import create_sample_file
from app.services.masking_service import create_masked_image
from app.services.mock_ai_service import normalize_mode
from app.services.ocr_service import OCRServiceError, apply_ai_estimated_status, ocr_service
from app.services.risk_scoring_service import calculate_risk


logger = logging.getLogger(__name__)


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
        "summary": analysis.get("summary"),
        "detections": analysis.get("detections", []),
        "scenarios": analysis.get("scenarios", []),
        "recommendations": analysis.get("recommendations", []),
        "originalImageUrl": analysis.get("originalImageUrl"),
        "maskedImageUrl": analysis.get("maskedImageUrl"),
        "fileName": analysis.get("fileName"),
        "imageWidth": analysis.get("imageWidth"),
        "imageHeight": analysis.get("imageHeight"),
        "sourceType": analysis.get("sourceType", "sample"),
        "isSample": analysis.get("isSample", True),
        "provider": analysis.get("provider"),
        "aiFallback": analysis.get("aiFallback", False),
        "fallbackReason": analysis.get("fallbackReason"),
        "maskedCount": analysis.get("maskedCount", 0),
        "skippedCount": analysis.get("skippedCount", 0),
        "mergedCount": analysis.get("mergedCount", 0),
        "maskingStyle": analysis.get("maskingStyle"),
        "skippedReasons": analysis.get("skippedReasons", []),
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
        "summary": None,
        "detections": [],
        "scenarios": [],
        "recommendations": [],
        "originalImageUrl": None,
        "maskedImageUrl": None,
        "fileId": None,
        "fileName": None,
        "imageWidth": None,
        "imageHeight": None,
        "uploadedFilePath": None,
        "sourceType": "sample",
        "isSample": True,
        "provider": None,
        "aiFallback": False,
        "fallbackReason": None,
        "maskedCount": 0,
        "skippedCount": 0,
        "mergedCount": 0,
        "maskingStyle": None,
        "skippedReasons": [],
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="분석 기록을 찾을 수 없습니다.")
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
        "imageWidth": file_record.get("width"),
        "imageHeight": file_record.get("height"),
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
        "imageWidth": sample.get("width"),
        "imageHeight": sample.get("height"),
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
    logger.info(
        "[AnalysisService] run analysis_id=%s sourceType=%s mode=%s file_path=%s file_exists=%s",
        analysis_id,
        source_type,
        analysis["mode"],
        file_path or "<none>",
        bool(file_path and Path(file_path).is_file()),
    )
    ai_result = await ai_service.analyze_image(file_path=file_path, mode=analysis["mode"], source_type=source_type)
    ocr_warning = None
    if source_type == "upload" and file_path and ai_result.get("provider") in {"gemini", "openai"} and not ai_result.get("aiFallback"):
        try:
            ocr_result = ocr_service.enrich_detections(ai_result["detections"], file_path, analysis["mode"])
            ai_result["detections"] = ocr_result["detections"]
            logger.info(
                "[AnalysisService] OCR matched analysis_id=%s items=%s lines=%s matched=%s",
                analysis_id,
                ocr_result["ocrItemsCount"],
                ocr_result["ocrLinesCount"],
                ocr_result["ocrMatchedCount"],
            )
        except OCRServiceError as error:
            ocr_warning = f"OCR failed: {error.code}: {error.message}"
            ai_result["detections"] = [apply_ai_estimated_status(detection) for detection in ai_result["detections"]]
            logger.warning("[AnalysisService] %s", ocr_warning)
    score, level = calculate_risk(ai_result["detections"])
    analysis.update({
        "status": "completed",
        "detections": ai_result["detections"],
        "scenarios": ai_result["scenarios"],
        "recommendations": ai_result["recommendations"],
        "summary": ai_result.get("summary"),
        "riskScore": score,
        "riskLevel": level,
        "provider": ai_result["provider"],
        "sourceType": source_type,
        "isSample": source_type == "sample",
        "aiFallback": ai_result["aiFallback"],
        "fallbackReason": "; ".join(reason for reason in (ai_result["fallbackReason"], ocr_warning) if reason) or None,
        "updatedAt": now(),
    })
    logger.info(
        "[AnalysisService] completed analysis_id=%s provider=%s sourceType=%s aiFallback=%s fallbackReason=%s",
        analysis_id,
        ai_result["provider"],
        source_type,
        ai_result["aiFallback"],
        analysis.get("fallbackReason"),
    )
    return serialize_analysis(analysis)


async def mask_analysis(analysis_id: str, user_id: str) -> dict:
    analysis = require_analysis(analysis_id, user_id)
    if not analysis.get("detections"):
        await run_analysis(analysis_id, user_id)
    try:
        masked_record = create_masked_image(analysis)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    analysis.update({
        "status": "masked",
        "maskedImageUrl": masked_record["url"],
        "maskedCount": masked_record["maskedCount"],
        "skippedCount": masked_record["skippedCount"],
        "mergedCount": masked_record.get("mergedCount", 0),
        "maskingStyle": masked_record.get("maskingStyle", "pixelate"),
        "skippedReasons": masked_record["skippedReasons"],
        "updatedAt": now(),
    })
    return {
        "analysisId": analysis_id,
        "maskedImageUrl": masked_record["url"],
        "safeImageUrl": masked_record["url"],
        "maskedCount": masked_record["maskedCount"],
        "skippedCount": masked_record["skippedCount"],
        "mergedCount": masked_record.get("mergedCount", 0),
        "maskingStyle": masked_record.get("maskingStyle", "pixelate"),
        "skippedReasons": masked_record["skippedReasons"],
    }


async def seed_demo_analyses() -> None:
    if any(item.get("ownerId") == "demo-user" for item in store.analyses.values()):
        return
    for title, mode in (("SNS 사진 점검", "sns"), ("중고거래 게시글 사진 점검", "marketplace"), ("과제 캡처 점검", "assignment")):
        created = create_analysis(title, mode, "demo-user")
        await run_analysis(created["id"], "demo-user")

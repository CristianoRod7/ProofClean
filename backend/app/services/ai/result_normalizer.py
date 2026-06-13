from copy import deepcopy
from typing import Any

from app.services.mock_ai_service import generate_analysis, normalize_mode


LABELS = {
    "FACE": "얼굴 후보", "LOCATION_HINT": "위치 단서", "PROFILE_TEXT": "프로필 텍스트",
    "INVOICE": "송장 정보 후보", "PHONE": "전화번호 후보", "ADDRESS": "주소 후보",
    "STUDENT_ID": "학번 후보", "EMAIL": "이메일 후보", "FILE_PATH": "저장 경로 후보",
    "DOCUMENT_INFO": "문서 정보 후보", "NICKNAME": "닉네임 후보", "COMMENT_TEXT": "댓글 단서",
    "TEXT": "텍스트 후보",
}


class ResultNormalizer:
    def normalize(
        self,
        raw: dict | None,
        mode: str,
        *,
        source_type: str = "sample",
        provider: str = "mock",
        image_size: tuple[int, int] | None = None,
    ) -> dict:
        normalized_mode = normalize_mode(mode)
        mock_detections, mock_scenarios, mock_recommendations = generate_analysis(normalized_mode)
        data = raw if isinstance(raw, dict) else {}
        raw_detections = data.get("detections")
        detections_missing = not isinstance(raw_detections, list)
        used_defaults = detections_missing or (provider == "mock" and not raw_detections)
        detection_input = deepcopy(mock_detections) if used_defaults else raw_detections
        scenarios = self._provider_list(data, "scenarios", mock_scenarios, provider)
        recommendations = self._provider_list(data, "recommendations", mock_recommendations, provider)
        return {
            "detections": self._detections(
                detection_input,
                source_type=source_type,
                provider=provider,
                image_size=image_size,
                defaults_used=used_defaults,
            ),
            "scenarios": self._scenarios(scenarios),
            "recommendations": self._recommendations(recommendations),
            "usedDefaultDetections": used_defaults,
        }

    @staticmethod
    def _provider_list(data: dict, key: str, mock_default: list, provider: str) -> list:
        value = data.get(key)
        if isinstance(value, list) and (value or provider == "openai"):
            return value
        return mock_default

    def _detections(
        self,
        items: list,
        *,
        source_type: str,
        provider: str,
        image_size: tuple[int, int] | None,
        defaults_used: bool,
    ) -> list[dict]:
        result = []
        for index, raw_item in enumerate(items, 1):
            item = raw_item if isinstance(raw_item, dict) else {}
            item_type = str(item.get("type") or "TEXT").upper()
            confidence = self._confidence(item.get("confidence"))
            severity = str(item.get("severity") or "medium").lower()
            if severity not in {"low", "medium", "high", "critical"}:
                severity = "medium"

            is_upload_demo = source_type == "upload" and (provider == "mock" or defaults_used)
            box, coordinate_space = (None, "none") if is_upload_demo else self._box(item, image_size)
            if is_upload_demo:
                coordinate_status = "demo"
                coordinate_source = "mock"
            elif box is None:
                coordinate_status = "none"
                coordinate_source = provider
            elif source_type == "sample":
                coordinate_status = "demo"
                coordinate_source = "mock"
            else:
                requested_status = str(item.get("coordinateStatus") or "").lower()
                coordinate_status = "verified" if requested_status == "verified" else "estimated"
                coordinate_source = provider

            result.append({
                "id": str(item.get("id") or f"det-{index}"),
                "type": item_type,
                "label": str(item.get("label") or LABELS.get(item_type, "개인정보 후보")),
                "confidence": confidence,
                "severity": severity,
                "description": str(item.get("description") or "공유 전 확인이 필요한 개인정보 노출 후보입니다."),
                "evidence": item.get("evidence") or item.get("extractedText"),
                "box": box,
                "coordinateSpace": coordinate_space,
                "coordinateStatus": coordinate_status,
                "coordinateSource": coordinate_source,
                "imageWidth": image_size[0] if image_size else None,
                "imageHeight": image_size[1] if image_size else None,
            })
        return result

    @staticmethod
    def _confidence(value: Any) -> float:
        try:
            return max(0.0, min(1.0, float(value if value is not None else 0.7)))
        except (TypeError, ValueError):
            return 0.7

    @staticmethod
    def _box(item: dict, image_size: tuple[int, int] | None) -> tuple[dict | None, str]:
        raw_box = item.get("box")
        if not isinstance(raw_box, dict) or not all(key in raw_box for key in ("x", "y", "width", "height")):
            return None, "none"
        try:
            box = {key: float(raw_box[key]) for key in ("x", "y", "width", "height")}
        except (TypeError, ValueError):
            return None, "none"
        if box["width"] <= 0 or box["height"] <= 0:
            return None, "none"

        declared_space = str(item.get("coordinateSpace") or item.get("boxSpace") or "").lower()
        normalized = declared_space == "normalized" or (
            declared_space != "pixel" and all(0 <= value <= 1 for value in box.values())
        )
        if normalized:
            x = max(0.0, min(1.0, box["x"]))
            y = max(0.0, min(1.0, box["y"]))
            width = max(0.0, min(1.0 - x, box["width"]))
            height = max(0.0, min(1.0 - y, box["height"]))
            if width == 0 or height == 0:
                return None, "none"
            return {"x": x, "y": y, "width": width, "height": height}, "normalized"

        if not image_size:
            return None, "none"
        image_width, image_height = image_size
        x = max(0.0, min(float(image_width), box["x"]))
        y = max(0.0, min(float(image_height), box["y"]))
        width = max(0.0, min(float(image_width) - x, box["width"]))
        height = max(0.0, min(float(image_height) - y, box["height"]))
        if width == 0 or height == 0:
            return None, "none"
        return {"x": x, "y": y, "width": width, "height": height}, "pixel"

    def _scenarios(self, items: list) -> list[dict]:
        return [{
            "id": str(item.get("id") or f"scenario-{index}"),
            "title": str(item.get("title") or "개인정보 노출 가능성"),
            "level": str(item.get("level") or "medium").lower(),
            "description": str(item.get("description") or "여러 단서가 결합되면 개인이나 생활권이 추정될 수 있습니다."),
        } for index, item in enumerate((item for item in items if isinstance(item, dict)), 1)]

    def _recommendations(self, items: list) -> list[dict]:
        return [{
            "id": str(item.get("id") or f"rec-{index}"),
            "title": str(item.get("title") or "탐지 후보를 확인하세요."),
            "description": str(item.get("description") or "공유 전 해당 영역을 검토하고 필요하면 마스킹하세요."),
            "completed": bool(item.get("completed", False)),
        } for index, item in enumerate((item for item in items if isinstance(item, dict)), 1)]

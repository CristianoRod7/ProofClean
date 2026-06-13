from copy import deepcopy

from app.services.mock_ai_service import generate_analysis, normalize_mode


LABELS = {
    "FACE": "얼굴 후보", "LOCATION_HINT": "위치 단서", "PROFILE_TEXT": "프로필 텍스트",
    "INVOICE": "송장 정보 후보", "PHONE": "전화번호 후보", "ADDRESS": "주소 후보",
    "STUDENT_ID": "학번 후보", "EMAIL": "이메일 후보", "FILE_PATH": "저장 경로 후보",
    "DOCUMENT_INFO": "문서 정보 후보", "NICKNAME": "닉네임 후보", "COMMENT_TEXT": "댓글 단서",
    "TEXT": "텍스트 후보",
}
DEFAULT_BOXES = [
    {"x": 90, "y": 90, "width": 260, "height": 52},
    {"x": 390, "y": 180, "width": 290, "height": 58},
    {"x": 170, "y": 330, "width": 360, "height": 54},
    {"x": 480, "y": 450, "width": 250, "height": 48},
]


class ResultNormalizer:
    def normalize(self, raw: dict | None, mode: str) -> dict:
        normalized_mode = normalize_mode(mode)
        mock_detections, mock_scenarios, mock_recommendations = generate_analysis(normalized_mode)
        data = raw if isinstance(raw, dict) else {}
        raw_detections = data.get("detections")
        detections = self._detections(raw_detections, mock_detections)
        scenarios = data.get("scenarios") if isinstance(data.get("scenarios"), list) and data["scenarios"] else mock_scenarios
        recommendations = data.get("recommendations") if isinstance(data.get("recommendations"), list) and data["recommendations"] else mock_recommendations
        return {
            "detections": detections,
            "scenarios": self._scenarios(scenarios),
            "recommendations": self._recommendations(recommendations),
        }

    def _detections(self, raw: object, defaults: list[dict]) -> list[dict]:
        if not isinstance(raw, list) or not raw:
            return deepcopy(defaults)
        result = []
        for index, item in enumerate(raw, 1):
            item = item if isinstance(item, dict) else {}
            item_type = str(item.get("type") or "TEXT").upper()
            confidence = item.get("confidence", 0.7)
            try:
                confidence = max(0.0, min(1.0, float(confidence)))
            except (TypeError, ValueError):
                confidence = 0.7
            severity = str(item.get("severity") or "medium").lower()
            if severity not in {"low", "medium", "high"}:
                severity = "medium"
            box = item.get("box")
            if not isinstance(box, dict) or not all(key in box for key in ("x", "y", "width", "height")):
                box = DEFAULT_BOXES[(index - 1) % len(DEFAULT_BOXES)]
            else:
                try:
                    box = {key: max(0, int(float(box[key]))) for key in ("x", "y", "width", "height")}
                except (TypeError, ValueError):
                    box = DEFAULT_BOXES[(index - 1) % len(DEFAULT_BOXES)]
            result.append({
                "id": str(item.get("id") or f"det-{index}"),
                "type": item_type,
                "label": str(item.get("label") or LABELS.get(item_type, "개인정보 후보")),
                "confidence": confidence,
                "severity": severity,
                "description": str(item.get("description") or "공유 전 확인이 필요한 개인정보 노출 후보입니다."),
                "box": box,
            })
        return result

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

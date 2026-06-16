from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.services.mock_ai_service import normalize_mode

logger = logging.getLogger(__name__)

LINE_Y_TOLERANCE = 18
MIN_VERTICAL_OVERLAP = 0.5


class OCRServiceError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass
class MatchResult:
    box: dict | None
    status: str
    source_text: str | None = None


class OCRService:
    def __init__(self) -> None:
        self._reader = None

    def extract_text_boxes(self, file_path: str) -> dict:
        logger.info("[OCR] starting OCR file_path=%s", file_path)
        path = Path(file_path)
        if not path.is_file():
            raise OCRServiceError("OCR_IMAGE_MISSING", "uploaded image file is missing")
        try:
            import easyocr  # type: ignore[import-not-found]
        except ImportError as error:
            raise OCRServiceError("OCR_PACKAGE_UNAVAILABLE", "OCR package is not installed") from error

        try:
            if self._reader is None:
                self._reader = easyocr.Reader(["ko", "en"], gpu=False, verbose=False)
            raw_items = self._reader.readtext(str(path), detail=1, paragraph=False)
        except Exception as error:  # pragma: no cover - depends on OCR runtime binaries/models.
            raise OCRServiceError("OCR_RUNTIME_ERROR", str(error)) from error

        items = [self._item_from_easyocr(raw_item) for raw_item in raw_items]
        items = [item for item in items if item]
        lines = group_ocr_lines(items)
        logger.info("[OCR] success items=%s lines=%s", len(items), len(lines))
        return {"items": items, "lines": lines}

    @staticmethod
    def _item_from_easyocr(raw_item: Any) -> dict | None:
        try:
            points, text, confidence = raw_item
            xs = [float(point[0]) for point in points]
            ys = [float(point[1]) for point in points]
            x1, x2 = min(xs), max(xs)
            y1, y2 = min(ys), max(ys)
        except (TypeError, ValueError, IndexError):
            return None
        cleaned = " ".join(str(text).split()).strip()
        if not cleaned:
            return None
        return {
            "text": cleaned,
            "confidence": float(confidence or 0),
            "box": {"x": round(x1), "y": round(y1), "width": round(x2 - x1), "height": round(y2 - y1)},
        }

    def enrich_detections(self, detections: list[dict], file_path: str, mode: str) -> dict:
        ocr = self.extract_text_boxes(file_path)
        return enrich_detections_with_ocr(detections, ocr["items"], mode=mode)


def normalize_match_text(value: str | None) -> str:
    return re.sub(r"[^0-9A-Za-z가-힣]", "", str(value or "")).casefold()


def union_boxes(items: list[dict]) -> dict:
    x1 = min(float(item["box"]["x"]) for item in items)
    y1 = min(float(item["box"]["y"]) for item in items)
    x2 = max(float(item["box"]["x"]) + float(item["box"]["width"]) for item in items)
    y2 = max(float(item["box"]["y"]) + float(item["box"]["height"]) for item in items)
    return {"x": round(x1), "y": round(y1), "width": round(x2 - x1), "height": round(y2 - y1)}


def vertical_overlap_ratio(first: dict, second: dict) -> float:
    first_top = float(first["box"]["y"])
    first_bottom = first_top + float(first["box"]["height"])
    second_top = float(second["box"]["y"])
    second_bottom = second_top + float(second["box"]["height"])
    overlap = max(0.0, min(first_bottom, second_bottom) - max(first_top, second_top))
    smaller_height = max(1.0, min(first_bottom - first_top, second_bottom - second_top))
    return overlap / smaller_height


def same_line(first: dict, second: dict) -> bool:
    first_center = float(first["box"]["y"]) + float(first["box"]["height"]) / 2
    second_center = float(second["box"]["y"]) + float(second["box"]["height"]) / 2
    return abs(first_center - second_center) <= LINE_Y_TOLERANCE or vertical_overlap_ratio(first, second) >= MIN_VERTICAL_OVERLAP


def group_ocr_lines(items: list[dict]) -> list[dict]:
    sorted_items = sorted(items, key=lambda item: (float(item["box"]["y"]), float(item["box"]["x"])))
    groups: list[list[dict]] = []
    for item in sorted_items:
        for group in groups:
            if same_line(group[0], item):
                group.append(item)
                break
        else:
            groups.append([item])

    lines = []
    for group in groups:
        ordered = sorted(group, key=lambda item: float(item["box"]["x"]))
        lines.append({
            "text": " ".join(item["text"] for item in ordered),
            "items": ordered,
            "confidence": min(item.get("confidence", 0) for item in ordered),
            "box": union_boxes(ordered),
        })
    return lines



def split_text_tokens(text: str) -> list[tuple[str, int, int]]:
    return [(match.group(0), match.start(), match.end()) for match in re.finditer(r"\S+", text)]


def tokens_for_line(line: dict) -> list[dict]:
    tokens: list[dict] = []
    for item in line.get("items", []):
        text = item.get("text", "")
        parts = split_text_tokens(text)
        if not parts:
            continue
        item_box = item["box"]
        item_x = float(item_box["x"])
        item_y = float(item_box["y"])
        item_width = max(1.0, float(item_box["width"]))
        item_height = float(item_box["height"])
        text_length = max(1, len(text))
        for token_text, start, end in parts:
            token_x = item_x + item_width * (start / text_length)
            token_width = max(1.0, item_width * ((end - start) / text_length))
            tokens.append({
                "text": token_text,
                "box": {"x": round(token_x), "y": round(item_y), "width": round(token_width), "height": round(item_height)},
            })
    return sorted(tokens, key=lambda token: float(token["box"]["x"]))


def token_sequence_match_box(evidence: str, line: dict) -> dict | None:
    normalized_evidence = normalize_match_text(evidence)
    if not normalized_evidence:
        return None
    tokens = tokens_for_line(line)
    if not tokens:
        return None
    spans = []
    cursor = 0
    normalized_text = ""
    for token in tokens:
        normalized_token = normalize_match_text(token["text"])
        if not normalized_token:
            continue
        start = cursor
        normalized_text += normalized_token
        cursor += len(normalized_token)
        spans.append((start, cursor, token))
    match_start = normalized_text.find(normalized_evidence)
    if match_start < 0:
        if normalized_evidence.find(normalized_text) >= 0 and normalized_text:
            match_start = 0
            match_end = len(normalized_text)
        else:
            return None
    else:
        match_end = match_start + len(normalized_evidence)
    matched_tokens = [token for start, end, token in spans if start < match_end and end > match_start]
    if not matched_tokens:
        return None
    return union_boxes(matched_tokens)

def regex_for_type(detection_type: str) -> re.Pattern | None:
    patterns = {
        "PHONE": r"(01[016789])[-\s]?\d{3,4}[-\s]?\d{4}|0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}",
        "EMAIL": r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        "URL": r"(https?://[^\s]+|www\.[^\s]+|[A-Za-z0-9.-]+\.(com|kr|net|org)[^\s]*)",
        "STUDENT_ID": r"(학번\s*[:：]?\s*)?\d{8,10}",
        "ACCOUNT_NUMBER": r"(계좌|은행|국민|신한|농협|카카오뱅크|우리|하나)?.{0,8}\d{2,6}[-\s]?\d{2,6}[-\s]?\d{2,8}",
        "INVOICE": r"(송장|운송장|택배|배송|운송장번호)?.{0,8}\d{4}[-\s]?\d{4}[-\s]?\d{4}",
        "FILE_PATH": r"([A-Za-z]:\\[^\s]+|/Users/[^\s]+|/home/[^\s]+)",
    }
    pattern = patterns.get(detection_type)
    return re.compile(pattern, re.IGNORECASE) if pattern else None


ADDRESS_KEYWORDS = ("서울", "부산", "대전", "대구", "인천", "광주", "울산", "세종", "제주", "특별시", "광역시", "시", "군", "구", "동", "읍", "면", "로", "길", "번지", "아파트", "호")
LOCATION_KEYWORDS = ADDRESS_KEYWORDS + ("역", "학교", "병원", "공원", "해운대", "서귀포", "연남", "강남", "홍대")


def type_aware_match(detection_type: str, text: str) -> bool:
    pattern = regex_for_type(detection_type)
    if pattern and pattern.search(text):
        return True
    if detection_type == "ADDRESS":
        return any(keyword in text for keyword in ADDRESS_KEYWORDS) and bool(re.search(r"\d", text))
    if detection_type == "LOCATION_HINT":
        return any(keyword in text for keyword in LOCATION_KEYWORDS)
    if detection_type in {"NAME", "NICKNAME"}:
        return bool(re.search(r"(이름|받는 사람|수취인|닉네임|프로필명|아이디)\s*[:：]?\s*[가-힣A-Za-z0-9_]{2,12}", text))
    if detection_type == "DOCUMENT_INFO":
        return any(keyword in text for keyword in ("제목", "파일명", "문서명", "작성자", "생성일", "보고서", "과제"))
    return False


def match_detection_to_ocr(detection: dict, ocr_items: list[dict], lines: list[dict]) -> MatchResult:
    evidence = str(detection.get("evidence") or "").strip()
    detection_type = str(detection.get("type") or "TEXT").upper()
    normalized_evidence = normalize_match_text(evidence)
    if not normalized_evidence:
        return MatchResult(None, "none")

    for item in ocr_items:
        if item["text"].strip() == evidence:
            return MatchResult(item["box"], "ocr-exact", item["text"])

    for item in ocr_items:
        normalized_item = normalize_match_text(item["text"])
        if normalized_item and normalized_item == normalized_evidence:
            return MatchResult(item["box"], "ocr-exact", item["text"])

    for line in lines:
        token_box = token_sequence_match_box(evidence, line)
        if token_box:
            return MatchResult(token_box, "ocr-token", line["text"])

    for line in lines:
        normalized_line = normalize_match_text(line["text"])
        if normalized_evidence in normalized_line or normalized_line in normalized_evidence:
            return MatchResult(line["box"], "ocr-line", line["text"])

    for item in ocr_items:
        normalized_item = normalize_match_text(item["text"])
        if normalized_item and (normalized_evidence in normalized_item or normalized_item in normalized_evidence):
            return MatchResult(item["box"], "ocr-line", item["text"])

    candidates = lines + ocr_items
    for candidate in candidates:
        text = candidate["text"]
        if type_aware_match(detection_type, text):
            return MatchResult(candidate["box"], "ocr-regex", text)

    return MatchResult(None, "none")


def apply_ai_estimated_status(detection: dict) -> dict:
    if isinstance(detection.get("box"), dict):
        return {
            **detection,
            "boxStatus": "ai-estimated",
            "coordinateStatus": "estimated",
            "coordinateSource": detection.get("source") or "ai",
        }
    return {**detection, "box": None, "boxStatus": "none", "coordinateSpace": "none", "coordinateStatus": "none"}


def enrich_detections_with_ocr(detections: list[dict], ocr_items: list[dict], mode: str = "other") -> dict:
    normalized_mode = normalize_mode(mode)
    lines = group_ocr_lines(ocr_items)
    enriched = []
    matched_count = 0
    for detection in detections:
        match = match_detection_to_ocr(detection, ocr_items, lines)
        if match.box:
            matched_count += 1
            logger.info(
                "[Matcher] detection=%s evidence=%s matched=%s",
                detection.get("type"),
                str(detection.get("evidence") or "")[:32],
                match.status,
            )
            enriched.append({
                **detection,
                "box": match.box,
                "boxStatus": match.status,
                "coordinateSpace": "pixel",
                "coordinateStatus": "verified" if match.status == "ocr-exact" else "estimated",
                "coordinateSource": "ocr",
                "ocrMatchedText": match.source_text,
            })
        else:
            logger.info(
                "[Matcher] unmatched detection=%s evidence=%s",
                detection.get("type"),
                str(detection.get("evidence") or "")[:32],
            )
            enriched.append(apply_ai_estimated_status(detection))
    return {"detections": enriched, "ocrItemsCount": len(ocr_items), "ocrLinesCount": len(lines), "ocrMatchedCount": matched_count, "mode": normalized_mode}


ocr_service = OCRService()

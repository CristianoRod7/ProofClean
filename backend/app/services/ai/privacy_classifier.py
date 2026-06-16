import re
from dataclasses import dataclass

from app.services.mock_ai_service import normalize_mode


SUPPORTED_TYPES = {
    "PHONE", "ADDRESS", "EMAIL", "STUDENT_ID", "ACCOUNT_NUMBER", "URL",
    "NAME", "LOCATION_HINT", "INVOICE", "FILE_PATH", "DOCUMENT_INFO",
    "NICKNAME", "FACE", "TEXT",
}

LABELS = {
    "PHONE": "전화번호",
    "ADDRESS": "주소",
    "EMAIL": "이메일",
    "STUDENT_ID": "학번",
    "ACCOUNT_NUMBER": "계좌번호",
    "URL": "링크",
    "NAME": "이름/실명 후보",
    "LOCATION_HINT": "위치 단서",
    "INVOICE": "송장/운송장 정보",
    "FILE_PATH": "파일 경로",
    "DOCUMENT_INFO": "문서 정보",
    "NICKNAME": "닉네임/프로필명",
    "FACE": "얼굴 후보",
    "TEXT": "기타 텍스트 후보",
}

PHONE_RE = re.compile(r"(?<!\d)(01[016789])[-\s]?\d{3,4}[-\s]?\d{4}(?!\d)|(?<!\d)0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}(?!\d)")
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
URL_RE = re.compile(r"(?:https?://[^\s]+|www\.[^\s]+|[A-Za-z0-9.-]+\.(?:com|kr|net|org)(?:/[^\s]*)?)", re.IGNORECASE)
FILE_PATH_RE = re.compile(r"(?:[A-Za-z]:\\[^\r\n]+|/Users/[^\s]+|/home/[^\s]+)")
STUDENT_RE = re.compile(r"(?:학번\s*[:：]?\s*)?(\d{8,10})")
ACCOUNT_RE = re.compile(r"(?<!\d)\d{2,6}[-\s]\d{2,6}[-\s]\d{2,8}(?!\d)")
NAME_RE = re.compile(r"(?:이름|받는\s*사람|수취인)\s*[:：]?\s*([가-힣]{2,4})")
NICKNAME_RE = re.compile(r"(?:닉네임|프로필명|아이디)\s*[:：]?\s*([^\s,|]{2,24})", re.IGNORECASE)

ADDRESS_REGIONS = (
    "서울", "부산", "대전", "대구", "인천", "광주", "울산", "세종", "제주",
    "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남",
)
ADDRESS_TERMS = ("특별시", "광역시", "특별자치시", "도", "시", "군", "구", "동", "읍", "면", "로", "길", "번지", "아파트", "호")
INVOICE_TERMS = ("송장", "운송장", "택배", "배송", "받는 사람", "수취인", "배송지", "운송장번호", "바코드")
ACCOUNT_TERMS = ("계좌", "은행", "국민", "신한", "농협", "카카오뱅크", "우리", "하나", "기업")
DOCUMENT_TERMS = ("문서명", "작성자", "생성일", "저장소", "보고서", "과제", "파일명", ".pdf", ".doc", ".docx")
LOCATION_TERMS = ("해운대", "제주도", "서귀포", "연남동", "학교", "대학교", "캠퍼스", "역", "빌딩", "타워")

MODE_PRIORITY = {
    "sns": {"FACE", "LOCATION_HINT", "NICKNAME", "TEXT"},
    "marketplace": {"PHONE", "ADDRESS", "ACCOUNT_NUMBER", "INVOICE", "LOCATION_HINT"},
    "assignment": {"STUDENT_ID", "EMAIL", "FILE_PATH", "DOCUMENT_INFO", "NAME"},
    "community": {"NICKNAME", "EMAIL", "LOCATION_HINT", "TEXT"},
    "messenger": {"PHONE", "ACCOUNT_NUMBER", "URL", "NICKNAME", "TEXT"},
    "other": SUPPORTED_TYPES,
}


@dataclass(frozen=True)
class Classification:
    type: str
    label: str
    reason: str
    severity: str
    confidence: float


class PrivacyClassifier:
    def classify_evidence(
        self,
        text: str,
        mode: str | None = None,
        suggested_type: str | None = None,
        confidence: float | None = None,
    ) -> Classification:
        evidence = " ".join(str(text or "").split())
        normalized_mode = normalize_mode(mode)
        detected_type, reason = self._classify(evidence, normalized_mode)

        suggested = str(suggested_type or "").upper()
        if detected_type == "TEXT" and suggested in SUPPORTED_TYPES:
            detected_type = suggested
            reason = "이미지 분석 모델이 해당 개인정보 유형 후보로 분류했습니다."

        base_confidence = self._clamp_confidence(confidence)
        if detected_type == "TEXT":
            base_confidence = min(base_confidence, 0.55)
        elif detected_type in MODE_PRIORITY.get(normalized_mode, set()):
            base_confidence = min(1.0, base_confidence + 0.05)

        return Classification(
            type=detected_type,
            label=LABELS[detected_type],
            reason=reason,
            severity=self._severity(detected_type, normalized_mode),
            confidence=base_confidence,
        )

    def _classify(self, text: str, mode: str) -> tuple[str, str]:
        if EMAIL_RE.search(text):
            return "EMAIL", "이메일 주소 형식과 일치합니다."
        if URL_RE.search(text):
            return "URL", "웹 주소 또는 링크 형식과 일치합니다."
        if PHONE_RE.search(text):
            return "PHONE", "전화번호 형식과 일치합니다."
        if FILE_PATH_RE.search(text):
            return "FILE_PATH", "사용자 또는 프로젝트 정보가 포함될 수 있는 파일 경로 형식입니다."
        if any(term in text for term in INVOICE_TERMS):
            return "INVOICE", "송장·배송·수취인 관련 키워드가 포함되어 있습니다."
        if self._is_address(text):
            return "ADDRESS", "지역명과 상세 주소 표현 또는 숫자가 함께 포함되어 있습니다."
        if self._is_student_id(text, mode):
            return "STUDENT_ID", "학번 키워드 또는 과제 문맥의 8~10자리 식별번호 형식입니다."
        if self._is_account_number(text, mode):
            return "ACCOUNT_NUMBER", "은행·계좌 문맥의 구분된 숫자 형식입니다."
        if NAME_RE.search(text):
            return "NAME", "이름·수취인 키워드 뒤의 한글 실명 형식입니다."
        if NICKNAME_RE.search(text):
            return "NICKNAME", "닉네임·프로필명·아이디 키워드가 포함되어 있습니다."
        if any(term in text for term in DOCUMENT_TERMS):
            return "DOCUMENT_INFO", "문서 제목·파일명·작성 정보로 볼 수 있는 표현입니다."
        if any(region in text for region in ADDRESS_REGIONS) or any(term in text for term in LOCATION_TERMS):
            return "LOCATION_HINT", "지역명·학교명·건물명 등 위치를 추정할 수 있는 단서입니다."
        return "TEXT", "공유 전 문맥을 직접 확인해야 하는 기타 텍스트 후보입니다."

    @staticmethod
    def _is_address(text: str) -> bool:
        has_region = any(region in text for region in ADDRESS_REGIONS)
        term_count = sum(term in text for term in ADDRESS_TERMS)
        return (has_region and term_count >= 1) or (term_count >= 2 and bool(re.search(r"\d", text)))

    @staticmethod
    def _is_student_id(text: str, mode: str) -> bool:
        match = STUDENT_RE.search(text)
        if not match:
            return False
        return "학번" in text or mode == "assignment"

    @staticmethod
    def _is_account_number(text: str, mode: str) -> bool:
        if not ACCOUNT_RE.search(text):
            return False
        has_context = any(term in text for term in ACCOUNT_TERMS)
        return has_context or mode in {"marketplace", "messenger"}

    @staticmethod
    def _severity(item_type: str, mode: str) -> str:
        if item_type in {"EMAIL", "PHONE", "ADDRESS", "ACCOUNT_NUMBER"}:
            return "high"
        if mode == "assignment" and item_type in {"STUDENT_ID", "FILE_PATH"}:
            return "high"
        if item_type in {"STUDENT_ID", "URL", "NAME", "INVOICE", "FILE_PATH", "LOCATION_HINT", "NICKNAME"}:
            return "medium"
        return "low"

    @staticmethod
    def _clamp_confidence(value: float | None) -> float:
        try:
            return max(0.0, min(1.0, float(value if value is not None else 0.7)))
        except (TypeError, ValueError):
            return 0.7

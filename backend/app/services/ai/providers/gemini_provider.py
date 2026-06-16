import json
import logging
import mimetypes
from pathlib import Path
from typing import Any

from app.core.config import settings


logger = logging.getLogger(__name__)


class GeminiProviderError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class GeminiProvider:
    async def analyze(self, file_path: str | None, prompt: str, mode: str) -> dict:
        logger.info(
            "[GeminiProvider] preparing request model=%s mode=%s has_api_key=%s",
            settings.gemini_model,
            mode,
            bool(settings.gemini_api_key),
        )
        if not settings.gemini_api_key:
            raise GeminiProviderError("GEMINI_API_KEY_MISSING", "GEMINI_API_KEY is missing")
        if not file_path or not Path(file_path).is_file():
            raise GeminiProviderError("UPLOADED_IMAGE_MISSING", "Uploaded image file is missing")

        try:
            from google import genai
            from google.genai import types
        except ImportError as exc:
            raise GeminiProviderError("GEMINI_SDK_UNAVAILABLE", "google-genai package is not installed") from exc

        path = Path(file_path)
        mime_type = mimetypes.guess_type(path.name)[0]
        if mime_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise GeminiProviderError("UNSUPPORTED_IMAGE_TYPE", "Unsupported image type for Gemini Vision analysis")

        image_bytes = path.read_bytes()
        client = genai.Client(api_key=settings.gemini_api_key)
        gemini_prompt = self._prompt(prompt)
        try:
            logger.info(
                "[GeminiProvider] calling Gemini model=%s mime_type=%s image_bytes=%d",
                settings.gemini_model,
                mime_type,
                len(image_bytes),
            )
            response = await client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=[
                    gemini_prompt,
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                ],
                config={"response_mime_type": "application/json"},
            )
        except Exception as exc:
            code = self._error_code(exc)
            logger.warning(
                "[GeminiProvider] failed code=%s error_type=%s",
                code,
                exc.__class__.__name__,
            )
            raise GeminiProviderError(code, f"Gemini Vision request failed ({exc.__class__.__name__})") from exc

        content = getattr(response, "text", None)
        if not content:
            raise GeminiProviderError("GEMINI_EMPTY_RESPONSE", "Gemini returned an empty response")
        try:
            parsed = json.loads(self._strip_json_fence(content))
        except json.JSONDecodeError as exc:
            raise GeminiProviderError("GEMINI_INVALID_RESPONSE", "Gemini response was not valid JSON") from exc
        if not self._is_valid_payload(parsed):
            raise GeminiProviderError("GEMINI_SCHEMA_MISMATCH", "Gemini response did not match the analysis schema")
        normalized = self._normalize_payload(parsed)
        logger.info(
            "[GeminiProvider] success model=%s detections=%d",
            settings.gemini_model,
            len(normalized["detections"]),
        )
        return normalized

    @staticmethod
    def _prompt(prompt: str) -> str:
        return (
            f"{prompt}\n\n"
            "Gemini 응답 규칙: JSON만 반환하세요. recommendations는 문자열 배열이어도 되지만 "
            "가능하면 id, title, description, completed를 가진 객체 배열로 반환하세요. "
            "좌표를 확실히 알 수 없으면 box는 null, boxStatus는 none, coordinateSpace는 null로 둡니다."
        )

    @staticmethod
    def _is_valid_payload(payload: Any) -> bool:
        return (
            isinstance(payload, dict)
            and isinstance(payload.get("detections"), list)
            and isinstance(payload.get("summary"), str)
            and isinstance(payload.get("recommendations"), list)
        )

    @staticmethod
    def _normalize_payload(payload: dict) -> dict:
        recommendations = []
        for index, item in enumerate(payload.get("recommendations", []), 1):
            if isinstance(item, dict):
                recommendations.append(item)
            else:
                text = str(item)
                recommendations.append({
                    "id": f"rec-{index}",
                    "title": text,
                    "description": text,
                    "completed": False,
                })
        return {
            "detections": payload.get("detections", []),
            "summary": payload.get("summary", ""),
            "scenarios": payload.get("scenarios") if isinstance(payload.get("scenarios"), list) else [],
            "recommendations": recommendations,
        }

    @staticmethod
    def _strip_json_fence(content: str) -> str:
        value = content.strip()
        if not value.startswith("```"):
            return value
        lines = value.splitlines()
        if lines and lines[0].strip().lower() in {"```", "```json"}:
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        return "\n".join(lines).strip()

    @staticmethod
    def _error_code(error: Exception) -> str:
        name = error.__class__.__name__.lower()
        text = str(error).lower()
        if "quota" in text or "resourceexhausted" in name:
            return "GEMINI_QUOTA_EXCEEDED"
        if "timeout" in name or "timeout" in text:
            return "GEMINI_TIMEOUT"
        if "permission" in text or "authentication" in name or "api_key" in text:
            return "GEMINI_AUTHENTICATION_FAILED"
        if "rate" in text:
            return "GEMINI_RATE_LIMIT"
        return "GEMINI_REQUEST_FAILED"

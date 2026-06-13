import base64
import json
import mimetypes
from pathlib import Path
from typing import Any

from app.core.config import settings


OPENAI_ANALYSIS_SCHEMA = {
    "name": "proofclean_image_analysis",
    "strict": True,
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "required": ["detections", "summary", "scenarios", "recommendations"],
        "properties": {
            "detections": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": [
                        "id", "type", "label", "confidence", "severity",
                        "description", "reason", "evidence", "box", "boxStatus", "coordinateSpace",
                    ],
                    "properties": {
                        "id": {"type": "string"},
                        "type": {
                            "type": "string",
                            "enum": [
                                "PHONE", "ADDRESS", "EMAIL", "STUDENT_ID", "ACCOUNT_NUMBER",
                                "URL", "NAME", "LOCATION_HINT", "INVOICE", "FILE_PATH",
                                "DOCUMENT_INFO", "NICKNAME", "FACE", "TEXT",
                            ],
                        },
                        "label": {"type": "string"},
                        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                        "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
                        "description": {"type": "string"},
                        "reason": {"type": "string"},
                        "evidence": {"type": ["string", "null"]},
                        "box": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["x", "y", "width", "height"],
                                    "properties": {
                                        "x": {"type": "number", "minimum": 0, "maximum": 1},
                                        "y": {"type": "number", "minimum": 0, "maximum": 1},
                                        "width": {"type": "number", "exclusiveMinimum": 0, "maximum": 1},
                                        "height": {"type": "number", "exclusiveMinimum": 0, "maximum": 1},
                                    },
                                },
                                {"type": "null"},
                            ]
                        },
                        "boxStatus": {"type": "string", "enum": ["exact", "estimated", "none"]},
                        "coordinateSpace": {"type": ["string", "null"], "enum": ["normalized", None]},
                    },
                },
            },
            "summary": {"type": "string"},
            "scenarios": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["id", "title", "level", "description"],
                    "properties": {
                        "id": {"type": "string"},
                        "title": {"type": "string"},
                        "level": {"type": "string", "enum": ["low", "medium", "high", "critical"]},
                        "description": {"type": "string"},
                    },
                },
            },
            "recommendations": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["id", "title", "description", "completed"],
                    "properties": {
                        "id": {"type": "string"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "completed": {"type": "boolean"},
                    },
                },
            },
        },
    },
}


class OpenAIProviderError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class OpenAIProvider:
    async def analyze(self, file_path: str | None, prompt: str, mode: str) -> dict:
        if not settings.openai_api_key:
            raise OpenAIProviderError("OPENAI_API_KEY_MISSING", "OPENAI_API_KEY is missing")
        if not file_path or not Path(file_path).is_file():
            raise OpenAIProviderError("UPLOADED_IMAGE_MISSING", "Uploaded image file is missing")

        try:
            from openai import AsyncOpenAI
        except ImportError as exc:
            raise OpenAIProviderError("OPENAI_SDK_UNAVAILABLE", "openai package is not installed") from exc

        path = Path(file_path)
        mime_type = mimetypes.guess_type(path.name)[0]
        if mime_type not in {"image/jpeg", "image/png", "image/webp", "image/gif"}:
            raise OpenAIProviderError("UNSUPPORTED_IMAGE_TYPE", "Unsupported image type for Vision analysis")
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
        client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.openai_timeout_seconds,
            max_retries=settings.openai_max_retries,
        )
        try:
            response = await client.chat.completions.create(
                model=settings.openai_model,
                response_format={"type": "json_schema", "json_schema": OPENAI_ANALYSIS_SCHEMA},
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{encoded}",
                                    "detail": "high",
                                },
                            },
                        ],
                    }
                ],
            )
        except Exception as exc:
            raise OpenAIProviderError(self._error_code(exc), "OpenAI Vision request failed") from exc

        content = response.choices[0].message.content if response.choices else None
        if not content:
            raise OpenAIProviderError("OPENAI_EMPTY_RESPONSE", "OpenAI returned an empty response")
        try:
            parsed = json.loads(self._strip_json_fence(content))
        except json.JSONDecodeError as exc:
            raise OpenAIProviderError("OPENAI_INVALID_RESPONSE", "OpenAI response was not valid JSON") from exc
        if not self._is_valid_payload(parsed):
            raise OpenAIProviderError("OPENAI_SCHEMA_MISMATCH", "OpenAI response did not match the analysis schema")
        return parsed

    @staticmethod
    def _is_valid_payload(payload: Any) -> bool:
        return (
            isinstance(payload, dict)
            and isinstance(payload.get("detections"), list)
            and isinstance(payload.get("summary"), str)
            and isinstance(payload.get("scenarios"), list)
            and isinstance(payload.get("recommendations"), list)
        )

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
        if "timeout" in name:
            return "OPENAI_TIMEOUT"
        if "ratelimit" in name or "rate_limit" in name:
            return "OPENAI_RATE_LIMIT"
        if "authentication" in name or "permission" in name:
            return "OPENAI_AUTHENTICATION_FAILED"
        return "OPENAI_REQUEST_FAILED"

import logging
from pathlib import Path

from PIL import Image, UnidentifiedImageError

from app.core.config import settings
from app.services.ai.mock_provider import MockProvider
from app.services.ai.openai_provider import OpenAIProvider, OpenAIProviderError
from app.services.ai.prompt_builder import PromptBuilder
from app.services.ai.result_normalizer import ResultNormalizer
from app.services.mock_ai_service import normalize_mode


logger = logging.getLogger(__name__)


class AIService:
    def __init__(self) -> None:
        self.mock_provider = MockProvider()
        self.openai_provider = OpenAIProvider()
        self.prompt_builder = PromptBuilder()
        self.normalizer = ResultNormalizer()

    async def analyze_image(self, file_path: str | None, mode: str, source_type: str = "upload") -> dict:
        normalized_mode = normalize_mode(mode)
        prompt = self.prompt_builder.build(normalized_mode)
        image_size = self._image_size(file_path)
        path_exists = bool(file_path and Path(file_path).is_file())
        logger.info(
            "[AIService] sourceType=%s mode=%s file_path=%s file_exists=%s has_api_key=%s",
            source_type,
            normalized_mode,
            file_path or "<none>",
            path_exists,
            bool(settings.openai_api_key),
        )

        if source_type == "sample":
            logger.info("[AIService] selected provider=mock reason=sample")
            raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
            return {
                **self.normalizer.normalize(raw, normalized_mode, source_type="sample", provider="mock", image_size=image_size or (900, 620)),
                "provider": "mock",
                "aiFallback": False,
                "fallbackReason": None,
            }

        if path_exists:
            try:
                logger.info("[AIService] selected provider=openai")
                raw = await self.openai_provider.analyze(file_path, prompt, normalized_mode)
                normalized = self.normalizer.normalize(
                    raw,
                    normalized_mode,
                    source_type="upload",
                    provider="openai",
                    image_size=image_size,
                )
                normalized.pop("usedDefaultDetections", None)
                logger.info(
                    "[AIService] completed provider=openai detections=%d",
                    len(normalized["detections"]),
                )
                return {**normalized, "provider": "openai", "aiFallback": False, "fallbackReason": None}
            except Exception as error:
                reason = self._fallback_reason(error)
                logger.warning(
                    "[AIService] fallback provider=mock reason=%s",
                    reason,
                )
                raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
                normalized = self.normalizer.normalize(
                    raw,
                    normalized_mode,
                    source_type="upload",
                    provider="mock",
                    image_size=image_size,
                )
                normalized.pop("usedDefaultDetections", None)
                return {**normalized, "provider": "mock", "aiFallback": True, "fallbackReason": reason}

        if source_type == "upload":
            reason = "UPLOADED_IMAGE_MISSING: uploaded file path is missing or does not exist"
            logger.warning("[AIService] fallback provider=mock reason=%s", reason)
            raw = await self.mock_provider.analyze(None, prompt, normalized_mode)
            normalized = self.normalizer.normalize(
                raw,
                normalized_mode,
                source_type="upload",
                provider="mock",
                image_size=image_size,
            )
            normalized.pop("usedDefaultDetections", None)
            return {
                **normalized,
                "provider": "mock",
                "aiFallback": True,
                "fallbackReason": reason,
            }
        raw = await self.mock_provider.analyze(None, prompt, normalized_mode)
        return {
            **self.normalizer.normalize(raw, normalized_mode, source_type="sample", provider="mock", image_size=(900, 620)),
            "provider": "mock",
            "aiFallback": False,
            "fallbackReason": None,
        }

    @staticmethod
    def _fallback_reason(error: Exception) -> str:
        if isinstance(error, OpenAIProviderError):
            return f"{error.code}: {error}"
        return f"OPENAI_REQUEST_FAILED: {error.__class__.__name__}"

    @staticmethod
    def _image_size(file_path: str | None) -> tuple[int, int] | None:
        if not file_path or not Path(file_path).is_file():
            return None
        try:
            with Image.open(file_path) as image:
                return image.size
        except (UnidentifiedImageError, OSError):
            return None


ai_service = AIService()

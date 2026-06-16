import logging
from pathlib import Path

from PIL import Image, UnidentifiedImageError

from app.core.config import settings
from app.services.ai.mock_provider import MockProvider
from app.services.ai.openai_provider import OpenAIProvider, OpenAIProviderError
from app.services.ai.prompt_builder import PromptBuilder
from app.services.ai.providers.gemini_provider import GeminiProvider, GeminiProviderError
from app.services.ai.result_normalizer import ResultNormalizer
from app.services.mock_ai_service import normalize_mode


logger = logging.getLogger(__name__)


class AIService:
    def __init__(self) -> None:
        self.mock_provider = MockProvider()
        self.gemini_provider = GeminiProvider()
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
            failures = []
            logger.info("[AIService] AI_PROVIDER=%s", settings.ai_provider)
            for provider_name in self._provider_plan():
                try:
                    logger.info("[AIService] selected provider=%s", provider_name)
                    provider = self._provider(provider_name)
                    raw = await provider.analyze(file_path, prompt, normalized_mode)
                    normalized = self.normalizer.normalize(
                        raw,
                        normalized_mode,
                        source_type="upload",
                        provider=provider_name,
                        image_size=image_size,
                    )
                    normalized.pop("usedDefaultDetections", None)
                    logger.info(
                        "[AIService] completed provider=%s detections=%d",
                        provider_name,
                        len(normalized["detections"]),
                    )
                    return {**normalized, "provider": provider_name, "aiFallback": False, "fallbackReason": None}
                except Exception as error:
                    reason = self._fallback_reason(error)
                    failures.append(f"{self._provider_label(provider_name)} failed: {reason}")
                    logger.warning(
                        "[AIService] provider=%s failed reason=%s",
                        provider_name,
                        reason,
                    )
            reason = "; ".join(failures) or "AI_PROVIDER_FAILED: no AI provider was attempted"
            logger.warning("[AIService] fallback provider=mock reason=%s", reason)
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
        if isinstance(error, (OpenAIProviderError, GeminiProviderError)):
            return f"{error.code}: {error}"
        return f"AI_PROVIDER_REQUEST_FAILED: {error.__class__.__name__}"

    @staticmethod
    def _provider_plan() -> list[str]:
        provider = str(settings.ai_provider or "gemini").strip().lower()
        if provider == "gemini":
            return ["gemini"]
        if provider == "openai":
            return ["openai"]
        if provider == "auto":
            return ["gemini", "openai"]
        logger.warning("[AIService] unknown AI_PROVIDER=%s; using auto provider order", settings.ai_provider)
        return ["gemini", "openai"]

    def _provider(self, name: str):
        if name == "gemini":
            return self.gemini_provider
        if name == "openai":
            return self.openai_provider
        raise ValueError(f"Unsupported AI provider: {name}")

    @staticmethod
    def _provider_label(name: str) -> str:
        return {"gemini": "Gemini", "openai": "OpenAI"}.get(name, name)

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

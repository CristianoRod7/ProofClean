import logging
from pathlib import Path

from PIL import Image, UnidentifiedImageError

from app.services.ai.mock_provider import MockProvider
from app.services.ai.openai_provider import OpenAIProvider
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

        if source_type == "sample":
            raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
            return {
                **self.normalizer.normalize(raw, normalized_mode, source_type="sample", provider="mock", image_size=image_size or (900, 620)),
                "provider": "mock",
                "aiFallback": False,
                "fallbackReason": None,
            }

        if file_path:
            try:
                raw = await self.openai_provider.analyze(file_path, prompt, normalized_mode)
                normalized = self.normalizer.normalize(
                    raw,
                    normalized_mode,
                    source_type="upload",
                    provider="openai",
                    image_size=image_size,
                )
                used_defaults = normalized.pop("usedDefaultDetections", False)
                if used_defaults:
                    return {
                        **normalized,
                        "provider": "mock",
                        "aiFallback": True,
                        "fallbackReason": "AI 응답에 탐지 후보가 없어 데모 탐지 기준으로 대체했습니다.",
                    }
                return {**normalized, "provider": "openai", "aiFallback": False, "fallbackReason": None}
            except Exception as error:
                logger.warning("OpenAI analysis failed; using mock provider: %s", error)
                raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
                normalized = self.normalizer.normalize(
                    raw,
                    normalized_mode,
                    source_type="upload",
                    provider="mock",
                    image_size=image_size,
                )
                normalized.pop("usedDefaultDetections", None)
                return {**normalized, "provider": "mock", "aiFallback": True, "fallbackReason": str(error)}

        raw = await self.mock_provider.analyze(None, prompt, normalized_mode)
        return {
            **self.normalizer.normalize(raw, normalized_mode, source_type="sample", provider="mock", image_size=(900, 620)),
            "provider": "mock",
            "aiFallback": False,
            "fallbackReason": None,
        }

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

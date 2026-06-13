import logging

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

        if source_type == "sample":
            raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
            return {**self.normalizer.normalize(raw, normalized_mode), "provider": "mock", "aiFallback": False, "fallbackReason": None}

        if file_path:
            try:
                raw = await self.openai_provider.analyze(file_path, prompt, normalized_mode)
                return {**self.normalizer.normalize(raw, normalized_mode), "provider": "openai", "aiFallback": False, "fallbackReason": None}
            except Exception as error:
                logger.warning("OpenAI analysis failed; using mock provider: %s", error)
                raw = await self.mock_provider.analyze(file_path, prompt, normalized_mode)
                return {**self.normalizer.normalize(raw, normalized_mode), "provider": "mock", "aiFallback": True, "fallbackReason": str(error)}

        raw = await self.mock_provider.analyze(None, prompt, normalized_mode)
        return {**self.normalizer.normalize(raw, normalized_mode), "provider": "mock", "aiFallback": False, "fallbackReason": None}


ai_service = AIService()

import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock

from PIL import Image

from app.services.ai.ai_service import AIService
from app.services.ai.providers.gemini_provider import GeminiProviderError
from app.services.ai.openai_provider import OpenAIProviderError
from app.core.config import settings


class AIServiceTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.original_ai_provider = settings.ai_provider
        self.service = AIService()
        self.temp_dir = tempfile.TemporaryDirectory()
        self.image_path = Path(self.temp_dir.name) / "upload.png"
        Image.new("RGB", (800, 600), "white").save(self.image_path)

    def tearDown(self) -> None:
        settings.ai_provider = self.original_ai_provider
        self.temp_dir.cleanup()

    async def test_sample_always_uses_mock_provider(self) -> None:
        self.service.openai_provider.analyze = AsyncMock(side_effect=AssertionError("OpenAI must not be called"))
        self.service.gemini_provider.analyze = AsyncMock(side_effect=AssertionError("Gemini must not be called"))

        result = await self.service.analyze_image(None, "sns", source_type="sample")

        self.assertEqual(result["provider"], "mock")
        self.assertFalse(result["aiFallback"])
        self.assertTrue(result["detections"])
        self.assertTrue(all(item["coordinateStatus"] == "demo" for item in result["detections"]))
        self.service.openai_provider.analyze.assert_not_awaited()
        self.service.gemini_provider.analyze.assert_not_awaited()

    async def test_upload_uses_gemini_when_configured(self) -> None:
        settings.ai_provider = "gemini"
        self.service.gemini_provider.analyze = AsyncMock(return_value={
            "detections": [{
                "type": "PHONE",
                "evidence": "010-1234-5678",
                "confidence": 0.95,
                "severity": "high",
                "reason": "전화번호 형식입니다.",
                "box": None,
            }],
            "summary": "전화번호가 포함되어 있습니다.",
            "scenarios": [],
            "recommendations": [],
        })
        self.service.openai_provider.analyze = AsyncMock(side_effect=AssertionError("OpenAI must not be called"))

        result = await self.service.analyze_image(str(self.image_path), "marketplace", source_type="upload")

        self.assertEqual(result["provider"], "gemini")
        self.assertFalse(result["aiFallback"])
        self.assertEqual(result["detections"][0]["evidence"], "010-1234-5678")
        self.service.gemini_provider.analyze.assert_awaited_once()
        self.service.openai_provider.analyze.assert_not_awaited()

    async def test_upload_accepts_valid_empty_openai_detection_list(self) -> None:
        settings.ai_provider = "openai"
        self.service.openai_provider.analyze = AsyncMock(return_value={
            "detections": [],
            "scenarios": [],
            "recommendations": [],
        })

        result = await self.service.analyze_image(str(self.image_path), "sns", source_type="upload")

        self.assertEqual(result["provider"], "openai")
        self.assertFalse(result["aiFallback"])
        self.assertEqual(result["detections"], [])

    async def test_upload_fallback_removes_all_mock_boxes(self) -> None:
        settings.ai_provider = "openai"
        self.service.openai_provider.analyze = AsyncMock(
            side_effect=OpenAIProviderError("OPENAI_TIMEOUT", "request timed out")
        )

        result = await self.service.analyze_image(str(self.image_path), "marketplace", source_type="upload")

        self.assertEqual(result["provider"], "mock")
        self.assertTrue(result["aiFallback"])
        self.assertEqual(result["fallbackReason"], "OpenAI failed: OPENAI_TIMEOUT: request timed out")
        self.assertTrue(result["detections"])
        self.assertTrue(all(item["box"] is None for item in result["detections"]))
        self.assertTrue(all(item["coordinateStatus"] == "demo" for item in result["detections"]))

    async def test_upload_without_file_is_explicit_fallback(self) -> None:
        result = await self.service.analyze_image(None, "sns", source_type="upload")

        self.assertEqual(result["provider"], "mock")
        self.assertTrue(result["aiFallback"])
        self.assertEqual(
            result["fallbackReason"],
            "UPLOADED_IMAGE_MISSING: uploaded file path is missing or does not exist",
        )
        self.assertTrue(all(item["box"] is None for item in result["detections"]))

    async def test_upload_openai_coordinates_remain_estimated(self) -> None:
        settings.ai_provider = "openai"
        self.service.openai_provider.analyze = AsyncMock(return_value={
            "detections": [{
                "id": "det-1",
                "type": "PHONE",
                "label": "전화번호 후보",
                "confidence": 0.9,
                "severity": "high",
                "description": "전화번호로 보이는 문자열입니다.",
                "evidence": "010-****-1234",
                "box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.1},
                "coordinateSpace": "normalized",
            }],
            "scenarios": [],
            "recommendations": [],
        })

        result = await self.service.analyze_image(str(self.image_path), "marketplace", source_type="upload")

        detection = result["detections"][0]
        self.assertEqual(result["provider"], "openai")
        self.assertEqual(detection["coordinateStatus"], "estimated")
        self.assertEqual(detection["coordinateSource"], "openai")
        self.assertEqual(detection["box"], {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.1})

    async def test_auto_tries_gemini_then_openai(self) -> None:
        settings.ai_provider = "auto"
        self.service.gemini_provider.analyze = AsyncMock(
            side_effect=GeminiProviderError("GEMINI_QUOTA_EXCEEDED", "quota exceeded")
        )
        self.service.openai_provider.analyze = AsyncMock(return_value={
            "detections": [],
            "scenarios": [],
            "recommendations": [],
        })

        result = await self.service.analyze_image(str(self.image_path), "sns", source_type="upload")

        self.assertEqual(result["provider"], "openai")
        self.assertFalse(result["aiFallback"])
        self.service.gemini_provider.analyze.assert_awaited_once()
        self.service.openai_provider.analyze.assert_awaited_once()

    async def test_auto_falls_back_after_all_ai_providers_fail(self) -> None:
        settings.ai_provider = "auto"
        self.service.gemini_provider.analyze = AsyncMock(
            side_effect=GeminiProviderError("GEMINI_QUOTA_EXCEEDED", "quota exceeded")
        )
        self.service.openai_provider.analyze = AsyncMock(
            side_effect=OpenAIProviderError("OPENAI_QUOTA_EXCEEDED", "insufficient quota")
        )

        result = await self.service.analyze_image(str(self.image_path), "marketplace", source_type="upload")

        self.assertEqual(result["provider"], "mock")
        self.assertTrue(result["aiFallback"])
        self.assertIn("Gemini failed: GEMINI_QUOTA_EXCEEDED: quota exceeded", result["fallbackReason"])
        self.assertIn("OpenAI failed: OPENAI_QUOTA_EXCEEDED: insufficient quota", result["fallbackReason"])
        self.assertTrue(all(item["box"] is None for item in result["detections"]))


if __name__ == "__main__":
    unittest.main()

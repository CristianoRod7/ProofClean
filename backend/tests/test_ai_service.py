import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock

from PIL import Image

from app.services.ai.ai_service import AIService
from app.services.ai.openai_provider import OpenAIProviderError


class AIServiceTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.service = AIService()
        self.temp_dir = tempfile.TemporaryDirectory()
        self.image_path = Path(self.temp_dir.name) / "upload.png"
        Image.new("RGB", (800, 600), "white").save(self.image_path)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    async def test_sample_always_uses_mock_provider(self) -> None:
        self.service.openai_provider.analyze = AsyncMock(side_effect=AssertionError("OpenAI must not be called"))

        result = await self.service.analyze_image(None, "sns", source_type="sample")

        self.assertEqual(result["provider"], "mock")
        self.assertFalse(result["aiFallback"])
        self.assertTrue(result["detections"])
        self.assertTrue(all(item["coordinateStatus"] == "demo" for item in result["detections"]))
        self.service.openai_provider.analyze.assert_not_awaited()

    async def test_upload_accepts_valid_empty_openai_detection_list(self) -> None:
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
        self.service.openai_provider.analyze = AsyncMock(
            side_effect=OpenAIProviderError("OPENAI_TIMEOUT", "request timed out")
        )

        result = await self.service.analyze_image(str(self.image_path), "marketplace", source_type="upload")

        self.assertEqual(result["provider"], "mock")
        self.assertTrue(result["aiFallback"])
        self.assertEqual(result["fallbackReason"], "OPENAI_TIMEOUT")
        self.assertTrue(result["detections"])
        self.assertTrue(all(item["box"] is None for item in result["detections"]))
        self.assertTrue(all(item["coordinateStatus"] == "demo" for item in result["detections"]))

    async def test_upload_without_file_is_explicit_fallback(self) -> None:
        result = await self.service.analyze_image(None, "sns", source_type="upload")

        self.assertEqual(result["provider"], "mock")
        self.assertTrue(result["aiFallback"])
        self.assertEqual(result["fallbackReason"], "UPLOADED_IMAGE_MISSING")
        self.assertTrue(all(item["box"] is None for item in result["detections"]))

    async def test_upload_openai_coordinates_remain_estimated(self) -> None:
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


if __name__ == "__main__":
    unittest.main()

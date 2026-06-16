import unittest

from app.services.ai.providers.gemini_provider import GeminiProvider


class GeminiProviderTests(unittest.TestCase):
    def test_strip_json_fence(self) -> None:
        content = "```json\n{\"detections\": [], \"summary\": \"없음\", \"recommendations\": []}\n```"
        self.assertEqual(
            GeminiProvider._strip_json_fence(content),
            "{\"detections\": [], \"summary\": \"없음\", \"recommendations\": []}",
        )

    def test_string_recommendations_are_normalized(self) -> None:
        payload = {
            "detections": [],
            "summary": "전화번호가 있습니다.",
            "recommendations": ["공유 전 전화번호를 가리세요."],
        }

        result = GeminiProvider._normalize_payload(payload)

        self.assertEqual(result["recommendations"][0]["id"], "rec-1")
        self.assertEqual(result["recommendations"][0]["title"], "공유 전 전화번호를 가리세요.")
        self.assertEqual(result["scenarios"], [])


if __name__ == "__main__":
    unittest.main()

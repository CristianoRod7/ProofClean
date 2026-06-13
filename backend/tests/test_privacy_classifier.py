import unittest

from app.services.ai.privacy_classifier import PrivacyClassifier
from app.services.ai.result_normalizer import ResultNormalizer


class PrivacyClassifierTests(unittest.TestCase):
    def setUp(self) -> None:
        self.classifier = PrivacyClassifier()

    def assert_type(self, text: str, expected: str, mode: str = "other") -> None:
        self.assertEqual(self.classifier.classify_evidence(text, mode=mode).type, expected)

    def test_marketplace_candidates(self) -> None:
        self.assert_type("010-1234-5678", "PHONE", "marketplace")
        self.assert_type("서울특별시 마포구 연남로 123", "ADDRESS", "marketplace")
        self.assert_type("국민 123456-78-901234", "ACCOUNT_NUMBER", "marketplace")
        self.assert_type("운송장번호 1234-5678-9012", "INVOICE", "marketplace")

    def test_assignment_candidates(self) -> None:
        self.assert_type("학번: 202416002", "STUDENT_ID", "assignment")
        self.assert_type("student202416002@college.ac.kr", "EMAIL", "assignment")
        self.assert_type(r"C:\Users\student\Desktop\final_report.pdf", "FILE_PATH", "assignment")
        self.assert_type("문서명: 기말 과제 보고서", "DOCUMENT_INFO", "assignment")

    def test_messenger_candidates(self) -> None:
        self.assert_type("010-9876-5432", "PHONE", "messenger")
        self.assert_type("계좌 123-456-7890", "ACCOUNT_NUMBER", "messenger")
        self.assert_type("https://test-link.kr/abc", "URL", "messenger")
        self.assert_type("프로필명: 개인정보지킴이", "NICKNAME", "messenger")

    def test_normalizer_deduplicates_and_keeps_coordinate_free_upload(self) -> None:
        result = ResultNormalizer().normalize(
            {
                "detections": [
                    {"type": "TEXT", "evidence": "010-1234-5678", "confidence": 0.7},
                    {"type": "PHONE", "evidence": "010-1234-5678", "confidence": 0.95},
                ],
                "summary": "전화번호가 보입니다.",
                "scenarios": [],
                "recommendations": [],
            },
            "marketplace",
            source_type="upload",
            provider="openai",
        )
        self.assertEqual(len(result["detections"]), 1)
        self.assertEqual(result["detections"][0]["type"], "PHONE")
        self.assertEqual(result["detections"][0]["boxStatus"], "none")
        self.assertIsNone(result["detections"][0]["box"])


if __name__ == "__main__":
    unittest.main()

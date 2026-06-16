import unittest

from app.services.ocr_service import enrich_detections_with_ocr, group_ocr_lines, normalize_match_text, token_sequence_match_box


class OCRMatchingTests(unittest.TestCase):
    def test_normalized_phone_match_creates_ocr_exact_box(self) -> None:
        detections = [{"id": "det-1", "type": "PHONE", "evidence": "010-1234-5678", "box": None}]
        ocr_items = [{
            "text": "010 1234 5678",
            "confidence": 0.92,
            "box": {"x": 312, "y": 421, "width": 128, "height": 24},
        }]

        result = enrich_detections_with_ocr(detections, ocr_items, mode="marketplace")

        self.assertEqual(result["ocrMatchedCount"], 1)
        self.assertEqual(result["detections"][0]["boxStatus"], "ocr-exact")
        self.assertEqual(result["detections"][0]["coordinateSpace"], "pixel")
        self.assertEqual(result["detections"][0]["box"]["x"], 312)

    def test_line_group_match_uses_full_line_box_for_address(self) -> None:
        detections = [{"id": "det-1", "type": "ADDRESS", "evidence": "서울특별시 마포구 연남로 123", "box": None}]
        ocr_items = [
            {"text": "서울특별시", "confidence": 0.9, "box": {"x": 20, "y": 80, "width": 64, "height": 18}},
            {"text": "마포구", "confidence": 0.9, "box": {"x": 90, "y": 82, "width": 42, "height": 18}},
            {"text": "연남로", "confidence": 0.9, "box": {"x": 140, "y": 81, "width": 44, "height": 18}},
            {"text": "123", "confidence": 0.9, "box": {"x": 192, "y": 82, "width": 32, "height": 18}},
        ]

        result = enrich_detections_with_ocr(detections, ocr_items, mode="marketplace")

        self.assertEqual(result["ocrLinesCount"], 1)
        self.assertEqual(result["detections"][0]["boxStatus"], "ocr-token")
        self.assertEqual(result["detections"][0]["box"], {"x": 20, "y": 80, "width": 204, "height": 20})


    def test_token_sequence_masks_value_without_label(self) -> None:
        line = {
            "text": "전화번호: 010-1234-5678",
            "items": [{"text": "전화번호: 010-1234-5678", "box": {"x": 100, "y": 50, "width": 200, "height": 20}}],
            "box": {"x": 100, "y": 50, "width": 200, "height": 20},
        }

        box = token_sequence_match_box("010-1234-5678", line)

        self.assertGreater(box["x"], 100)
        self.assertLess(box["width"], 150)

    def test_type_aware_regex_match_links_invoice_without_ai_evidence_box(self) -> None:
        detections = [{"id": "det-1", "type": "INVOICE", "evidence": "barcode", "box": None}]
        ocr_items = [{"text": "운송장번호 1234-5678-9012", "confidence": 0.88, "box": {"x": 40, "y": 120, "width": 180, "height": 22}}]

        result = enrich_detections_with_ocr(detections, ocr_items, mode="marketplace")

        self.assertEqual(result["detections"][0]["boxStatus"], "ocr-regex")
        self.assertEqual(result["ocrMatchedCount"], 1)

    def test_unmatched_detection_keeps_ai_box_as_ai_estimated(self) -> None:
        detections = [{
            "id": "det-1",
            "type": "EMAIL",
            "evidence": "missing@example.com",
            "box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.1},
            "coordinateSpace": "normalized",
        }]

        result = enrich_detections_with_ocr(detections, [], mode="other")

        self.assertEqual(result["detections"][0]["boxStatus"], "ai-estimated")
        self.assertEqual(result["detections"][0]["coordinateStatus"], "estimated")

    def test_normalize_match_text_removes_symbols(self) -> None:
        self.assertEqual(normalize_match_text("010-1234 5678"), "01012345678")


if __name__ == "__main__":
    unittest.main()

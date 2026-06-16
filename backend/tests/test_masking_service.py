import unittest

from app.services.masking_service import create_masked_image


class MaskingServiceTests(unittest.TestCase):
    def test_upload_with_demo_coordinates_is_not_masked(self) -> None:
        analysis = {
            "id": "analysis-test",
            "sourceType": "upload",
            "detections": [{
                "box": {"x": 0.1, "y": 0.1, "width": 0.2, "height": 0.1},
                "coordinateSpace": "normalized",
                "coordinateStatus": "demo",
            }],
        }

        with self.assertRaisesRegex(ValueError, "정확한 위치 좌표가 없어"):
            create_masked_image(analysis)

    def test_masking_reports_coordinate_free_items_as_skipped(self) -> None:
        analysis = {
            "id": "analysis-test-counts",
            "sourceType": "upload",
            "detections": [
                {
                    "label": "전화번호",
                    "box": {"x": 0.1, "y": 0.1, "width": 0.2, "height": 0.1},
                    "coordinateSpace": "normalized",
                    "boxStatus": "exact",
                },
                {"label": "이메일", "box": None, "boxStatus": "none"},
            ],
        }

        result = create_masked_image(analysis)

        self.assertEqual(result["maskedCount"], 1)
        self.assertEqual(result["skippedCount"], 1)
        self.assertIn("이메일", result["skippedReasons"][0])

    def test_overlapping_boxes_are_merged_before_masking(self) -> None:
        analysis = {
            "id": "analysis-test-merge",
            "sourceType": "upload",
            "detections": [
                {
                    "type": "PHONE",
                    "label": "전화번호",
                    "evidence": "010-1234-5678",
                    "box": {"x": 0.10, "y": 0.10, "width": 0.16, "height": 0.05},
                    "coordinateSpace": "normalized",
                    "boxStatus": "exact",
                },
                {
                    "type": "PHONE",
                    "label": "전화번호",
                    "evidence": "010-1234-5678",
                    "box": {"x": 0.22, "y": 0.105, "width": 0.16, "height": 0.05},
                    "coordinateSpace": "normalized",
                    "boxStatus": "exact",
                },
            ],
        }

        result = create_masked_image(analysis)

        self.assertEqual(result["rawMaskableCount"], 2)
        self.assertEqual(result["maskedCount"], 1)
        self.assertEqual(result["mergedCount"], 1)


if __name__ == "__main__":
    unittest.main()

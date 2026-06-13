import unittest

from app.services.ai.result_normalizer import ResultNormalizer


class ResultNormalizerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.normalizer = ResultNormalizer()

    def test_pixel_box_is_preserved_with_declared_coordinate_space(self) -> None:
        result = self.normalizer.normalize(
            {
                "detections": [{
                    "type": "EMAIL",
                    "box": {"x": 100, "y": 50, "width": 200, "height": 40},
                    "coordinateSpace": "pixel",
                }],
                "scenarios": [],
                "recommendations": [],
            },
            "assignment",
            source_type="upload",
            provider="openai",
            image_size=(1000, 500),
        )

        detection = result["detections"][0]
        self.assertEqual(detection["coordinateSpace"], "pixel")
        self.assertEqual(detection["box"], {"x": 100.0, "y": 50.0, "width": 200.0, "height": 40.0})

    def test_invalid_box_becomes_none(self) -> None:
        result = self.normalizer.normalize(
            {
                "detections": [{
                    "type": "EMAIL",
                    "box": {"x": 0.1, "y": 0.2, "width": 0, "height": 0.1},
                    "coordinateSpace": "normalized",
                }],
                "scenarios": [],
                "recommendations": [],
            },
            "assignment",
            source_type="upload",
            provider="openai",
            image_size=(1000, 500),
        )

        detection = result["detections"][0]
        self.assertIsNone(detection["box"])
        self.assertEqual(detection["coordinateStatus"], "none")

    def test_upload_mock_never_exposes_default_box(self) -> None:
        result = self.normalizer.normalize(
            None,
            "sns",
            source_type="upload",
            provider="mock",
            image_size=(800, 600),
        )

        self.assertTrue(result["usedDefaultDetections"])
        self.assertTrue(all(item["box"] is None for item in result["detections"]))


if __name__ == "__main__":
    unittest.main()

import io
import unittest

from fastapi.testclient import TestClient
from PIL import Image

from app.core.config import settings
from app.main import app


class ApiIntegrationTests(unittest.TestCase):
    def test_auth_analysis_upload_run_and_lookup_share_the_same_id(self) -> None:
        image = io.BytesIO()
        Image.new("RGB", (640, 480), "white").save(image, format="PNG")
        original_api_key = settings.openai_api_key
        settings.openai_api_key = ""

        try:
            with TestClient(app) as client:
                login = client.post(
                    "/api/auth/login",
                    json={"email": "demo@proofclean.com", "password": "password1234"},
                )
                self.assertEqual(login.status_code, 200)
                headers = {"Authorization": f"Bearer {login.json()['token']}"}

                me = client.get("/api/auth/me", headers=headers)
                self.assertEqual(me.status_code, 200)
                self.assertEqual(me.json()["email"], "demo@proofclean.com")

                created = client.post(
                    "/api/analyses",
                    headers=headers,
                    json={"title": "통합 연동 테스트", "mode": "marketplace"},
                )
                self.assertEqual(created.status_code, 201)
                analysis_id = created.json()["id"]

                uploaded = client.post(
                    f"/api/analyses/{analysis_id}/files",
                    headers=headers,
                    files={"file": ("privacy-check.png", image.getvalue(), "image/png")},
                )
                self.assertEqual(uploaded.status_code, 200)
                self.assertEqual(uploaded.json()["analysisId"], analysis_id)

                analyzed = client.post(f"/api/analyses/{analysis_id}/run", headers=headers)
                self.assertEqual(analyzed.status_code, 200)
                self.assertEqual(analyzed.json()["id"], analysis_id)

                fetched = client.get(f"/api/analyses/{analysis_id}", headers=headers)
                self.assertEqual(fetched.status_code, 200)
                self.assertEqual(fetched.json()["id"], analysis_id)

                self.assertEqual(fetched.json()["provider"], "mock")
                self.assertTrue(fetched.json()["aiFallback"])
                self.assertEqual(fetched.json()["sourceType"], "upload")
                self.assertTrue(all(item["box"] is None for item in fetched.json()["detections"]))

                stale = client.get("/api/analyses/analysis-stale", headers=headers)
                self.assertEqual(stale.status_code, 404)
                self.assertEqual(stale.json()["detail"], "분석 기록을 찾을 수 없습니다.")
        finally:
            settings.openai_api_key = original_api_key


if __name__ == "__main__":
    unittest.main()

import unittest

from fastapi import HTTPException

from app.data.store import store
from app.services.analysis_service import create_analysis, require_analysis


class AnalysisServiceIdentityTests(unittest.TestCase):
    def setUp(self) -> None:
        with store.lock:
            store.analyses.clear()

    def test_created_analysis_is_retrieved_with_same_id(self) -> None:
        created = create_analysis("ID 일관성 테스트", "marketplace", "test-user")

        stored = require_analysis(created["id"], "test-user")

        self.assertEqual(stored["id"], created["id"])
        self.assertIn(created["id"], store.analyses)

    def test_missing_analysis_returns_clear_404(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            require_analysis("analysis-stale", "test-user")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail, "분석 기록을 찾을 수 없습니다.")


if __name__ == "__main__":
    unittest.main()

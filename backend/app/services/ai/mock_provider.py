from app.services.mock_ai_service import generate_analysis


class MockProvider:
    async def analyze(self, file_path: str | None, prompt: str, mode: str) -> dict:
        detections, scenarios, recommendations = generate_analysis(mode)
        return {
            "detections": detections,
            "scenarios": scenarios,
            "recommendations": recommendations,
        }

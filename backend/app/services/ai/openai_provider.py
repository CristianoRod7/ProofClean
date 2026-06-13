import base64
import json
import mimetypes
from pathlib import Path

from app.core.config import settings


class OpenAIProvider:
    async def analyze(self, file_path: str | None, prompt: str, mode: str) -> dict:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is missing")
        if not file_path or not Path(file_path).is_file():
            raise RuntimeError("Uploaded image file is missing")

        try:
            from openai import AsyncOpenAI
        except ImportError as exc:
            raise RuntimeError("openai package is not installed") from exc

        path = Path(file_path)
        mime_type = mimetypes.guess_type(path.name)[0] or "image/png"
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.chat.completions.create(
            model=settings.openai_model,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{encoded}", "detail": "high"}},
                    ],
                }
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("OpenAI returned an empty response")
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            raise RuntimeError("OpenAI response was not valid JSON") from exc

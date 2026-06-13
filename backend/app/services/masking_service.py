from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageDraw, ImageFont, UnidentifiedImageError

from app.core.config import settings
from app.data.store import store


def placeholder_image() -> Image.Image:
    image = Image.new("RGB", (900, 620), "#e8f3f4")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((70, 55, 830, 565), radius=30, fill="#ffffff", outline="#cbd5e1", width=2)
    draw.rounded_rectangle((110, 95, 430, 140), radius=14, fill="#0f172a")
    for index, width in enumerate((610, 520, 655, 470)):
        top = 185 + index * 70
        draw.rounded_rectangle((110, top, 110 + width, top + 34), radius=10, fill="#dbe4ee")
    draw.text((125, 107), "ProofClean sample document", fill="white", font=ImageFont.load_default())
    return image


def open_source_image(analysis: dict) -> Image.Image:
    file_id = analysis.get("fileId")
    file_record = store.files.get(file_id or "")
    if file_record:
        try:
            return Image.open(Path(file_record["path"])).convert("RGB")
        except (UnidentifiedImageError, OSError):
            pass
    return placeholder_image()


def clamp_box(box: dict, image_width: int, image_height: int) -> tuple[int, int, int, int]:
    x1 = max(0, min(image_width - 1, int(box.get("x", 0))))
    y1 = max(0, min(image_height - 1, int(box.get("y", 0))))
    x2 = max(x1 + 1, min(image_width, x1 + int(box.get("width", 1))))
    y2 = max(y1 + 1, min(image_height, y1 + int(box.get("height", 1))))
    return x1, y1, x2, y2


def create_masked_image(analysis: dict) -> dict:
    image = open_source_image(analysis)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for detection in analysis.get("detections", []):
        x1, y1, x2, y2 = clamp_box(detection.get("box", {}), image.width, image.height)
        radius = max(4, min(14, (y2 - y1) // 4))
        draw.rounded_rectangle((x1, y1, x2, y2), radius=radius, fill=(8, 15, 25, 230), outline=(94, 234, 212, 210), width=2)
    masked = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")
    masked_id = f"masked-{uuid4()}"
    filename = f"safe_{analysis['id']}_{masked_id[-8:]}.png"
    path = settings.masked_dir / filename
    masked.save(path, format="PNG", optimize=True)
    record = {
        "maskedId": masked_id,
        "analysisId": analysis["id"],
        "fileName": filename,
        "contentType": "image/png",
        "path": str(path),
        "url": f"/static/masked/{filename}",
    }
    with store.lock:
        store.masked_files[masked_id] = record
    return record

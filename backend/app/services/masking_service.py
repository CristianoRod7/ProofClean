from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageDraw, ImageFilter, ImageFont, UnidentifiedImageError

from app.core.config import settings
from app.data.store import store

REDACTION_FILL = (15, 23, 42, 236)
REDACTION_OUTLINE = (45, 212, 191, 150)
MASK_PADDING = 5
MASK_MIN_WIDTH = 32
MASK_MIN_HEIGHT = 14
MERGE_IOU_THRESHOLD = 0.15
MERGE_GAP_PX = 16
MAX_AREA_RATIO = 0.45
SUPPORTED_MASKING_STYLES = {"pixelate", "blur", "fill", "solid"}


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


def clamp_box(box: dict, image_width: int, image_height: int, coordinate_space: str) -> tuple[int, int, int, int]:
    if coordinate_space == "normalized":
        box = {
            "x": float(box.get("x", 0)) * image_width,
            "y": float(box.get("y", 0)) * image_height,
            "width": float(box.get("width", 0)) * image_width,
            "height": float(box.get("height", 0)) * image_height,
        }
    x1 = max(0, min(image_width - 1, int(box.get("x", 0))))
    y1 = max(0, min(image_height - 1, int(box.get("y", 0))))
    x2 = max(x1 + 1, min(image_width, x1 + int(box.get("width", 1))))
    y2 = max(y1 + 1, min(image_height, y1 + int(box.get("height", 1))))
    return x1, y1, x2, y2


def expand_box(box: tuple[int, int, int, int], image_width: int, image_height: int, padding: int = MASK_PADDING) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = box
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2
    width = max(MASK_MIN_WIDTH, (x2 - x1) + padding * 2)
    height = max(MASK_MIN_HEIGHT, (y2 - y1) + padding * 2)
    next_x1 = max(0, round(cx - width / 2))
    next_y1 = max(0, round(cy - height / 2))
    next_x2 = min(image_width, round(cx + width / 2))
    next_y2 = min(image_height, round(cy + height / 2))
    if next_x2 - next_x1 < min(MASK_MIN_WIDTH, image_width):
        next_x2 = min(image_width, next_x1 + min(MASK_MIN_WIDTH, image_width))
        next_x1 = max(0, next_x2 - min(MASK_MIN_WIDTH, image_width))
    if next_y2 - next_y1 < min(MASK_MIN_HEIGHT, image_height):
        next_y2 = min(image_height, next_y1 + min(MASK_MIN_HEIGHT, image_height))
        next_y1 = max(0, next_y2 - min(MASK_MIN_HEIGHT, image_height))
    return next_x1, next_y1, max(next_x1 + 1, next_x2), max(next_y1 + 1, next_y2)


def box_iou(first: tuple[int, int, int, int], second: tuple[int, int, int, int]) -> float:
    left = max(first[0], second[0])
    top = max(first[1], second[1])
    right = min(first[2], second[2])
    bottom = min(first[3], second[3])
    intersection = max(0, right - left) * max(0, bottom - top)
    if not intersection:
        return 0.0
    first_area = (first[2] - first[0]) * (first[3] - first[1])
    second_area = (second[2] - second[0]) * (second[3] - second[1])
    return intersection / max(1, first_area + second_area - intersection)


def box_gap(first: tuple[int, int, int, int], second: tuple[int, int, int, int]) -> float:
    horizontal = max(second[0] - first[2], first[0] - second[2], 0)
    vertical = max(second[1] - first[3], first[1] - second[3], 0)
    return (horizontal ** 2 + vertical ** 2) ** 0.5


def should_merge(first: dict, second: dict) -> bool:
    same_identity = first["type"] == second["type"] or (
        first["evidence"] and first["evidence"] == second["evidence"]
    )
    if not same_identity:
        return False
    return box_iou(first["box"], second["box"]) > MERGE_IOU_THRESHOLD or box_gap(first["box"], second["box"]) <= MERGE_GAP_PX


def union_box(first: tuple[int, int, int, int], second: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    return min(first[0], second[0]), min(first[1], second[1]), max(first[2], second[2]), max(first[3], second[3])


def collect_mask_boxes(analysis: dict, image_width: int, image_height: int) -> tuple[list[dict], list[str]]:
    source_type = analysis.get("sourceType")
    ai_fallback = bool(analysis.get("aiFallback"))
    boxes: list[dict] = []
    skipped_reasons: list[str] = []

    for detection in analysis.get("detections", []):
        label = detection.get("label") or detection.get("type") or "탐지"
        box_status = detection.get("boxStatus", detection.get("coordinateStatus"))
        box = detection.get("box")
        if not isinstance(box, dict) or box_status in {"none"}:
            skipped_reasons.append(f"좌표가 없어 {label} 항목은 자동 마스킹을 건너뛰었습니다.")
            continue
        if source_type == "upload" and (box_status == "demo" or (ai_fallback and detection.get("coordinateSource") == "mock")):
            skipped_reasons.append(f"데모 좌표인 {label} 항목은 실제 업로드 이미지 자동 마스킹에서 제외했습니다.")
            continue
        if source_type == "upload" and box_status == "ai-estimated":
            skipped_reasons.append(f"AI 추정 좌표인 {label} 항목은 OCR 확인 전 자동 마스킹에서 제외했습니다.")
            continue
        raw_box = clamp_box(box, image_width, image_height, detection.get("coordinateSpace", "pixel"))
        expanded = expand_box(raw_box, image_width, image_height)
        area_ratio = ((expanded[2] - expanded[0]) * (expanded[3] - expanded[1])) / max(1, image_width * image_height)
        if source_type != "sample" and area_ratio > MAX_AREA_RATIO:
            skipped_reasons.append(f"{label} 항목의 좌표가 이미지의 45% 이상을 덮어 자동 마스킹에서 제외했습니다.")
            continue
        boxes.append({
            "box": expanded,
            "type": str(detection.get("type") or "TEXT"),
            "evidence": str(detection.get("evidence") or "").strip(),
            "labels": {label},
        })
    return boxes, skipped_reasons


def merge_mask_boxes(mask_boxes: list[dict], image_width: int, image_height: int) -> list[dict]:
    merged: list[dict] = []
    for candidate in mask_boxes:
        current = candidate.copy()
        changed = True
        while changed:
            changed = False
            for index, existing in enumerate(merged):
                if should_merge(existing, current):
                    current["box"] = expand_box(union_box(existing["box"], current["box"]), image_width, image_height, padding=0)
                    current["labels"] = set(existing.get("labels", set())) | set(current.get("labels", set()))
                    current["evidence"] = current["evidence"] or existing.get("evidence", "")
                    del merged[index]
                    changed = True
                    break
        merged.append(current)
    return merged


def normalized_masking_style(style: str | None = None) -> str:
    selected = str(style or settings.masking_style or "pixelate").strip().lower()
    return selected if selected in SUPPORTED_MASKING_STYLES else "pixelate"


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def pixelate_region(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = box
    width = max(1, x2 - x1)
    height = max(1, y2 - y1)
    region = image.crop(box)
    block_size = 14
    small_size = (max(1, width // block_size), max(1, height // block_size))
    small = region.resize(small_size, Image.Resampling.BILINEAR)
    pixelated = small.resize((width, height), Image.Resampling.NEAREST)
    image.paste(pixelated, (x1, y1), rounded_mask((width, height), max(6, min(14, height // 3))))


def blur_region(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = box
    width = max(1, x2 - x1)
    height = max(1, y2 - y1)
    radius = max(12, min(20, min(width, height) // 2))
    blurred = image.crop(box).filter(ImageFilter.GaussianBlur(radius=radius))
    image.paste(blurred, (x1, y1), rounded_mask((width, height), max(6, min(14, height // 3))))


def draw_fill_redaction(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = box
    radius = max(8, min(16, (y2 - y1) // 3))
    draw.rounded_rectangle((x1, y1, x2, y2), radius=radius, fill=(248, 250, 252, 238), outline=(20, 184, 166, 150), width=1)
    if x2 - x1 >= 54 and y2 - y1 >= 22:
        draw.text((x1 + 10, y1 + max(5, (y2 - y1 - 10) // 2)), "숨김", fill=(15, 118, 110, 230), font=ImageFont.load_default())


def draw_solid_redaction(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = box
    radius = max(8, min(16, (y2 - y1) // 3))
    shadow = (x1 + 2, y1 + 3, x2 + 2, y2 + 3)
    draw.rounded_rectangle(shadow, radius=radius, fill=(15, 23, 42, 42))
    draw.rounded_rectangle((x1, y1, x2, y2), radius=radius, fill=REDACTION_FILL, outline=REDACTION_OUTLINE, width=1)
    if x2 - x1 >= 96 and y2 - y1 >= 28:
        draw.text((x1 + 12, y1 + max(6, (y2 - y1 - 10) // 2)), "PROTECTED", fill=(203, 213, 225, 210), font=ImageFont.load_default())


def apply_mask(image: Image.Image, draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], masking_style: str) -> None:
    if masking_style == "pixelate":
        pixelate_region(image, box)
    elif masking_style == "blur":
        blur_region(image, box)
    elif masking_style == "fill":
        draw_fill_redaction(draw, box)
    else:
        draw_solid_redaction(draw, box)


def create_masked_image(analysis: dict, masking_style: str | None = None) -> dict:
    style = normalized_masking_style(masking_style)
    image = open_source_image(analysis).convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")
    mask_boxes, skipped_reasons = collect_mask_boxes(analysis, image.width, image.height)
    if not mask_boxes:
        raise ValueError("정확한 위치 좌표가 없어 자동 마스킹을 건너뛰었습니다. 탐지 후보를 직접 확인해 주세요.")

    merged_boxes = merge_mask_boxes(mask_boxes, image.width, image.height)
    for item in merged_boxes:
        apply_mask(image, draw, item["box"], style)

    masked = image.convert("RGB")
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
        "maskedCount": len(merged_boxes),
        "rawMaskableCount": len(mask_boxes),
        "skippedCount": len(skipped_reasons),
        "mergedCount": max(0, len(mask_boxes) - len(merged_boxes)),
        "maskingStyle": style,
        "skippedReasons": skipped_reasons,
    }
    with store.lock:
        store.masked_files[masked_id] = record
    return record

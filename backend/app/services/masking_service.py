from uuid import uuid4

from fastapi import HTTPException
from PIL import Image, ImageDraw
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.analysis import AnalysisProject
from app.models.file import MaskedFile, UploadedFile
from app.utils.image_utils import normalized_to_pixels


def create_masked_file(db: Session, analysis: AnalysisProject, source_file: UploadedFile) -> MaskedFile:
    if source_file.file_type != "IMAGE":
        raise HTTPException(status_code=400, detail="PDF 마스킹은 2차 기능으로 준비 중입니다. MVP에서는 이미지 파일만 지원합니다.")

    source_path = source_file.file_path
    settings.UPLOAD_MASKED_DIR.mkdir(parents=True, exist_ok=True)
    output_name = f"masked-{uuid4()}.png"
    output_path = settings.UPLOAD_MASKED_DIR / output_name

    try:
        with Image.open(source_path).convert("RGBA") as image:
            overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            for finding in analysis.findings:
                box = normalized_to_pixels(finding.x, finding.y, finding.width, finding.height, image.width, image.height)
                draw.rounded_rectangle(box, radius=12, fill=(15, 23, 42, 220))
            masked = Image.alpha_composite(image, overlay).convert("RGB")
            masked.save(output_path, format="PNG")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"안전본 생성에 실패했습니다: {exc}") from exc

    masked_file = MaskedFile(
        analysis_project_id=analysis.id,
        source_file_id=source_file.id,
        masked_file_name=output_name,
        masked_file_path=str(output_path),
    )
    db.add(masked_file)
    db.commit()
    db.refresh(masked_file)
    return masked_file

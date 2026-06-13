from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    fileId: str
    analysisId: str
    fileName: str
    contentType: str
    size: int
    previewUrl: str
    sourceType: str


class MaskResponse(BaseModel):
    analysisId: str
    maskedImageUrl: str
    safeImageUrl: str
    maskedCount: int = 0
    skippedCount: int = 0
    skippedReasons: list[str] = Field(default_factory=list)

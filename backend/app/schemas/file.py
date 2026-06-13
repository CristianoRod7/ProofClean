from pydantic import BaseModel


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

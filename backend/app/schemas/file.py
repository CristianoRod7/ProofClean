from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    fileId: int
    originalFileName: str
    fileUrl: str


class MaskedFileCreateResponse(BaseModel):
    maskedFileId: int
    previewUrl: str
    downloadUrl: str

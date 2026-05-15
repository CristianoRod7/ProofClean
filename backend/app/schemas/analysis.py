from datetime import datetime
from pydantic import BaseModel, Field


class AnalysisCreateRequest(BaseModel):
    title: str = Field(min_length=1)
    purpose: str = "ETC"


class AnalysisResponse(BaseModel):
    id: int
    title: str
    purpose: str
    status: str
    riskScore: int
    createdAt: datetime | None = None


class DetectionResponse(BaseModel):
    id: int
    detectionType: str
    label: str
    description: str
    confidence: float
    severity: str
    x: float | None = None
    y: float | None = None
    width: float | None = None
    height: float | None = None
    extractedText: str | None = None


class RiskScenarioResponse(BaseModel):
    id: int
    title: str
    scenarioText: str
    riskLevel: str


class RecommendationResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: int
    completed: bool


class UploadedFileResponse(BaseModel):
    id: int
    fileId: int
    originalFileName: str
    fileUrl: str
    width: int | None = None
    height: int | None = None


class MaskedFileResponse(BaseModel):
    id: int
    maskedFileId: int
    previewUrl: str
    downloadUrl: str


class AnalysisDetailResponse(BaseModel):
    id: int
    title: str
    purpose: str
    status: str
    riskScore: int
    summary: str | None = None
    createdAt: datetime | None = None
    files: list[UploadedFileResponse]
    findings: list[DetectionResponse]
    scenarios: list[RiskScenarioResponse]
    recommendations: list[RecommendationResponse]
    maskedFiles: list[MaskedFileResponse]


class AnalysisRunResponse(BaseModel):
    analysisId: int
    riskScore: int
    status: str
    findingCount: int

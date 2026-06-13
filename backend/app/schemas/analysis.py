from pydantic import BaseModel, Field


class AnalysisCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    mode: str = "other"


class Box(BaseModel):
    x: float
    y: float
    width: float
    height: float


class Detection(BaseModel):
    id: str
    type: str
    label: str
    confidence: float
    severity: str
    description: str
    evidence: str | None = None
    box: Box | None = None
    coordinateSpace: str = "none"
    coordinateStatus: str = "none"
    coordinateSource: str = "none"
    imageWidth: int | None = None
    imageHeight: int | None = None


class Scenario(BaseModel):
    id: str
    title: str
    level: str
    description: str


class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    completed: bool = False


class AnalysisResponse(BaseModel):
    id: str
    title: str
    mode: str
    status: str
    riskScore: int | None = None
    riskLevel: str | None = None
    detections: list[Detection] = Field(default_factory=list)
    scenarios: list[Scenario] = Field(default_factory=list)
    recommendations: list[Recommendation] = Field(default_factory=list)
    originalImageUrl: str | None = None
    maskedImageUrl: str | None = None
    fileName: str | None = None
    imageWidth: int | None = None
    imageHeight: int | None = None
    sourceType: str = "sample"
    isSample: bool = True
    provider: str | None = None
    aiFallback: bool = False
    fallbackReason: str | None = None
    createdAt: str
    updatedAt: str


class SampleResponse(BaseModel):
    analysisId: str
    sourceType: str
    previewUrl: str

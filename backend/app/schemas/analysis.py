from typing import Any

from pydantic import BaseModel, Field


class AnalysisCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    mode: str = "other"


class Box(BaseModel):
    x: int
    y: int
    width: int
    height: int


class Detection(BaseModel):
    id: str
    type: str
    label: str
    confidence: float
    severity: str
    description: str
    box: Box


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
    detections: list[dict[str, Any]] = Field(default_factory=list)
    scenarios: list[dict[str, Any]] = Field(default_factory=list)
    recommendations: list[dict[str, Any]] = Field(default_factory=list)
    originalImageUrl: str | None = None
    maskedImageUrl: str | None = None
    fileName: str | None = None
    createdAt: str
    updatedAt: str

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


class AnalysisProject(Base):
    __tablename__ = "analysis_projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    purpose = Column(String, nullable=False, default="ETC")
    status = Column(String, nullable=False, default="CREATED")
    risk_score = Column(Integer, nullable=False, default=0)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    files = relationship("UploadedFile", back_populates="analysis_project", cascade="all, delete-orphan")
    findings = relationship("DetectionFinding", back_populates="analysis_project", cascade="all, delete-orphan")
    scenarios = relationship("RiskScenario", back_populates="analysis_project", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="analysis_project", cascade="all, delete-orphan")
    masked_files = relationship("MaskedFile", back_populates="analysis_project", cascade="all, delete-orphan")
    logs = relationship("AnalysisLog", back_populates="analysis_project", cascade="all, delete-orphan")


class DetectionFinding(Base):
    __tablename__ = "detection_findings"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    uploaded_file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=True)
    detection_type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False, default=0.0)
    severity = Column(String, nullable=False, default="LOW")
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis_project = relationship("AnalysisProject", back_populates="findings")
    uploaded_file = relationship("UploadedFile", back_populates="findings")


class RiskScenario(Base):
    __tablename__ = "risk_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    title = Column(String, nullable=False)
    scenario_text = Column(Text, nullable=False)
    risk_level = Column(String, nullable=False, default="LOW")
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis_project = relationship("AnalysisProject", back_populates="scenarios")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(Integer, nullable=False, default=1)
    completed = Column(Boolean, nullable=False, default=False)

    analysis_project = relationship("AnalysisProject", back_populates="recommendations")


class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    message = Column(Text, nullable=False)
    log_type = Column(String, nullable=False, default="INFO")
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis_project = relationship("AnalysisProject", back_populates="logs")

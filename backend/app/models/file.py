from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    original_file_name = Column(String, nullable=False)
    stored_file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False, default=0)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    analysis_project = relationship("AnalysisProject", back_populates="files")
    findings = relationship("DetectionFinding", back_populates="uploaded_file")
    masked_files = relationship("MaskedFile", back_populates="source_file")


class MaskedFile(Base):
    __tablename__ = "masked_files"

    id = Column(Integer, primary_key=True, index=True)
    analysis_project_id = Column(Integer, ForeignKey("analysis_projects.id"), nullable=False)
    source_file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=True)
    masked_file_name = Column(String, nullable=False)
    masked_file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis_project = relationship("AnalysisProject", back_populates="masked_files")
    source_file = relationship("UploadedFile", back_populates="masked_files")

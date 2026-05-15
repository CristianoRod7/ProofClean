from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="USER")
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("AnalysisProject", back_populates="user")

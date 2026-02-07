from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="local")
    profile_image = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reset_token = Column(String(255), nullable=True, index=True)
    token_expiry = Column(DateTime(timezone=True), nullable=True)

    # 🔗 One user → many documents
    documents = relationship(
        "ClinicalDocument",
        back_populates="user",
        cascade="all, delete"
    )


class ClinicalDocument(Base):
    __tablename__ = "clinical_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    extracted_text = Column(Text)
    entities = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 🔗 Document belongs to one user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="documents")

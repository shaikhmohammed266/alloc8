from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    admin = "admin"; citizen = "citizen"; volunteer = "volunteer"

class SeverityEnum(str, enum.Enum):
    high = "high"; medium = "medium"; low = "low"

class StatusEnum(str, enum.Enum):
    pending = "pending"; active = "active"; resolved = "resolved"; rejected = "rejected"

class User(Base):
    __tablename__ = "users"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    username   = Column(String(50), unique=True, index=True)
    email      = Column(String(120), unique=True, index=True, nullable=False)
    password   = Column(String(256), nullable=False)
    role       = Column(Enum(RoleEnum), default=RoleEnum.citizen)
    location   = Column(String(200))
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reports    = relationship("DisasterReport", back_populates="reporter")
    tasks      = relationship("Task", back_populates="volunteer")

class DisasterReport(Base):
    __tablename__ = "disaster_reports"
    id            = Column(Integer, primary_key=True, index=True)
    disaster_type = Column(String(50), nullable=False)
    severity      = Column(Enum(SeverityEnum), nullable=False)
    status        = Column(Enum(StatusEnum), default=StatusEnum.pending)
    title         = Column(String(200))
    description   = Column(Text)
    location      = Column(String(200))
    latitude      = Column(Float)
    longitude     = Column(Float)
    image_path    = Column(String(500))
    ai_prediction = Column(String(100))
    ai_confidence = Column(Float)
    reporter_id   = Column(Integer, ForeignKey("users.id"))
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    reporter      = relationship("User", back_populates="reports")
    resources     = relationship("ResourceAllocation", back_populates="disaster")
    tasks         = relationship("Task", back_populates="disaster")

class ResourceAllocation(Base):
    __tablename__ = "resource_allocations"
    id                = Column(Integer, primary_key=True, index=True)
    disaster_id       = Column(Integer, ForeignKey("disaster_reports.id"))
    food_kits         = Column(Integer, default=0)
    medical_kits      = Column(Integer, default=0)
    shelters          = Column(Integer, default=0)
    water_units       = Column(Integer, default=0)
    volunteers_needed = Column(Integer, default=0)
    allocated_at      = Column(DateTime(timezone=True), server_default=func.now())
    disaster          = relationship("DisasterReport", back_populates="resources")

class Task(Base):
    __tablename__ = "tasks"
    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(200), nullable=False)
    description  = Column(Text)
    disaster_id  = Column(Integer, ForeignKey("disaster_reports.id"))
    volunteer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status       = Column(String(20), default="available")
    progress     = Column(Integer, default=0)
    location     = Column(String(200))
    people_count = Column(Integer, default=0)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    disaster     = relationship("DisasterReport", back_populates="tasks")
    volunteer    = relationship("User", back_populates="tasks")

from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, timezone
import uuid

Base = declarative_base()

def get_utc_now():
    return datetime.now(timezone.utc)

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_code = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    room = Column(String)
    symptoms = Column(String)
    vitals = Column(JSON)
    esi_level = Column(Integer)
    triage_category = Column(String)
    triage_color = Column(String)
    diagnosis = Column(String)
    ai_confidence = Column(Float)
    status = Column(String, default="active")
    execution_mode = Column(String)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
    
    triage_results = relationship("TriageResult", back_populates="patient", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="patient", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="patient", cascade="all, delete-orphan")

class TriageResult(Base):
    __tablename__ = "triage_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"))
    symptoms = Column(String)
    vitals = Column(JSON)
    ai_result = Column(JSON)
    model_used = Column(String)
    confidence = Column(Float)
    created_at = Column(DateTime, default=get_utc_now)
    
    patient = relationship("Patient", back_populates="triage_results")

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"))
    file_type = Column(String)
    file_name = Column(String)
    file_url_or_reference = Column(String)
    analysis = Column(JSON)
    created_at = Column(DateTime, default=get_utc_now)
    
    patient = relationship("Patient", back_populates="evidence")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"))
    action = Column(String)
    model_used = Column(String)
    decision = Column(JSON)
    metadata_info = Column(JSON)
    created_at = Column(DateTime, default=get_utc_now)
    
    patient = relationship("Patient", back_populates="audit_logs")

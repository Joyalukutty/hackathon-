from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any

class DifferentialDiagnosisItem(BaseModel):
    condition: str
    probability: str

class CitationItem(BaseModel):
    source: str
    section: str
    relevance: float

class TriageResponseSchema(BaseModel):
    patient_id: str
    esi_level: int
    triage_category: str
    triage_color: str
    confidence_score: float
    extracted_symptoms: List[str]
    image_ocr_findings: Optional[str] = "No image findings"
    differential_diagnosis: List[DifferentialDiagnosisItem]
    clinical_reasoning_trace: List[str]
    counterfactual_analysis: Optional[str] = ""
    evidence: Optional[List[CitationItem]] = []
    execution_mode: Optional[str] = None

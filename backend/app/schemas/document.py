from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ExtractedAttribute(BaseModel):
    attribute: str
    detected_value: str
    confidence: float

class ComplianceCheckItem(BaseModel):
    aspect: str
    requirement: str
    status: str = "Conforming"  # "Conforming", "Missing/Non-Compliant", "Verification Needed"
    clause_ref: Optional[str] = None
    observation: str

class DocumentAnalysisResponse(BaseModel):
    document_name: str
    file_type: str
    extracted_text_snippet: str
    detected_product: str
    detected_attributes: List[ExtractedAttribute] = []
    applicable_standard: Optional[str] = None
    mandatory_qco_alert: Optional[str] = None
    compliance_checklist: List[ComplianceCheckItem] = []
    gap_analysis: List[str] = []
    recommendation: str

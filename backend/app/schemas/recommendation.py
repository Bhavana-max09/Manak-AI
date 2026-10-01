from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ProductSpecRequest(BaseModel):
    product_name: str = Field(..., min_length=2)
    material: Optional[str] = None
    power_wattage: Optional[str] = None
    voltage: Optional[str] = None
    intended_use: Optional[str] = Field("Household", description="'Household', 'Commercial', 'Industrial', 'Children', etc.")
    capacity: Optional[str] = None
    additional_notes: Optional[str] = None

class CandidateStandard(BaseModel):
    is_number: str
    code: str
    title: str
    match_score: int = Field(..., description="0-100 percentage")
    why_matched: List[str]
    is_mandatory: bool
    qco_order: Optional[str] = None
    certification_scheme: str
    key_tests: List[str]

class ProductSpecResponse(BaseModel):
    product_identified: str
    spec_summary: Dict[str, Any]
    candidates: List[CandidateStandard]
    mandatory_verdict: str
    recommended_action: str
    estimated_licence_timeline: str
    disclaimer: str

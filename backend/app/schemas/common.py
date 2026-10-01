from typing import Optional, List
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    source_id: str
    source_type: str = Field(..., description="e.g. BIS Know Your Standards, QCO Gazette, LIMS")
    title: str
    document_ref: str = Field(..., description="e.g. S.O. 582(E) or IS 302-2-15")
    section_clause: Optional[str] = None
    url: Optional[str] = None
    last_verified: str = "2026-09-30"
    trust_level: int = 1

class EvidenceSummary(BaseModel):
    strength: str = Field(..., description="HIGH, MEDIUM, or LIMITED")
    sources_count: int
    primary_standard: Optional[str] = None
    is_mandatory: bool = False
    governing_qco: Optional[str] = None
    citations: List[SourceCitation] = []

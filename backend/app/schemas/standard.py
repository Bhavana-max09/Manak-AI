from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ClauseDetail(BaseModel):
    clause: str
    title: str
    requirement: str

class StandardDetail(BaseModel):
    id: str
    is_number: str
    code: str
    title: str
    product: str
    category: str
    scope: str
    status: str
    revision_year: int
    reaffirmation_year: int
    technical_department: str
    committee: str
    scheme: str
    is_mandatory: bool
    qco_reference: Optional[str] = None
    qco_id: Optional[str] = None
    source_url: str
    last_verified_at: str
    clauses: List[ClauseDetail] = []
    required_tests: List[str] = []
    keywords: List[str] = []

class StandardSearchResponse(BaseModel):
    total: int
    standards: List[StandardDetail]

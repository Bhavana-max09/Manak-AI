from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SupportedTestScope(BaseModel):
    is_number: str
    standard_code: str
    product: str
    tests_supported: List[str]
    testing_charge_inr: int
    sample_turnaround_days: int

class LaboratoryDetail(BaseModel):
    id: str
    lab_code: str
    name: str
    lab_type: str
    address: str
    district: str
    state: str
    pincode: str
    contact_person: str
    phone: str
    email: str
    validity_date: str
    accreditation_status: str
    supported_standards: List[SupportedTestScope] = []

class LabSearchResponse(BaseModel):
    total: int
    filter_standard: Optional[str] = None
    filter_state: Optional[str] = None
    laboratories: List[LaboratoryDetail]

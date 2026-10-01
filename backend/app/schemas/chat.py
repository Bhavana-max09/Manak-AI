from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.common import EvidenceSummary, SourceCitation

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant' or 'system'")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=4000)
    language: str = Field("en", description="'en', 'hi', or 'kn'")
    conversation_id: Optional[str] = None
    context_filters: Optional[Dict[str, Any]] = None

class ActionItem(BaseModel):
    label: str
    action_type: str = Field(..., description="'link' or 'navigate' or 'filter'")
    target: str

class ChatResponse(BaseModel):
    answer: str
    language: str = "en"
    intent: str
    product_detected: Optional[str] = None
    applicable_standards: List[Dict[str, Any]] = []
    is_mandatory: bool = False
    evidence: EvidenceSummary
    suggested_actions: List[ActionItem] = []
    disclaimer: str
    is_refusal: bool = False

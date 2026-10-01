import json
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, JSON
from app.db.database import Base

class StandardModel(Base):
    __tablename__ = "standards"

    id = Column(String, primary_key=True, index=True)
    is_number = Column(String, index=True)
    code = Column(String, index=True)
    title = Column(String, index=True)
    product = Column(String, index=True)
    category = Column(String, index=True)
    scope = Column(Text)
    status = Column(String, default="Current")
    revision_year = Column(Integer)
    reaffirmation_year = Column(Integer)
    technical_department = Column(String)
    committee = Column(String)
    scheme = Column(String, default="Scheme I (ISI Mark)")
    is_mandatory = Column(Boolean, default=False)
    qco_reference = Column(String, nullable=True)
    qco_id = Column(String, nullable=True)
    source_url = Column(String)
    last_verified_at = Column(String, default="2026-09-30")
    clauses_json = Column(Text)       # JSON string of clauses
    required_tests_json = Column(Text) # JSON string of test list
    keywords_json = Column(Text)      # JSON string of keywords

    def to_dict(self):
        return {
            "id": self.id,
            "is_number": self.is_number,
            "code": self.code,
            "title": self.title,
            "product": self.product,
            "category": self.category,
            "scope": self.scope,
            "status": self.status,
            "revision_year": self.revision_year,
            "reaffirmation_year": self.reaffirmation_year,
            "technical_department": self.technical_department,
            "committee": self.committee,
            "scheme": self.scheme,
            "is_mandatory": self.is_mandatory,
            "qco_reference": self.qco_reference,
            "qco_id": self.qco_id,
            "source_url": self.source_url,
            "last_verified_at": self.last_verified_at,
            "clauses": json.loads(self.clauses_json) if self.clauses_json else [],
            "required_tests": json.loads(self.required_tests_json) if self.required_tests_json else [],
            "keywords": json.loads(self.keywords_json) if self.keywords_json else []
        }

class QCOModel(Base):
    __tablename__ = "qcos"

    id = Column(String, primary_key=True, index=True)
    qco_number = Column(String, index=True)
    title = Column(String)
    ministry = Column(String, index=True)
    product = Column(String, index=True)
    is_number = Column(String, index=True)
    applicable_standard_code = Column(String)
    scheme = Column(String)
    notification_date = Column(String)
    enforcement_date = Column(String)
    status = Column(String, default="In Force")
    exemption_policy = Column(Text)
    penalty_clause = Column(Text)
    source_url = Column(String)

    def to_dict(self):
        return {
            "id": self.id,
            "qco_number": self.qco_number,
            "title": self.title,
            "ministry": self.ministry,
            "product": self.product,
            "is_number": self.is_number,
            "applicable_standard_code": self.applicable_standard_code,
            "scheme": self.scheme,
            "notification_date": self.notification_date,
            "enforcement_date": self.enforcement_date,
            "status": self.status,
            "exemption_policy": self.exemption_policy,
            "penalty_clause": self.penalty_clause,
            "source_url": self.source_url
        }

class SchemeModel(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, index=True)
    name = Column(String)
    mark_name = Column(String)
    description = Column(Text)
    eligibility = Column(Text)
    applicable_categories = Column(Text)
    governing_regulation = Column(String)
    portal_url = Column(String)
    workflow_steps_json = Column(Text)
    documents_required_json = Column(Text)
    fee_structure_json = Column(Text)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "mark_name": self.mark_name,
            "description": self.description,
            "eligibility": self.eligibility,
            "applicable_categories": self.applicable_categories,
            "governing_regulation": self.governing_regulation,
            "portal_url": self.portal_url,
            "workflow_steps": json.loads(self.workflow_steps_json) if self.workflow_steps_json else [],
            "documents_required": json.loads(self.documents_required_json) if self.documents_required_json else [],
            "fee_structure": json.loads(self.fee_structure_json) if self.fee_structure_json else {}
        }

class LabModel(Base):
    __tablename__ = "laboratories"

    id = Column(String, primary_key=True, index=True)
    lab_code = Column(String, index=True)
    name = Column(String, index=True)
    lab_type = Column(String, index=True)
    address = Column(String)
    district = Column(String, index=True)
    state = Column(String, index=True)
    pincode = Column(String)
    contact_person = Column(String)
    phone = Column(String)
    email = Column(String)
    validity_date = Column(String)
    accreditation_status = Column(String)
    supported_standards_json = Column(Text)

    def to_dict(self):
        return {
            "id": self.id,
            "lab_code": self.lab_code,
            "name": self.name,
            "lab_type": self.lab_type,
            "address": self.address,
            "district": self.district,
            "state": self.state,
            "pincode": self.pincode,
            "contact_person": self.contact_person,
            "phone": self.phone,
            "email": self.email,
            "validity_date": self.validity_date,
            "accreditation_status": self.accreditation_status,
            "supported_standards": json.loads(self.supported_standards_json) if self.supported_standards_json else []
        }

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, index=True)
    user_query = Column(Text)
    detected_intent = Column(String)
    matched_standard = Column(String, nullable=True)
    response_summary = Column(Text)
    evidence_strength = Column(String)
    timestamp_iso = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "user_query": self.user_query,
            "detected_intent": self.detected_intent,
            "matched_standard": self.matched_standard,
            "response_summary": self.response_summary,
            "evidence_strength": self.evidence_strength,
            "timestamp_iso": self.timestamp_iso
        }

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.db.models import SchemeModel, StandardModel, QCOModel

class CertificationService:
    def __init__(self, db: Session):
        self.db = db

    def get_certification_roadmap(self, product_or_standard: Optional[str] = None) -> Dict[str, Any]:
        schemes = self.db.query(SchemeModel).all()
        schemes_data = [s.to_dict() for s in schemes]

        std_info = None
        if product_or_standard:
            std = self.db.query(StandardModel).filter(
                (StandardModel.product.ilike(f"%{product_or_standard}%")) |
                (StandardModel.code.ilike(f"%{product_or_standard}%")) |
                (StandardModel.is_number.ilike(f"%{product_or_standard}%"))
            ).first()
            if std:
                std_info = std.to_dict()

        return {
            "selected_product": product_or_standard or "General Product",
            "matched_standard": std_info["is_number"] if std_info else "IS Applicable Code",
            "schemes_available": schemes_data,
            "primary_scheme": schemes_data[0] if schemes_data else None,
            "required_tests": std_info.get("required_tests", []) if std_info else [],
            "official_portal": "https://www.manakonline.in",
            "application_checklist": [
                "1. Confirm compliance with the Indian Standard specification",
                "2. Establish mandatory testing lab in factory as per Scheme of Inspection & Testing (SIT)",
                "3. Prepare factory layout, list of manufacturing machines & calibration certificates",
                "4. Submit online application on Manakonline with ₹1,000 application fee",
                "5. Facilitate on-site factory verification by BIS officer and sample drawing",
                "6. Independent testing of sample in BIS recognized lab",
                "7. Grant of Certification Marks Licence (CM/L) and ISI Mark authorization"
            ]
        }

from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import LabModel
from app.schemas.laboratory import LaboratoryDetail, LabSearchResponse, SupportedTestScope

class LaboratoryService:
    def __init__(self, db: Session):
        self.db = db

    def search_laboratories(
        self,
        is_number: Optional[str] = None,
        state: Optional[str] = None,
        lab_type: Optional[str] = None
    ) -> LabSearchResponse:
        query = self.db.query(LabModel)

        if state and state.lower() != "all":
            query = query.filter(LabModel.state.ilike(f"%{state.strip()}%"))

        if lab_type and lab_type.lower() != "all":
            query = query.filter(LabModel.lab_type.ilike(f"%{lab_type.strip()}%"))

        labs = query.all()
        matched_labs: List[LaboratoryDetail] = []

        is_filter_clean = is_number.replace("IS", "").strip().lower() if is_number else None

        for lab in labs:
            lab_dict = lab.to_dict()
            supported = lab_dict.get("supported_standards", [])

            if is_filter_clean:
                # Filter lab's supported tests to those matching the IS filter
                matching_scopes = []
                for sup in supported:
                    sup_code = sup.get("standard_code", "").lower()
                    sup_is = sup.get("is_number", "").lower()
                    if is_filter_clean in sup_code or is_filter_clean in sup_is:
                        matching_scopes.append(SupportedTestScope(**sup))

                if matching_scopes:
                    lab_dict["supported_standards"] = matching_scopes
                    matched_labs.append(LaboratoryDetail(**lab_dict))
            else:
                scopes = [SupportedTestScope(**s) for s in supported]
                lab_dict["supported_standards"] = scopes
                matched_labs.append(LaboratoryDetail(**lab_dict))

        return LabSearchResponse(
            total=len(matched_labs),
            filter_standard=is_number,
            filter_state=state,
            laboratories=matched_labs
        )

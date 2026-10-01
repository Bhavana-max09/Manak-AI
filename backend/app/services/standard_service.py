from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models import StandardModel, QCOModel
from app.schemas.standard import StandardDetail, StandardSearchResponse

class StandardService:
    def __init__(self, db: Session):
        self.db = db

    def search_standards(
        self,
        q: Optional[str] = None,
        category: Optional[str] = None,
        mandatory_only: bool = False
    ) -> StandardSearchResponse:
        query = self.db.query(StandardModel)

        if mandatory_only:
            query = query.filter(StandardModel.is_mandatory == True)

        if category and category.lower() != "all":
            query = query.filter(StandardModel.category.ilike(f"%{category}%"))

        if q:
            term = f"%{q.strip()}%"
            query = query.filter(
                or_(
                    StandardModel.is_number.ilike(term),
                    StandardModel.code.ilike(term),
                    StandardModel.title.ilike(term),
                    StandardModel.product.ilike(term),
                    StandardModel.keywords_json.ilike(term)
                )
            )

        results = query.all()
        standards_list = [StandardDetail(**s.to_dict()) for s in results]

        return StandardSearchResponse(
            total=len(standards_list),
            standards=standards_list
        )

    def get_standard_by_id(self, std_id: str) -> Optional[StandardDetail]:
        std = self.db.query(StandardModel).filter(
            or_(
                StandardModel.id == std_id,
                StandardModel.code.ilike(std_id),
                StandardModel.is_number.ilike(f"%{std_id}%")
            )
        ).first()

        if not std:
            return None
        return StandardDetail(**std.to_dict())

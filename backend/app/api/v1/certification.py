from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.certification_service import CertificationService

router = APIRouter(prefix="/certification", tags=["Certification Schemes"])

@router.get("/roadmap")
def get_certification_roadmap(
    product: Optional[str] = Query(None, description="Product name or IS number"),
    db: Session = Depends(get_db)
):
    service = CertificationService(db)
    return service.get_certification_roadmap(product)

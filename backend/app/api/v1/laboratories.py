from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.laboratory import LabSearchResponse
from app.services.laboratory_service import LaboratoryService

router = APIRouter(prefix="/laboratories", tags=["BIS LIMS Laboratories"])

@router.get("", response_model=LabSearchResponse)
def search_laboratories(
    is_number: Optional[str] = Query(None, description="Filter by Indian Standard (e.g., IS 302-2-15 or 14543)"),
    state: Optional[str] = Query("all", description="State filter (e.g. Karnataka, Delhi, Maharashtra, Tamil Nadu)"),
    lab_type: Optional[str] = Query("all", description="Lab type filter"),
    db: Session = Depends(get_db)
):
    service = LaboratoryService(db)
    return service.search_laboratories(is_number=is_number, state=state, lab_type=lab_type)

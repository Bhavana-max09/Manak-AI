from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["System Analytics & Traceability"])

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_system_metrics()

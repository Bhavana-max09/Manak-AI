from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db
from app.core.config import settings

router = APIRouter(tags=["Health & Diagnostics"])

@router.get("/health/live")
def liveness_probe():
    return {"status": "live", "service": "MANAK AI Backend"}

@router.get("/health/ready")
def readiness_probe(db: Session = Depends(get_db)):
    db_status = "ok"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ready" if db_status == "ok" else "degraded",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }

@router.get("/health/version")
def version_probe():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "target": "SIH26107 - Department of Consumer Affairs / BIS"
    }

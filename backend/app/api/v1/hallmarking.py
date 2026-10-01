from fastapi import APIRouter, Query
from app.services.hallmarking_service import HallmarkingService

router = APIRouter(prefix="/hallmarking", tags=["Hallmarking & HUID"])

@router.get("/overview")
def get_hallmarking_overview():
    return HallmarkingService.get_hallmarking_overview()

@router.get("/verify-huid")
def verify_huid(huid: str = Query(..., min_length=4, max_length=10, description="6-character alphanumeric HUID")):
    return HallmarkingService.verify_huid(huid)

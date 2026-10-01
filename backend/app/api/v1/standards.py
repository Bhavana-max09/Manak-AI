from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.standard import StandardSearchResponse, StandardDetail
from app.services.standard_service import StandardService

router = APIRouter(prefix="/standards", tags=["Indian Standards"])

@router.get("/search", response_model=StandardSearchResponse)
def search_standards(
    q: Optional[str] = Query(None, description="Keyword, IS number, or product name"),
    category: Optional[str] = Query("all", description="Product category filter"),
    mandatory_only: bool = Query(False, description="Filter only standards under mandatory QCO"),
    db: Session = Depends(get_db)
):
    service = StandardService(db)
    return service.search_standards(q=q, category=category, mandatory_only=mandatory_only)

@router.get("/{id}", response_model=StandardDetail)
def get_standard_details(id: str, db: Session = Depends(get_db)):
    service = StandardService(db)
    std = service.get_standard_by_id(id)
    if not std:
        raise HTTPException(status_code=404, detail=f"Standard '{id}' not found")
    return std

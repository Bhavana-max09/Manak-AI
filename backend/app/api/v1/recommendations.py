from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.recommendation import ProductSpecRequest, ProductSpecResponse
from app.ai.recommendation.product_matcher import ProductStandardMatcher

router = APIRouter(prefix="/standards", tags=["Recommendations"])

@router.post("/recommend", response_model=ProductSpecResponse)
def recommend_standards(spec: ProductSpecRequest, db: Session = Depends(get_db)):
    matcher = ProductStandardMatcher(db)
    return matcher.match_product(spec)

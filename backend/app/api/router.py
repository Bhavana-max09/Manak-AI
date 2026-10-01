from fastapi import APIRouter
from app.api.v1.chat import router as chat_router
from app.api.v1.standards import router as standards_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.certification import router as certification_router
from app.api.v1.laboratories import router as laboratories_router
from app.api.v1.hallmarking import router as hallmarking_router
from app.api.v1.documents import router as documents_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.health import router as health_router

api_router = APIRouter()

# Register sub-routers
api_router.include_router(chat_router)
api_router.include_router(standards_router)
api_router.include_router(recommendations_router)
api_router.include_router(certification_router)
api_router.include_router(laboratories_router)
api_router.include_router(hallmarking_router)
api_router.include_router(documents_router)
api_router.include_router(analytics_router)
api_router.include_router(health_router)

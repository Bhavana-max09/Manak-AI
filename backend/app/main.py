import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.seed_data import seed_database
from app.api.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("manak_ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing MANAK AI Backend...")
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Seed database with structured BIS datasets
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    logger.info("MANAK AI Database initialized and seeded successfully.")
    yield
    logger.info("Shutting down MANAK AI Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Assistant and Decision-Support Platform for Indian Standards (BIS)",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Top-level direct health probes for container orchestrators
from app.api.v1.health import router as root_health
app.include_router(root_health)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR,
        "system_status": "Operational - Authorized BIS Knowledge Synchronized"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

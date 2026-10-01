from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat & RAG"])

@router.post("", response_model=ChatResponse)
def handle_chat_query(req: ChatRequest, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.process_query(req)

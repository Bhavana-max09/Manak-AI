from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.document import DocumentAnalysisResponse
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Document Specification Analysis"])

@router.post("/upload", response_model=DocumentAnalysisResponse)
async def upload_document(
    file: UploadFile = File(...),
):
    if not file.filename.lower().endswith((".pdf", ".txt", ".json", ".md")):
        raise HTTPException(status_code=400, detail="Only PDF or plain text files are supported.")

    content_bytes = await file.read()
    if len(content_bytes) > 15 * 1024 * 1024: # 15MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum 15MB limit.")

    if file.filename.lower().endswith(".pdf"):
        text = DocumentService.extract_text_from_pdf(content_bytes)
    else:
        text = content_bytes.decode("utf-8", errors="ignore")

    return DocumentService.analyze_specification(file.filename, text)

@router.post("/analyze-text", response_model=DocumentAnalysisResponse)
def analyze_raw_text(
    title: str = Form("Manual Specification Entry"),
    text_content: str = Form(...)
):
    if len(text_content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text content is too brief for analysis.")
    return DocumentService.analyze_specification(title, text_content)

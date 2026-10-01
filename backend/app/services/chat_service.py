from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import EvidenceSummary
from app.ai.rag.retriever import HybridRetriever
from app.ai.guardrails.evidence_guard import EvidenceGuardrail
from app.ai.llm.router import LLMRouter
from app.db.models import AuditLogModel
from app.core.constants import LEGAL_DISCLAIMER

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.retriever = HybridRetriever(db)

    def process_query(self, req: ChatRequest) -> ChatResponse:
        # 1. Retrieve candidates via hybrid search
        candidates = self.retriever.retrieve_candidates(req.message, top_k=5)

        # 2. Evaluate evidence guardrail
        evaluation = EvidenceGuardrail.evaluate(req.message, candidates)

        # 3. Synthesize grounded answer
        synth = LLMRouter.synthesize_response(req.message, req.language, evaluation)

        is_refusal = not evaluation.get("is_sufficient", False)

        # 4. Create Evidence Summary
        citations = evaluation.get("citations", [])
        evidence_summary = EvidenceSummary(
            strength=evaluation.get("evidence_strength", "LIMITED"),
            sources_count=len(citations),
            primary_standard=evaluation.get("primary_standard"),
            is_mandatory=evaluation.get("is_mandatory", False),
            governing_qco=evaluation.get("governing_qco"),
            citations=citations
        )

        # 5. Log audit trace
        try:
            audit = AuditLogModel(
                session_id=req.conversation_id or "anon",
                user_query=req.message,
                detected_intent="STANDARD_RAG" if not is_refusal else "UNSUPPORTED_REFUSAL",
                matched_standard=evaluation.get("primary_standard"),
                response_summary=synth["answer"][:250],
                evidence_strength=evidence_summary.strength
            )
            self.db.add(audit)
            self.db.commit()
        except Exception:
            self.db.rollback()

        return ChatResponse(
            answer=synth["answer"],
            language=req.language,
            intent="STANDARD_SEARCH" if not is_refusal else "UNSUPPORTED_QUERY",
            product_detected=synth.get("product_detected"),
            applicable_standards=synth.get("applicable_standards", []),
            is_mandatory=synth.get("is_mandatory", False),
            evidence=evidence_summary,
            suggested_actions=synth.get("suggested_actions", []),
            disclaimer=LEGAL_DISCLAIMER,
            is_refusal=is_refusal
        )

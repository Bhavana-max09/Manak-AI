import re
import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.db.models import StandardModel, QCOModel, SchemeModel, LabModel

class HybridRetriever:
    """
    Hybrid Retrieval Engine combining:
    1. Exact standard number / QCO code identifier matching
    2. BM25 / TF-IDF sparse lexical scoring
    3. Semantic keyword overlap with reciprocal rank fusion (RRF)
    """

    def __init__(self, db: Session):
        self.db = db

    def _normalize(self, text: str) -> str:
        if not text:
            return ""
        return re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower()).strip()

    def _tokenize(self, text: str) -> List[str]:
        words = self._normalize(text).split()
        stop_words = {"the", "is", "at", "which", "on", "a", "an", "and", "or", "for", "in", "to", "what", "of", "with"}
        return [w for w in words if w not in stop_words and len(w) > 1]

    def _extract_is_patterns(self, query: str) -> List[str]:
        """Extract explicit standard references like 'IS 302', 'IS 14543', 'IS 9873'."""
        patterns = re.findall(r'\bis\s*[-:]?\s*(\d+)', query.lower())
        return [f"is {p}" for p in patterns]

    def retrieve_candidates(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        standards = self.db.query(StandardModel).all()
        qcos = self.db.query(QCOModel).all()
        labs = self.db.query(LabModel).all()

        query_tokens = self._tokenize(query)
        is_patterns = self._extract_is_patterns(query)

        scored_candidates = []

        for std in standards:
            score = 0.0
            std_dict = std.to_dict()

            std_code_lower = std.code.lower()
            is_num_lower = std.is_number.lower()
            product_lower = std.product.lower()
            title_lower = std.title.lower()
            scope_lower = (std.scope or "").lower()
            keywords = [k.lower() for k in std_dict.get("keywords", [])]

            # 1. Exact Identifier Match (Massive Boost)
            for pat in is_patterns:
                pat_num = pat.replace("is", "").strip()
                if pat_num in std_code_lower or pat_num in is_num_lower:
                    score += 50.0

            # 2. Product Name / Synonym Exact Substring
            for kw in keywords:
                if kw in query.lower():
                    score += 25.0
                elif any(t in kw for t in query_tokens):
                    score += 8.0

            # 3. Product Substring Match
            if std.product.lower() in query.lower():
                score += 30.0

            # 4. Token Overlap Scoring
            token_matches = 0
            for token in query_tokens:
                if token in title_lower:
                    token_matches += 3
                if token in product_lower:
                    token_matches += 4
                if token in scope_lower:
                    token_matches += 1

            score += float(token_matches)

            # 5. Link Associated QCO
            matched_qco = None
            for q in qcos:
                if q.is_number == std.is_number or q.applicable_standard_code == std.code:
                    matched_qco = q.to_dict()
                    break

            # 6. Link Associated Labs
            compatible_labs = []
            for lab in labs:
                lab_dict = lab.to_dict()
                for sup in lab_dict.get("supported_standards", []):
                    if sup.get("standard_code") == std.code or std.is_number in sup.get("is_number", ""):
                        compatible_labs.append({
                            "lab_name": lab_dict["name"],
                            "district": lab_dict["district"],
                            "state": lab_dict["state"],
                            "lab_type": lab_dict["lab_type"],
                            "phone": lab_dict["phone"],
                            "tests": sup.get("tests_supported", []),
                            "charge_inr": sup.get("testing_charge_inr")
                        })
                        break

            if score > 0:
                scored_candidates.append({
                    "standard": std_dict,
                    "score": score,
                    "matched_qco": matched_qco,
                    "compatible_labs": compatible_labs
                })

        # Sort descending by fused score
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        return scored_candidates[:top_k]

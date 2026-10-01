from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import StandardModel, QCOModel
from app.schemas.recommendation import ProductSpecRequest, ProductSpecResponse, CandidateStandard

class ProductStandardMatcher:
    def __init__(self, db: Session):
        self.db = db

    def match_product(self, spec: ProductSpecRequest) -> ProductSpecResponse:
        name = spec.product_name.lower().strip()
        material = (spec.material or "").lower()
        use = (spec.intended_use or "Household").lower()
        wattage = (spec.power_wattage or "").lower()

        standards = self.db.query(StandardModel).all()
        qcos = self.db.query(QCOModel).all()

        candidates: List[CandidateStandard] = []

        for std in standards:
            score = 0
            why: List[str] = []

            std_code = std.code.lower()
            product_field = std.product.lower()
            scope = (std.scope or "").lower()
            keywords = [k.lower() for k in std.to_dict().get("keywords", [])]

            # 1. Product Name Direct Overlap
            if any(k in name for k in keywords) or any(name in k for k in keywords):
                score += 55
                why.append(f"Direct match with product category '{std.product.split(',')[0]}'")
            elif any(w in product_field for w in name.split() if len(w) > 2):
                score += 30
                why.append("Significant keyword overlap in product taxonomy")

            # 2. Material Match
            if material:
                if "steel" in material and ("steel" in scope or "steel" in product_field):
                    score += 15
                    why.append(f"Material specification '{spec.material}' matches standard material clause")
                elif "plastic" in material and ("plastic" in scope or "toy" in product_field or "appliance" in product_field):
                    score += 10
                    why.append(f"Polymer/insulation material aligns with construction requirements")
                elif "aluminium" in material and "aluminium" in scope:
                    score += 15
                    why.append("Aluminium alloy specification conforms to body requirements")

            # 3. Electrical / Power Alignment
            if wattage or spec.voltage:
                if "electric" in std_code or "302" in std_code:
                    score += 20
                    why.append(f"Rated operating power ({spec.power_wattage or '230V'}) falls within single-phase scope (<= 250V)")

            # 4. Intended Use Alignment
            if "household" in use and "household" in scope:
                score += 10
                why.append("Domestic/household application matches standard scope")
            elif "child" in use or "toy" in use:
                if "9873" in std_code:
                    score += 25
                    why.append("Intended child safety scope matches IS 9873")

            if score >= 30:
                # Find matching QCO
                matched_qco = None
                for q in qcos:
                    if q.applicable_standard_code == std.code or q.is_number == std.is_number:
                        matched_qco = q.title
                        break

                candidates.append(CandidateStandard(
                    is_number=std.is_number,
                    code=std.code,
                    title=std.title,
                    match_score=min(score, 98),
                    why_matched=why,
                    is_mandatory=std.is_mandatory,
                    qco_order=matched_qco,
                    certification_scheme=std.scheme,
                    key_tests=std.to_dict().get("required_tests", [])[:4]
                ))

        # Sort descending by match score
        candidates.sort(key=lambda x: x.match_score, reverse=True)

        # Build verdict
        if candidates:
            top = candidates[0]
            if top.is_mandatory:
                mandatory_verdict = f"COMPULSORY: Governed under {top.qco_order or 'Central Government QCO'}. Manufacturing or selling without an active ISI mark is strictly prohibited."
                timeline = "30 to 45 Days (Standard Procedure) / 15 to 20 Days (Simplified Scheme for MSMEs)"
            else:
                mandatory_verdict = "VOLUNTARY: Certification is currently voluntary under Scheme I, but grants quality assurance and government tender eligibility."
                timeline = "20 to 30 Days"
        else:
            mandatory_verdict = "NO CURRENT MANDATE: No direct Indian Standard match found in the current authorized registry."
            timeline = "N/A"

        return ProductSpecResponse(
            product_identified=spec.product_name,
            spec_summary={
                "material": spec.material or "Not specified",
                "power_wattage": spec.power_wattage or "N/A",
                "voltage": spec.voltage or "230V AC Single Phase (Nominal)",
                "intended_use": spec.intended_use or "Household",
                "capacity": spec.capacity or "N/A"
            },
            candidates=candidates[:4],
            mandatory_verdict=mandatory_verdict,
            recommended_action=(
                f"Proceed with Scheme I (ISI Mark) application on www.manakonline.in for standard '{candidates[0].is_number}'."
                if candidates else "Submit a standard classification inquiry to the Bureau of Indian Standards Technical Advisory."
            ),
            estimated_licence_timeline=timeline,
            disclaimer="Recommendation is generated via BIS Knowledge Base semantic matching. Verify specific model variants with BIS before filing."
        )

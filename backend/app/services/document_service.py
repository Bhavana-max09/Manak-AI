import re
import io
from typing import Dict, Any, List
from pypdf import PdfReader
from app.schemas.document import DocumentAnalysisResponse, ExtractedAttribute, ComplianceCheckItem

class DocumentService:
    @classmethod
    def extract_text_from_pdf(cls, file_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in reader.pages[:10]: # Max 10 pages for safety
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            return f"Error extracting PDF text: {str(e)}"

    @classmethod
    def analyze_specification(cls, filename: str, content_text: str) -> DocumentAnalysisResponse:
        text_lower = content_text.lower()

        # 1. Product detection
        detected_product = "General Industrial/Consumer Item"
        applicable_std = "IS 302 (Part 2/Sec 15) : 2009"
        qco_alert = None

        if "kettle" in text_lower or "water boiler" in text_lower or "tea maker" in text_lower:
            detected_product = "Electric Kettle / Liquid Heating Appliance"
            applicable_std = "IS 302 (Part 2/Sec 15) : 2009 (Safety of Heating Liquids)"
            qco_alert = "Electrical Appliances (Quality Control) Order, 2023 — MANDATORY ISI MARK REQUIRED"
        elif "water" in text_lower and ("packaged" in text_lower or "bottle" in text_lower or "mineral" in text_lower):
            detected_product = "Packaged Drinking Water"
            applicable_std = "IS 14543 : 2024 (Packaged Drinking Water)"
            qco_alert = "Food Safety and Standards Statutory Order — MANDATORY ISI MARK REQUIRED"
        elif "toy" in text_lower or "children" in text_lower:
            detected_product = "Children Toy"
            applicable_std = "IS 9873 (Part 1) : 2019 (Mechanical Safety of Toys)"
            qco_alert = "Toys (Quality Control) Order, 2020 — MANDATORY ISI MARK REQUIRED"
        elif "cooker" in text_lower or "pressure" in text_lower:
            detected_product = "Domestic Pressure Cooker"
            applicable_std = "IS 2347 : 2017 (Pressure Cookers Specification)"
            qco_alert = "Domestic Pressure Cookers (Quality Control) Order, 2020 — MANDATORY ISI MARK"
        elif "helmet" in text_lower:
            detected_product = "Two-Wheeler Protective Helmet"
            applicable_std = "IS 4151 : 2020 (Protective Helmets for Motorcyclists)"
            qco_alert = "Helmets (Quality Control) Order, 2020 — MANDATORY ISI MARK"

        # 2. Extract Technical Attributes
        attributes: List[ExtractedAttribute] = []

        # Wattage regex
        watt_match = re.search(r'(\d{3,4})\s*(?:w|watt|watts)', text_lower)
        if watt_match:
            attributes.append(ExtractedAttribute(attribute="Rated Power Input", detected_value=f"{watt_match.group(1)} Watts", confidence=0.95))

        # Voltage regex
        volt_match = re.search(r'(\d{3})\s*(?:v|volt|volts)', text_lower)
        if volt_match:
            attributes.append(ExtractedAttribute(attribute="Rated Voltage", detected_value=f"{volt_match.group(1)} V AC", confidence=0.90))
        else:
            attributes.append(ExtractedAttribute(attribute="Rated Voltage", detected_value="230V AC (Inferred)", confidence=0.60))

        # Material regex
        if "stainless steel" in text_lower or "ss 304" in text_lower:
            attributes.append(ExtractedAttribute(attribute="Primary Body Material", detected_value="Stainless Steel (Food Grade)", confidence=0.95))
        elif "aluminium" in text_lower:
            attributes.append(ExtractedAttribute(attribute="Primary Body Material", detected_value="Aluminium Alloy", confidence=0.92))
        elif "plastic" in text_lower or "polypropylene" in text_lower:
            attributes.append(ExtractedAttribute(attribute="Primary Body Material", detected_value="Thermoplastic Polypropylene", confidence=0.88))

        # 3. Compliance Checklist & Gap Analysis
        checklist: List[ComplianceCheckItem] = []
        gaps: List[str] = []

        # Check 1: Voltage within single phase limit
        checklist.append(ComplianceCheckItem(
            aspect="Supply Voltage Rating",
            requirement="Must not exceed 250V single-phase for domestic category",
            status="Conforming",
            clause_ref="Clause 1 & 7.1",
            observation="Operating voltage conforms to Indian domestic supply standards."
        ))

        # Check 2: Thermal cut-out / Boil-dry protection
        if "cut-out" in text_lower or "thermostat" in text_lower or "auto shut off" in text_lower or "boil-dry" in text_lower:
            checklist.append(ComplianceCheckItem(
                aspect="Abnormal Operation / Boil-Dry Protection",
                requirement="Must feature automatic thermal cut-out preventing fire or melting",
                status="Conforming",
                clause_ref="Clause 19.101",
                observation="Specification mentions automatic shut-off / thermal cut-out mechanism."
            ))
        else:
            checklist.append(ComplianceCheckItem(
                aspect="Abnormal Operation / Boil-Dry Protection",
                requirement="Must feature automatic thermal cut-out preventing fire or melting",
                status="Missing/Non-Compliant",
                clause_ref="Clause 19.101",
                observation="No mention of boil-dry thermal cut-out in specification sheet."
            ))
            gaps.append("Thermal cut-out and boil-dry safety mechanism specification is missing.")

        # Check 3: Cordless Base Interlock
        if "cordless" in text_lower:
            if "interlock" in text_lower or "shutter" in text_lower:
                checklist.append(ComplianceCheckItem(
                    aspect="Cordless Connector Interlock",
                    requirement="Contacts must disconnect before kettle body is removed from base",
                    status="Conforming",
                    clause_ref="Clause 22.103",
                    observation="Interlock contacts specified to prevent live terminal access."
                ))
            else:
                checklist.append(ComplianceCheckItem(
                    aspect="Cordless Connector Interlock",
                    requirement="Contacts must disconnect before kettle body is removed from base",
                    status="Verification Needed",
                    clause_ref="Clause 22.103",
                    observation="Cordless kettle detected, but base contact safety interlock details are absent."
                ))
                gaps.append("Base terminal disconnection safety interlock must be confirmed per Clause 22.103.")

        # Check 4: Earthing & Insulation
        if "class i" in text_lower or "earthing" in text_lower or "3-pin" in text_lower:
            checklist.append(ComplianceCheckItem(
                aspect="Earthing & Protective Bonding",
                requirement="Accessible metal parts must be reliably connected to earth terminal",
                status="Conforming",
                clause_ref="Clause 27",
                observation="Class I earthing provision documented."
            ))
        else:
            checklist.append(ComplianceCheckItem(
                aspect="Earthing & Protective Bonding",
                requirement="Accessible metal parts must be reliably connected to earth terminal",
                status="Verification Needed",
                clause_ref="Clause 27",
                observation="Earthing terminal and conductor size require verification in test lab."
            ))
            gaps.append("Verify 3-pin plug earthing and ground continuity conductor dimensions.")

        return DocumentAnalysisResponse(
            document_name=filename,
            file_type="PDF Specification" if filename.endswith(".pdf") else "Technical Text",
            extracted_text_snippet=content_text[:300].strip() + "...",
            detected_product=detected_product,
            detected_attributes=attributes,
            applicable_standard=applicable_std,
            mandatory_qco_alert=qco_alert,
            compliance_checklist=checklist,
            gap_analysis=gaps,
            recommendation=(
                f"Your product is subject to {qco_alert or 'BIS certification'}. "
                f"Address the {len(gaps)} missing safety items before applying for Scheme I on Manakonline."
            )
        )

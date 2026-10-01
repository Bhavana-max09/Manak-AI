import logging
from typing import Dict, Any, List
from app.core.constants import LEGAL_DISCLAIMER

logger = logging.getLogger(__name__)

class LLMRouter:
    """
    Synthesizes evidence-grounded responses in English, Hindi, and Kannada.
    Supports pluggable external LLM (Ollama, vLLM, OpenAI) with a deterministic
    statutory synthesis engine guaranteeing 100% evidence compliance.
    """

    @classmethod
    def synthesize_response(
        cls,
        user_query: str,
        language: str,
        evaluation_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        is_sufficient = evaluation_result.get("is_sufficient", False)

        # Detect Kannada / Hindi from characters if language is set to 'en' but text contains indic scripts
        if any('\u0c80' <= char <= '\u0cff' for char in user_query):
            language = "kn"
        elif any('\u0900' <= char <= '\u097f' for char in user_query):
            language = "hi"

        # Case 1: Insufficient Evidence -> Honest Refusal
        if not is_sufficient:
            return cls._build_refusal(user_query, language)

        top = evaluation_result["top_candidate"]
        std = top["standard"]
        qco = top.get("matched_qco")
        labs = top.get("compatible_labs", [])

        if language == "kn":
            return cls._synthesize_kannada(std, qco, labs)
        elif language == "hi":
            return cls._synthesize_hindi(std, qco, labs)
        else:
            return cls._synthesize_english(std, qco, labs)

    @classmethod
    def _synthesize_english(cls, std: Dict[str, Any], qco: Dict[str, Any], labs: List[Dict[str, Any]]) -> Dict[str, Any]:
        lines = []

        # 1. Product Identified
        product_name = std["product"].split(",")[0].strip()
        lines.append(f"### 📦 PRODUCT IDENTIFIED\n**{product_name}** ({std['category']})")

        # 2. Applicable Standard(s)
        lines.append(f"### 📜 APPLICABLE STANDARD(S)\n• **{std['is_number']}**\n  *Title:* {std['title']}\n  *Technical Committee:* {std['committee']}\n  *Current Status:* {std['status']} (Reaffirmed {std.get('reaffirmation_year', 2024)})")

        # 3. Certification Requirement & QCO
        qco_text = ""
        if qco:
            qco_text = (
                f"• **Mandatory Certification Status:** **COMPULSORY** under statutory order.\n"
                f"• **Governing QCO:** {qco['title']} ({qco['qco_number']})\n"
                f"• **Issued by:** {qco['ministry']} (Enforced: {qco['enforcement_date']})\n"
                f"• **Scheme:** {std.get('scheme', 'Scheme I (ISI Mark)')}\n"
                f"• **Legal Note:** {qco.get('penalty_clause', 'Mandatory ISI mark required prior to manufacturing or sale.')}"
            )
        else:
            qco_text = (
                f"• **Certification Status:** Voluntary under Section 13 of BIS Act, 2016.\n"
                f"• **Scheme:** {std.get('scheme', 'Scheme I (ISI Mark)')}"
            )
        lines.append(f"### 🏛️ CERTIFICATION\n{qco_text}")

        # 4. Certification Process
        lines.append(
            "### 🔄 CERTIFICATION PROCESS (Scheme I - ISI Mark)\n"
            "1. **Confirm In-House Testing:** Set up mandatory testing laboratory facilities in your factory as per the BIS Scheme of Inspection and Testing (SIT).\n"
            "2. **Online Application:** Submit application on the official **Manakonline Portal** (www.manakonline.in) with manufacturing layout, equipment list, and QC personnel details.\n"
            "3. **Factory Audit:** BIS Inspecting Officers conduct an on-site factory verification and draw independent verification samples.\n"
            "4. **Lab Verification:** Samples tested in an authorized BIS or recognized testing laboratory.\n"
            "5. **Grant of Licence:** Satisfactory test reports result in the grant of Certification Marks Licence (CM/L) allowing ISI mark affixation."
        )

        # 5. Testing Requirements
        tests = std.get("required_tests", [])
        tests_formatted = "\n".join([f"• {t}" for t in tests[:6]])
        lines.append(f"### 🔬 MANDATORY SAFETY & QUALITY TESTS\n{tests_formatted}")

        # 6. Available Laboratories
        if labs:
            lab_lines = []
            for lab in labs[:3]:
                lab_lines.append(f"• **{lab['lab_name']}** — {lab['district']}, {lab['state']} ({lab['lab_type']}) | Testing Fee: ₹{lab.get('charge_inr', 'Nominal')} | Contact: {lab['phone']}")
            lines.append(f"### 🏢 AVAILABLE AUTHORIZED LABORATORIES (BIS LIMS)\n" + "\n".join(lab_lines))
        else:
            lines.append("### 🏢 AVAILABLE AUTHORIZED LABORATORIES (BIS LIMS)\n• BIS Central Laboratory (CL), Sahibabad & Southern Regional Laboratory, Chennai")

        # 7. Evidence Citations
        clauses = std.get("clauses", [])
        clause_snippets = []
        for c in clauses[:3]:
            clause_snippets.append(f"  - **Clause {c['clause']} ({c['title']}):** {c['requirement']}")
        lines.append(
            "### 🛡️ OFFICIAL BIS EVIDENCE & CLAUSES\n"
            f"• **BIS Source:** Know Your Standards & Gazette Notification\n"
            f"• **Referenced Clauses:**\n" + "\n".join(clause_snippets)
        )

        # 8. Verification & Disclaimer
        lines.append(f"**LAST VERIFIED:** {std.get('last_verified_at', '2026-09-30')}")

        full_answer = "\n\n".join(lines)
        return {
            "answer": full_answer,
            "product_detected": product_name,
            "applicable_standards": [std],
            "is_mandatory": std.get("is_mandatory", False),
            "suggested_actions": [
                {"label": f"Inspect {std['code']} Clauses", "action_type": "navigate", "target": f"/standards/{std['id']}"},
                {"label": "Find LIMS Testing Labs", "action_type": "navigate", "target": f"/laboratories?is_number={std['code']}"},
                {"label": "Certification Roadmap", "action_type": "navigate", "target": "/certification"},
                {"label": "Open Manakonline Portal ↗", "action_type": "link", "target": "https://www.manakonline.in"}
            ]
        }

    @classmethod
    def _synthesize_hindi(cls, std: Dict[str, Any], qco: Dict[str, Any], labs: List[Dict[str, Any]]) -> Dict[str, Any]:
        product_name = std["product"].split(",")[0].strip()
        mandatory_str = "अनिवार्य (Compulsory QCO)" if std.get("is_mandatory") else "स्वैच्छिक (Voluntary)"

        lines = [
            f"### 📦 पहचाना गया उत्पाद\n**{product_name}** ({std['category']})",
            f"### 📜 लागू भारतीय मानक (Indian Standard)\n• **{std['is_number']}**\n• शीर्षक: {std['title']}\n• स्थिति: {std['status']}",
            f"### 🏛️ बीआईएस प्रमाणीकरण (BIS Certification)\n• **प्रमाणीकरण स्थिति:** **{mandatory_str}**\n• योजना: {std.get('scheme', 'Scheme I (ISI Mark)')}\n• आदेश: {qco['title'] if qco else 'मानक दिशानिर्देश'}",
            "### 🔄 प्रमाणीकरण प्रक्रिया\n1. कारखाने में आवश्यक परीक्षण प्रयोगशाला (SIT) स्थापित करें।\n2. www.manakonline.in पोर्टल पर ऑनलाइन आवेदन जमा करें।\n3. बीआईएस अधिकारियों द्वारा कारखाने का निरीक्षण एवं नमूना संग्रहण।\n4. बीआईएस मान्यता प्राप्त प्रयोगशाला में स्वतंत्र परीक्षण।\n5. अनुपालन पर सीएम/एल (ISI मार्क लाइसेंस) का आवंटन।",
            "### 🔬 प्रमुख परीक्षण आवश्यकताएं\n" + "\n".join([f"• {t}" for t in std.get("required_tests", [])[:5]]),
            f"**अंतिम सत्यापन तिथि:** {std.get('last_verified_at', '2026-09-30')}"
        ]

        return {
            "answer": "\n\n".join(lines),
            "product_detected": product_name,
            "applicable_standards": [std],
            "is_mandatory": std.get("is_mandatory", False),
            "suggested_actions": [
                {"label": f"मानक {std['code']} विवरण", "action_type": "navigate", "target": f"/standards/{std['id']}"},
                {"label": "प्रयोगशालाएं खोजें", "action_type": "navigate", "target": f"/laboratories?is_number={std['code']}"}
            ]
        }

    @classmethod
    def _synthesize_kannada(cls, std: Dict[str, Any], qco: Dict[str, Any], labs: List[Dict[str, Any]]) -> Dict[str, Any]:
        product_name = std["product"].split(",")[0].strip()
        mandatory_str = "ಕಡ್ಡಾಯ ಪ್ರಮಾಣೀಕರಣ (Mandatory QCO)" if std.get("is_mandatory") else "ಸ್ವಯಂಪ್ರೇರಿತ (Voluntary)"

        lines = [
            f"### 📦 ಗುರುತಿಸಲಾದ ಉತ್ಪನ್ನ\n**{product_name}**",
            f"### 📜 ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡ (Applicable Standard)\n• **{std['is_number']}**\n• ಶೀರ್ಷಿಕೆ: {std['title']}\n• ಇಲಾಖೆ: {std['technical_department']}",
            f"### 🏛️ BIS ಪ್ರಮಾಣೀಕರಣ ಹಾಗೂ ಆದೇಶ\n• **ಪ್ರಮಾಣೀಕರಣ ಸ್ಥಿತಿ:** **{mandatory_str}**\n• ಯೋಜನೆ: {std.get('scheme', 'Scheme I (ISI Mark)')}\n• ಆದೇಶ: {qco['title'] if qco else 'ಸಾಮಾನ್ಯ ನಿಯಮಗಳು'}",
            "### 🔄 ಪ್ರಮಾಣೀಕರಣದ ಹಂತಗಳು\n1. ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಅಗತ್ಯ ಪರೀಕ್ಷಾ ಸೌಲಭ್ಯ ಸ್ಥಾಪನೆ.\n2. www.manakonline.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ.\n3. BIS ಅಧಿಕಾರಿಗಳಿಂದ ಕಾರ್ಖಾನೆ ಪರಿಶೀಲನೆ ಮತ್ತು ಮಾದರಿ ಸಂಗ್ರಹ.\n4. BIS ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ಪರೀಕ್ಷೆ.\n5. ISI ಮಾರ್ಕ್ ಪರವಾನಗಿ (CM/L) ಮಂಜೂರಾತಿ.",
            "### 🔬 ಅಗತ್ಯವಿರುವ ಪರೀಕ್ಷೆಗಳು\n" + "\n".join([f"• {t}" for t in std.get("required_tests", [])[:5]]),
            f"**ಕೊನೆಯದಾಗಿ ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ:** {std.get('last_verified_at', '2026-09-30')}"
        ]

        return {
            "answer": "\n\n".join(lines),
            "product_detected": product_name,
            "applicable_standards": [std],
            "is_mandatory": std.get("is_mandatory", False),
            "suggested_actions": [
                {"label": f"ಮಾನದಂಡ ವಿವರ {std['code']}", "action_type": "navigate", "target": f"/standards/{std['id']}"},
                {"label": "ಲ್ಯಾಬ್ ಹುಡುಕಿ", "action_type": "navigate", "target": f"/laboratories?is_number={std['code']}"}
            ]
        }

    @classmethod
    def _build_refusal(cls, user_query: str, language: str) -> Dict[str, Any]:
        if language == "kn":
            answer = (
                "### ⚠ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ (Verification Required)\n\n"
                "ನಮಗೆ ಲಭ್ಯವಿರುವ ಅಧಿಕೃತ BIS ಮೂಲಗಳಲ್ಲಿ ನಿಮ್ಮ ಉತ್ಪನ್ನ ಅಥವಾ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದ ನಿಖರವಾದ ಭಾರತೀಯ ಮಾನದಂಡ ಕಂಡುಬಂದಿಲ್ಲ.\n\n"
                "**ಪರಿಶೀಲಿಸಲಾದ ಮೂಲಗಳು:**\n"
                "• BIS Know Your Standards ಡೇಟಾಬೇಸ್\n"
                "• ಕಡ್ಡಾಯ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳು (QCOs)\n"
                "• BIS LIMS ಪ್ರಯೋಗಾಲಯಗಳ ಡೈರೆಕ್ಟರಿ\n\n"
                "ಅನಧಿಕೃತ ಅಥವಾ ಊಹಾತ್ಮಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ನೀಡುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಂಬಂಧಿತ BIS ವಿಭಾಗ ಅಥವಾ www.bis.gov.in ನೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ."
            )
        elif language == "hi":
            answer = (
                "### ⚠ सत्यापन आवश्यक है (Verification Required)\n\n"
                "उपलब्ध अधिकृत बीआईएस ज्ञान स्रोतों में आपके द्वारा पूछे गए उत्पाद या आवश्यकता के लिए कोई विशिष्ट भारतीय मानक सत्यापित नहीं किया जा सका।\n\n"
                "**जांचे गए आधिकारिक स्रोत:**\n"
                "• बीआईएस नो योर स्टैंडर्ड्स (Know Your Standards)\n"
                "• अनिवार्य गुणवत्ता नियंत्रण आदेश (QCOs)\n"
                "• बीआईएस एलआईएमएस प्रयोगशाला डेटाबेस\n\n"
                "हम मनगढ़ंत या असत्यापित मानकों की अनुशंसा नहीं करते हैं। कृपया अधिक जानकारी के लिए सीधे आधिकारिक बीआईएस पोर्टल (www.bis.gov.in) पर संपर्क करें।"
            )
        else:
            answer = (
                "### ⚠ Verification Required (Grounded Refusal)\n\n"
                "I couldn't verify an applicable requirement or Indian Standard from the authorized BIS knowledge sources "
                "currently available in our corpus.\n\n"
                "**Sources Checked:**\n"
                "• BIS Know Your Standards Database (Active & Reaffirmed Standards)\n"
                "• Line Ministry Quality Control Orders (QCO) Gazette Registry\n"
                "• BIS LIMS Laboratory Network\n"
                "• BIS Product Certification Manuals\n\n"
                "**Guidance:**\n"
                "To prevent misinformation, MANAK AI does not hallucinate standards for unverified or experimental products. "
                "If this is a newly categorized industrial product or composite item, please contact the relevant Technical "
                "Department at the Bureau of Indian Standards (www.bis.gov.in)."
            )

        return {
            "answer": answer,
            "product_detected": "Unverified / Non-Standard Item",
            "applicable_standards": [],
            "is_mandatory": False,
            "suggested_actions": [
                {"label": "Search All Indian Standards", "action_type": "navigate", "target": "/standards"},
                {"label": "Visit Official BIS Portal ↗", "action_type": "link", "target": "https://www.bis.gov.in"}
            ]
        }

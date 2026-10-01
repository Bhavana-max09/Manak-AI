"""
MANAK AI Constants: Source trust hierarchy, official portal URLs, and legal disclaimers.
"""

SOURCE_TRUST_LEVELS = {
    1: "Official BIS Current Source (Know Your Standards / Gazetted)",
    2: "Official Government Statutory Quality Control Order (QCO)",
    3: "Official BIS Public Product Manual / SIT Guidelines",
    4: "Official BIS LIMS (Laboratory Information Management System)",
    5: "Department of Consumer Affairs / Line Ministry Directives",
    6: "External / Unverified Third Party Source"
}

OFFICIAL_BIS_PORTALS = {
    "main": "https://www.bis.gov.in",
    "standards": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails",
    "manakonline": "https://www.manakonline.in",
    "lims": "https://lims.bis.gov.in",
    "hallmarking": "https://www.bis.gov.in/hallmarking-overview/",
    "crs": "https://www.crsbis.in/BIS/",
    "care_app": "https://www.bis.gov.in/consumer-affairs/bis-care-app/"
}

LEGAL_DISCLAIMER = (
    "MANAK AI is an intelligent decision-support system. Responses are synthesized from referenced "
    "authorized Bureau of Indian Standards (BIS) documents and Quality Control Orders. This service does "
    "not constitute legally binding advice. Users must verify current standards and statutory notifications "
    "directly through official BIS portals (manakonline.in / bis.gov.in) before commercial or regulatory execution."
)

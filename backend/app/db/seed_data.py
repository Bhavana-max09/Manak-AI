import os
import json
import logging
from sqlalchemy.orm import Session
from app.db.models import StandardModel, QCOModel, SchemeModel, LabModel

logger = logging.getLogger(__name__)

# Search paths for structured data
DATA_DIR_CANDIDATES = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/structured")),
    os.path.abspath(os.path.join(os.getcwd(), "data/structured")),
    "/app/data/structured"
]

def find_data_file(filename: str) -> str:
    for base in DATA_DIR_CANDIDATES:
        path = os.path.join(base, filename)
        if os.path.exists(path):
            return path
    return None

def seed_database(db: Session):
    try:
        # 1. Seed Standards
        std_count = db.query(StandardModel).count()
        if std_count == 0:
            standards_path = find_data_file("standards.json")
            if standards_path:
                with open(standards_path, "r", encoding="utf-8") as f:
                    standards_data = json.load(f)
                    for item in standards_data:
                        std = StandardModel(
                            id=item["id"],
                            is_number=item["is_number"],
                            code=item["code"],
                            title=item["title"],
                            product=item["product"],
                            category=item["category"],
                            scope=item["scope"],
                            status=item["status"],
                            revision_year=item.get("revision_year", 2020),
                            reaffirmation_year=item.get("reaffirmation_year", 2024),
                            technical_department=item["technical_department"],
                            committee=item["committee"],
                            scheme=item.get("scheme", "Scheme I (ISI Mark)"),
                            is_mandatory=item.get("is_mandatory", False),
                            qco_reference=item.get("qco_reference"),
                            qco_id=item.get("qco_id"),
                            source_url=item["source_url"],
                            last_verified_at=item.get("last_verified_at", "2026-09-30"),
                            clauses_json=json.dumps(item.get("clauses", [])),
                            required_tests_json=json.dumps(item.get("required_tests", [])),
                            keywords_json=json.dumps(item.get("keywords", []))
                        )
                        db.add(std)
                db.commit()
                logger.info(f"Seeded {len(standards_data)} Indian Standards.")

        # 2. Seed QCOs
        qco_count = db.query(QCOModel).count()
        if qco_count == 0:
            qcos_path = find_data_file("qcos.json")
            if qcos_path:
                with open(qcos_path, "r", encoding="utf-8") as f:
                    qcos_data = json.load(f)
                    for item in qcos_data:
                        qco = QCOModel(
                            id=item["id"],
                            qco_number=item["qco_number"],
                            title=item["title"],
                            ministry=item["ministry"],
                            product=item["product"],
                            is_number=item["is_number"],
                            applicable_standard_code=item["applicable_standard_code"],
                            scheme=item["scheme"],
                            notification_date=item["notification_date"],
                            enforcement_date=item["enforcement_date"],
                            status=item.get("status", "In Force"),
                            exemption_policy=item.get("exemption_policy", ""),
                            penalty_clause=item.get("penalty_clause", ""),
                            source_url=item["source_url"]
                        )
                        db.add(qco)
                db.commit()
                logger.info(f"Seeded {len(qcos_data)} Quality Control Orders.")

        # 3. Seed Schemes
        scheme_count = db.query(SchemeModel).count()
        if scheme_count == 0:
            schemes_path = find_data_file("schemes.json")
            if schemes_path:
                with open(schemes_path, "r", encoding="utf-8") as f:
                    schemes_data = json.load(f)
                    for item in schemes_data:
                        scheme = SchemeModel(
                            id=item["id"],
                            code=item["code"],
                            name=item["name"],
                            mark_name=item["mark_name"],
                            description=item["description"],
                            eligibility=item["eligibility"],
                            applicable_categories=item["applicable_categories"],
                            governing_regulation=item["governing_regulation"],
                            portal_url=item["portal_url"],
                            workflow_steps_json=json.dumps(item.get("workflow_steps", [])),
                            documents_required_json=json.dumps(item.get("documents_required", [])),
                            fee_structure_json=json.dumps(item.get("fee_structure", {}))
                        )
                        db.add(scheme)
                db.commit()
                logger.info(f"Seeded {len(schemes_data)} BIS Certification Schemes.")

        # 4. Seed Laboratories
        lab_count = db.query(LabModel).count()
        if lab_count == 0:
            labs_path = find_data_file("laboratories.json")
            if labs_path:
                with open(labs_path, "r", encoding="utf-8") as f:
                    labs_data = json.load(f)
                    for item in labs_data:
                        lab = LabModel(
                            id=item["id"],
                            lab_code=item["lab_code"],
                            name=item["name"],
                            lab_type=item["lab_type"],
                            address=item["address"],
                            district=item["district"],
                            state=item["state"],
                            pincode=item["pincode"],
                            contact_person=item["contact_person"],
                            phone=item["phone"],
                            email=item["email"],
                            validity_date=item["validity_date"],
                            accreditation_status=item["accreditation_status"],
                            supported_standards_json=json.dumps(item.get("supported_standards", []))
                        )
                        db.add(lab)
                db.commit()
                logger.info(f"Seeded {len(labs_data)} LIMS Laboratories.")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()

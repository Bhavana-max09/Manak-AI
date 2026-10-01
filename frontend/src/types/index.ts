export interface SourceCitation {
  source_id: string;
  source_type: string;
  title: string;
  document_ref: string;
  section_clause?: string;
  url?: string;
  last_verified: string;
  trust_level: number;
}

export interface EvidenceSummary {
  strength: 'HIGH' | 'MEDIUM' | 'LIMITED';
  sources_count: number;
  primary_standard?: string;
  is_mandatory: boolean;
  governing_qco?: string;
  citations: SourceCitation[];
}

export interface ActionItem {
  label: string;
  action_type: 'link' | 'navigate' | 'filter';
  target: string;
}

export interface ChatResponse {
  answer: string;
  language: string;
  intent: string;
  product_detected?: string;
  applicable_standards: any[];
  is_mandatory: boolean;
  evidence: EvidenceSummary;
  suggested_actions: ActionItem[];
  disclaimer: string;
  is_refusal: boolean;
}

export interface ClauseDetail {
  clause: string;
  title: string;
  requirement: string;
}

export interface StandardItem {
  id: string;
  is_number: string;
  code: string;
  title: string;
  product: string;
  category: string;
  scope: string;
  status: string;
  revision_year: number;
  reaffirmation_year: number;
  technical_department: string;
  committee: string;
  scheme: string;
  is_mandatory: boolean;
  qco_reference?: string;
  qco_id?: string;
  source_url: string;
  last_verified_at: string;
  clauses: ClauseDetail[];
  required_tests: string[];
  keywords: string[];
}

export interface CandidateStandard {
  is_number: string;
  code: string;
  title: string;
  match_score: number;
  why_matched: string[];
  is_mandatory: boolean;
  qco_order?: string;
  certification_scheme: string;
  key_tests: string[];
}

export interface ProductSpecResponse {
  product_identified: string;
  spec_summary: {
    material: string;
    power_wattage: string;
    voltage: string;
    intended_use: string;
    capacity: string;
  };
  candidates: CandidateStandard[];
  mandatory_verdict: string;
  recommended_action: string;
  estimated_licence_timeline: string;
  disclaimer: string;
}

export interface SupportedTestScope {
  is_number: string;
  standard_code: string;
  product: string;
  tests_supported: string[];
  testing_charge_inr: number;
  sample_turnaround_days: number;
}

export interface LaboratoryItem {
  id: string;
  lab_code: string;
  name: string;
  lab_type: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  contact_person: string;
  phone: string;
  email: string;
  validity_date: string;
  accreditation_status: string;
  supported_standards: SupportedTestScope[];
}

export interface ExtractedAttribute {
  attribute: string;
  detected_value: string;
  confidence: number;
}

export interface ComplianceCheckItem {
  aspect: string;
  requirement: string;
  status: 'Conforming' | 'Missing/Non-Compliant' | 'Verification Needed';
  clause_ref?: string;
  observation: string;
}

export interface DocumentAnalysisResponse {
  document_name: string;
  file_type: string;
  extracted_text_snippet: string;
  detected_product: string;
  detected_attributes: ExtractedAttribute[];
  applicable_standard?: string;
  mandatory_qco_alert?: string;
  compliance_checklist: ComplianceCheckItem[];
  gap_analysis: string[];
  recommendation: string;
}

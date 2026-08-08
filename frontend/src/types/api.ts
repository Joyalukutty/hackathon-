export interface DifferentialDiagnosis {
  condition: string;
  probability: string;
}

export interface TriageResponse {
  patient_id: string;
  esi_level: number;
  triage_category: string;
  triage_color: string;
  confidence_score: number;
  extracted_symptoms: string[];
  image_ocr_findings?: string;
  differential_diagnosis: DifferentialDiagnosis[];
  clinical_reasoning_trace: string[];
  counterfactual_analysis: string;
}

export interface ApiError {
  status: number;
  message: string;
}

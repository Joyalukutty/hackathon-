export type Severity = "critical" | "warning" | "safe" | "normal";

export interface Vitals {
  heartRate: number;
  bloodPressure: string;
  oxygenLevel: number;
  temperature: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  admittedAt: string;
  severity: Severity;
  diagnosis: string;
  vitals: Vitals;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "medication" | "lab" | "vitals" | "note";
}

export interface AIDecision {
  confidence: number;
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  immediateActions: string[];
  reasoning: string;
}

export interface AnalyticsData {
  latency: number;
  avgConfidence: number;
  patientsCount: number;
  criticalCases: number;
}

export interface BackendDifferentialDiagnosis {
  condition: string;
  probability: string;
}

export interface BackendVitals {
  heart_rate: number;
  bp: string;
  spo2: number;
  temperature: number;
}

export interface BackendPatient {
  patient_id: string;
  full_name: string;
  age: number;
  gender: string;
  room: string;
  esi_level: number;
  triage_category: string;
  triage_color: string;
  chief_complaint: string;
  confidence_score: number;
  vitals: BackendVitals;
  differential_diagnosis: BackendDifferentialDiagnosis[];
  clinical_reasoning_trace: string[];
  execution_mode: string;
  created_at: string;
}

export interface BackendSeverityDistribution {
  critical: number;
  warning: number;
  safe: number;
  normal: number;
}

export interface BackendAnalytics {
  total_patients: number;
  critical_cases: number;
  avg_triage_time_min: string;
  avg_confidence_pct: number;
  severity_distribution: BackendSeverityDistribution;
}

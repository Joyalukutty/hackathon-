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

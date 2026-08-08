import { apiClient, isMockMode } from './client';
import { MOCK_PATIENTS, MOCK_TIMELINE, MOCK_AI_DECISION } from '@/mock/data';
import { Patient, TimelineEvent, AIDecision, BackendPatient, Severity } from '@/types';

export const getPatientById = async (id: string): Promise<{
  patient: Patient;
  timeline: TimelineEvent[];
  aiDecision: AIDecision;
}> => {
  if (isMockMode()) {
    const patient = MOCK_PATIENTS.find(p => p.id === id);
    if (!patient) throw new Error("Patient not found");
    return {
      patient,
      timeline: MOCK_TIMELINE,
      aiDecision: MOCK_AI_DECISION
    };
  }

  const data = await apiClient<BackendPatient>(`/api/patients/${id}`);
  
  const mapSeverity = (esi: number): Severity => {
    switch (esi) {
      case 1: return "critical";
      case 2: return "warning";
      case 3: return "warning";
      case 4: return "safe";
      case 5: return "normal";
      default: return "normal";
    }
  };

  const now = new Date();
  
  const patient: Patient = {
    id: data.patient_id,
    name: data.full_name,
    age: data.age,
    gender: data.gender,
    room: data.room,
    admittedAt: now.toISOString(),
    severity: mapSeverity(data.esi_level),
    diagnosis: data.chief_complaint || "Undiagnosed",
    vitals: {
      heartRate: data.vitals?.heart_rate || 0,
      bloodPressure: data.vitals?.bp || "N/A",
      oxygenLevel: data.vitals?.spo2 || 0,
      temperature: data.vitals?.temperature || 0
    }
  };

  const diffDiagnoses = data.differential_diagnosis?.map(d => `${d.condition} (${d.probability})`) || [];

  const aiDecision: AIDecision = {
    confidence: Math.round((data.confidence_score || 0.9) * 100),
    primaryDiagnosis: data.differential_diagnosis?.[0]?.condition || data.chief_complaint || "Unknown",
    differentialDiagnoses: diffDiagnoses,
    immediateActions: ["Initiate continuous monitoring", "Follow departmental protocols"],
    reasoning: data.clinical_reasoning_trace?.join("\n") || "No reasoning trace available."
  };

  const timeline: TimelineEvent[] = (data.clinical_reasoning_trace || []).map((trace, i) => ({
    id: `event-${i}`,
    time: data.created_at,
    title: "AI Analysis Event",
    description: trace,
    type: "note"
  }));
  
  timeline.unshift({
    id: 'intake',
    time: data.created_at,
    title: "Patient Triage Complete",
    description: `Assigned ESI Level ${data.esi_level} (${data.triage_category})`,
    type: "vitals"
  });

  return { patient, timeline, aiDecision };
};

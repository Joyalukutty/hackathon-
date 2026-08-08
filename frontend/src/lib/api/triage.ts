export interface TriageResult {
  patient_id: string;
  esi_level: number;
  triage_category: string;
  triage_color: string;
  confidence_score: number;
  extracted_symptoms: string[];
  image_ocr_findings?: string;
  differential_diagnosis: { condition: string; probability: string }[];
  clinical_reasoning_trace: string[];
  counterfactual_analysis?: string;
  execution_mode?: "CLOUD_GEMINI" | "LOCAL_GPU_FAILSAFE" | string;
}

export async function submitTriageIntake(payload: {
  patient_id?: string;
  demographics?: Record<string, any>;
  symptoms?: string | string[];
  vitals?: Record<string, any>;
  image_file?: File | null;
  audio_file?: File | null;
}): Promise<TriageResult> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Combine demographics, symptoms, and vitals into a single JSON telemetry payload
  const vitalsJsonPayload = JSON.stringify({
    patient_id: payload.patient_id || `PT-${Math.floor(100 + Math.random() * 900)}`,
    demographics: payload.demographics || {},
    symptoms: payload.symptoms || '',
    vitals: payload.vitals || {},
  });

  const formData = new FormData();
  formData.append('vitals_json', vitalsJsonPayload);

  if (payload.image_file) {
    formData.append('image_file', payload.image_file);
  }
  if (payload.audio_file) {
    formData.append('audio_file', payload.audio_file);
  }

  const response = await fetch(`${API_URL}/api/triage`, {
    method: 'POST',
    body: formData, // Browser automatically sets multipart/form-data boundary
  });

  if (!response.ok) {
    let errorDetail = 'Failed to process triage intake';
    try {
      const errData = await response.json();
      errorDetail = errData.detail || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}
import { Evidence, EvidenceAnalysis, EvidenceStatus } from "@/types/evidence";
import { isMockMode } from "./client";

// In a real application, this would be an API call to a `/api/evidence/upload` endpoint.
// Since the FastAPI backend only supports `/api/triage`, we use this mock service to 
// simulate the upload and processing state machine.

export const uploadEvidenceMock = async (
  file: File,
  patientId: string,
  category: Evidence["category"],
  onProgress: (progress: number) => void,
  onStatusChange: (status: EvidenceStatus) => void
): Promise<Evidence> => {
  
  if (!isMockMode()) {
    console.warn("Backend mode enabled, but evidence endpoints don't exist yet! Falling back to mock implementation.");
  }

  // 1. Simulate Uploading
  onStatusChange("Uploading");
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise(r => setTimeout(r, 200)); // Simulate network latency
  }

  // 2. Simulate Processing
  onStatusChange("Processing");
  await new Promise(r => setTimeout(r, 2000)); // Simulate backend processing

  // 3. Simulate Analysis Results based on file type
  const mockAnalysis: EvidenceAnalysis = {
    requiresReview: true,
    confidence: 94.5
  };

  if (category === "Medical Image") {
    mockAnalysis.findings = ["Mild cardiomegaly noted.", "No acute pulmonary infiltrates."];
  } else if (category === "Lab Report") {
    mockAnalysis.extractedText = "CBC Results:\nWBC: 12.5 x10^9/L (High)\nHgb: 14.0 g/dL (Normal)";
    mockAnalysis.measurements = { "WBC": "12.5", "Hgb": "14.0" };
  } else if (category === "Prescription") {
    mockAnalysis.extractedText = "Amoxicillin 500mg PO TID x 7 days";
  } else if (category === "Voice") {
    mockAnalysis.extractedText = "Patient complains of sharp chest pain radiating to the left arm, started 2 hours ago.";
  }

  onStatusChange("Analyzed");

  return {
    id: `EV-${Math.floor(Math.random() * 10000)}`,
    patientId,
    fileName: file.name,
    fileType: file.name.split('.').pop() || "unknown",
    mimeType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    status: "Analyzed",
    category,
    analysis: mockAnalysis,
    // Generate a safe local object URL for previewing images without base64 encoding
    thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  };
};

export type EvidenceStatus = "Queued" | "Uploading" | "Processing" | "Analyzed" | "Failed";
export type EvidenceCategory = "Medical Image" | "Lab Report" | "Prescription" | "Document" | "Voice";

export interface EvidenceAnalysis {
  extractedText?: string;
  findings?: string[];
  measurements?: Record<string, string>;
  confidence?: number;
  requiresReview?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Evidence {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  status: EvidenceStatus;
  category: EvidenceCategory;
  analysis?: EvidenceAnalysis;
  thumbnailUrl?: string;
  error?: string;
}

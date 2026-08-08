export type AgentStatus = "Waiting" | "Running" | "Completed" | "Failed" | "Skipped";

export interface AgentNode {
  id: string;
  name: string;
  status: AgentStatus;
  startTime?: string;
  endTime?: string;
  durationMs?: number;
}

export interface TraceEvent {
  id: string;
  timestamp: string;
  message: string;
  agentId?: string;
}

export interface EvidenceWeight {
  modality: "Patient History" | "Vital Signs" | "Lab Report" | "Medical Image" | "Prescription" | "Voice Transcript";
  status: "Available" | "Used" | "Processing" | "Not available";
  weightScore: number; // 0 to 100
}

export interface HumanReviewAction {
  action: "Accept" | "Override" | "Reassess" | "Escalate";
  reason?: string;
  notes?: string;
  timestamp: string;
  clinicianId: string;
}

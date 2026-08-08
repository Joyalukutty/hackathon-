import { AgentNode, TraceEvent } from "@/types/ai";
import { isMockMode } from "./client";

// In a real application, this would connect to a WebSocket or SSE endpoint for live updates.
// We are simulating the orchestrator workflow locally for Mock Mode.

const generateId = () => Math.random().toString(36).substring(7);
const getTimestamp = () => new Date().toISOString();

export const simulateAgentOrchestration = async (
  onAgentUpdate: (agents: AgentNode[]) => void,
  onTraceUpdate: (trace: TraceEvent) => void,
  onComplete: () => void
) => {
  if (!isMockMode()) {
    console.warn("Backend mode enabled, but AI streaming endpoints are not built yet. Falling back to mock implementation.");
  }

  // Initial Pipeline State
  let agents: AgentNode[] = [
    { id: "context", name: "Patient Context", status: "Waiting" },
    { id: "evidence", name: "Evidence Analysis", status: "Waiting" },
    { id: "reasoning", name: "Clinical Reasoning", status: "Waiting" },
    { id: "risk", name: "Risk / Triage", status: "Waiting" },
    { id: "explain", name: "Explainability", status: "Waiting" },
  ];
  onAgentUpdate([...agents]);

  const updateAgentState = (index: number, status: AgentNode["status"]) => {
    agents[index].status = status;
    if (status === "Running") agents[index].startTime = getTimestamp();
    if (status === "Completed") {
      agents[index].endTime = getTimestamp();
      agents[index].durationMs = Math.floor(Math.random() * 1500) + 500;
    }
    onAgentUpdate([...agents]);
  };

  const pushTrace = (message: string, agentId?: string) => {
    onTraceUpdate({ id: generateId(), timestamp: getTimestamp(), message, agentId });
  };

  // Run the simulation sequence
  try {
    pushTrace("Initializing multi-agent orchestrator...");
    await new Promise(r => setTimeout(r, 800));

    // 1. Patient Context
    updateAgentState(0, "Running");
    pushTrace("Extracting patient demographic and historical context.", "context");
    await new Promise(r => setTimeout(r, 1200));
    updateAgentState(0, "Completed");
    pushTrace("Patient context loaded.", "context");

    // 2. Evidence
    updateAgentState(1, "Running");
    pushTrace("Routing multimodal evidence to specialized analyzers.", "evidence");
    await new Promise(r => setTimeout(r, 800));
    pushTrace("3 evidence items processed (Vitals, ECG, Voice note).", "evidence");
    await new Promise(r => setTimeout(r, 1500));
    updateAgentState(1, "Completed");

    // 3. Clinical Reasoning
    updateAgentState(2, "Running");
    pushTrace("Generating differential diagnoses using clinical guidelines.", "reasoning");
    await new Promise(r => setTimeout(r, 2000));
    updateAgentState(2, "Completed");
    pushTrace("Clinical reasoning completed. Top differential identified.", "reasoning");

    // 4. Risk / Triage
    updateAgentState(3, "Running");
    pushTrace("Calculating ESI protocol constraints.", "risk");
    await new Promise(r => setTimeout(r, 1000));
    updateAgentState(3, "Completed");
    pushTrace("ESI recommendation generated (Level 2).", "risk");

    // 5. Explainability
    updateAgentState(4, "Running");
    pushTrace("Compiling decision trace and mapping supporting evidence.", "explain");
    await new Promise(r => setTimeout(r, 1000));
    updateAgentState(4, "Completed");
    pushTrace("Explainability generated.", "explain");

    onComplete();
  } catch (error) {
    pushTrace("Orchestrator encountered a critical failure.");
  }
};

import { KnowledgeSource, KnowledgeConcept } from "@/types/knowledge";
import { isMockMode, apiClient } from "./client";

export const retrieveClinicalKnowledgeMock = async (query: string): Promise<{
  sources: KnowledgeSource[],
  concepts: KnowledgeConcept[]
}> => {
  if (!isMockMode()) {
    try {
      const response = await apiClient<{ results: any[] }>('/api/rag/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 5 })
      });
      
      const mappedSources: KnowledgeSource[] = response.results.map((r, i) => ({
        id: `SRC-REAL-${i}`,
        title: r.title,
        type: "Clinical Guideline",
        organization: r.section,
        updatedAt: new Date().toISOString().split('T')[0],
        relevanceScore: Math.round(r.score * 100),
        snippet: r.content
      }));
      
      const concepts: KnowledgeConcept[] = [
        {
          id: "NODE-1",
          label: query.length > 20 ? query.substring(0, 20) + "..." : query,
          type: "Patient Finding",
          connections: mappedSources.map((_, i) => ({ targetId: `NODE-SRC-${i}`, relationship: "supported by" }))
        },
        ...mappedSources.map((src, i) => ({
          id: `NODE-SRC-${i}`,
          label: src.title,
          type: "Guideline" as const,
          connections: []
        }))
      ];
      
      return { sources: mappedSources, concepts };
    } catch (e) {
      console.error("RAG retrieval failed", e);
    }
  }

  // Simulate vector database retrieval latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockSources: KnowledgeSource[] = [
    {
      id: "SRC-001",
      title: "Emergency Triage Protocol (Adult)",
      type: "Hospital Protocol",
      organization: "MedNexus General Hospital",
      updatedAt: "2026-01-15",
      relevanceScore: 94,
      snippet: "Patients presenting with chest pain radiating to the left arm must be assigned ESI Level 2 or higher and immediately receive an ECG within 10 minutes of arrival."
    },
    {
      id: "SRC-002",
      title: "Acute Coronary Syndrome Clinical Guideline",
      type: "Clinical Guideline",
      organization: "American College of Cardiology",
      updatedAt: "2025-11-20",
      relevanceScore: 91,
      snippet: "Initial evaluation of suspected ACS should prioritize identification of STEMI. Administer aspirin 162-325mg non-enteric coated to be chewed, unless contraindicated."
    },
    {
      id: "SRC-003",
      title: "Tachycardia Management Policy",
      type: "Hospital Protocol",
      organization: "Emergency Department",
      updatedAt: "2023-04-10",
      relevanceScore: 87,
      snippet: "For heart rates exceeding 140 bpm, assess for hemodynamic instability. If stable, consider vagal maneuvers or adenosine.",
      isOutdated: true,
      hasConflict: true
    }
  ];

  const mockConcepts: KnowledgeConcept[] = [
    {
      id: "NODE-1",
      label: "Chest Pain",
      type: "Patient Finding",
      connections: [
        { targetId: "NODE-2", relationship: "related to" },
        { targetId: "NODE-3", relationship: "supported by" }
      ]
    },
    {
      id: "NODE-2",
      label: "Acute Coronary Syndrome",
      type: "Condition",
      connections: [
        { targetId: "NODE-4", relationship: "associated with" }
      ]
    },
    {
      id: "NODE-3",
      label: "Emergency Triage Protocol",
      type: "Guideline",
      connections: []
    },
    {
      id: "NODE-4",
      label: "Cardiac Arrhythmia",
      type: "Risk Factor",
      connections: []
    }
  ];

  return { sources: mockSources, concepts: mockConcepts };
};

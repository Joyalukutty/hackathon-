export type SourceType = "Clinical Guideline" | "Hospital Protocol" | "Medical Reference" | "Drug Information";

export interface KnowledgeSource {
  id: string;
  title: string;
  type: SourceType;
  organization?: string;
  updatedAt?: string;
  relevanceScore: number;
  snippet: string;
  isOutdated?: boolean;
  hasConflict?: boolean;
}

export interface Citation {
  id: string;
  sourceId: string;
  referenceText: string;
}

export interface KnowledgeConcept {
  id: string;
  label: string;
  type: "Patient Finding" | "Condition" | "Guideline" | "Risk Factor";
  connections: {
    targetId: string;
    relationship: "related to" | "supported by" | "associated with";
  }[];
}

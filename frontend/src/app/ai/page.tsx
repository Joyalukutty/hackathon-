"use client";

import { useState, useEffect } from "react";
import { AgentNode, TraceEvent, HumanReviewAction } from "@/types/ai";
import { AIDecision } from "@/types";
import { simulateAgentOrchestration } from "@/lib/api/ai";
import { MOCK_PATIENTS, MOCK_AI_DECISION } from "@/mock/data";
import { AgentPipeline } from "@/components/ai/AgentPipeline";
import { DecisionTrace } from "@/components/ai/DecisionTrace";
import { ExplainabilityPanel } from "@/components/ai/ExplainabilityPanel";
import { ClinicianReview } from "@/components/ai/ClinicianReview";
import { KnowledgePanel } from "@/components/rag/KnowledgePanel";
import { ConfidenceMeter } from "@/components/dashboard/ConfidenceMeter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldAlert, Cpu } from "lucide-react";

export default function AIPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [agents, setAgents] = useState<AgentNode[]>([]);
  const [trace, setTrace] = useState<TraceEvent[]>([]);
  const [decision, setDecision] = useState<AIDecision | undefined>(undefined);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setIsComplete(false);
    setTrace([]);
    setDecision(undefined);

    await simulateAgentOrchestration(
      (updatedAgents) => setAgents(updatedAgents),
      (newEvent) => setTrace(prev => [...prev, newEvent]),
      () => {
        setIsAnalyzing(false);
        setIsComplete(true);
        setDecision(MOCK_AI_DECISION);
      }
    );
  };

  const handleReviewSubmit = (action: HumanReviewAction) => {
    console.log("Clinician Review Submitted:", action);
    if (action.action === "Reassess") {
      startAnalysis();
    }
  };

  const activePatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Cpu className="h-8 w-8 text-primary" /> AI Command Center
          </h1>
          <p className="text-muted-foreground">Monitor multi-agent clinical decision support pipelines.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Patient:</label>
            <select 
              className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              disabled={isAnalyzing}
            >
              {MOCK_PATIENTS.map(p => (
                <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={startAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Start Analysis"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* LEFT COLUMN: Agent Pipeline */}
        <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">Agent Pipeline</h2>
            {agents.length === 0 && !isAnalyzing && !isComplete ? (
              <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed border-border rounded-xl">
                Select a patient and start analysis.
              </div>
            ) : (
              <AgentPipeline agents={agents} />
            )}
          </div>
          
          <div className="h-64">
            <DecisionTrace trace={trace} />
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Reasoning & Review */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Clinical Decision Support</h2>
          
          {isComplete && decision ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Primary Finding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-destructive mb-4">{decision.primaryDiagnosis}</p>
                    <ConfidenceMeter confidence={decision.confidence} />
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {decision.immediateActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <ExplainabilityPanel decision={decision} />

              <div className="mt-8">
                <KnowledgePanel />
              </div>

              <ClinicianReview onReviewSubmit={handleReviewSubmit} />
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-border rounded-xl bg-card/30 p-8">
               <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
               <p className="text-lg font-medium">Awaiting Analysis</p>
               <p className="text-sm text-muted-foreground max-w-sm mt-2">
                 The AI Command Center requires execution of the multi-agent pipeline to generate clinical decision support.
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

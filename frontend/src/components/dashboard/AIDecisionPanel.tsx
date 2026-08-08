"use client";

import { AIDecision } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, AlertTriangle, ChevronDown, ActivitySquare } from "lucide-react";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AIDecisionPanelProps {
  decision: AIDecision;
  className?: string;
}

export function AIDecisionPanel({ decision, className }: AIDecisionPanelProps) {
  const { toast } = useToast();

  const handleEscalate = () => {
    toast({
      title: "Escalated to Clinician",
      description: "Priority alert sent to the on-call attending physician.",
      variant: "destructive",
    });
  };

  return (
    <Card className={`border-border bg-card/80 flex flex-col ${className}`}>
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            AI Clinical Decision
          </div>
          <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive px-2.5 py-1 rounded-md text-sm font-bold border border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            ESI Level 1
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="p-4 border-b border-border/50 flex flex-col md:flex-row gap-6 items-center">
          <ConfidenceMeter confidence={decision.confidence} />
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Primary Diagnosis</h3>
              <p className="text-xl font-bold text-foreground">{decision.primaryDiagnosis}</p>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ActivitySquare className="h-3.5 w-3.5" /> Immediate Actions
              </h3>
              <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                {decision.immediateActions.map((action, i) => (
                  <li key={i} className="text-destructive font-medium">{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Why this decision?</h3>
            <p className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-3 rounded-lg border border-border/50">
              {decision.reasoning}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Differential Diagnoses</h3>
            <div className="flex flex-wrap gap-2">
              {decision.differentialDiagnoses.map((dx, i) => (
                <div key={i} className="bg-secondary/50 border border-border px-2.5 py-1 rounded-md text-sm">
                  {dx}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="p-4 border-t border-border/50 bg-muted/10 mt-auto">
        <Button 
          variant="destructive" 
          className="w-full font-bold h-12 shadow-sm shadow-destructive/20"
          onClick={handleEscalate}
        >
          ESCALATE TO CLINICIAN
        </Button>
      </div>
    </Card>
  );
}

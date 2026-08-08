import { AIDecision } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertTriangle, ShieldCheck } from "lucide-react";

interface ExplainabilityPanelProps {
  decision?: AIDecision;
}

export function ExplainabilityPanel({ decision }: ExplainabilityPanelProps) {
  if (!decision) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Decision Rationale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{decision.reasoning}</p>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Supporting Evidence Used</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-safe" />
                Patient vital signs
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-safe" />
                Uploaded ECG report
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-warning/5 border-warning/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Clinical Safeguard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This AI-generated assessment is for decision support only. It does not replace professional clinical judgment. 
            All findings must be verified by a qualified healthcare professional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

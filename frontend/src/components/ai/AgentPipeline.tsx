import { AgentNode } from "@/types/ai";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Loader2, XCircle, ChevronDown } from "lucide-react";

interface AgentPipelineProps {
  agents: AgentNode[];
}

export function AgentPipeline({ agents }: AgentPipelineProps) {
  const getStatusIcon = (status: AgentNode["status"]) => {
    switch (status) {
      case "Completed": return <CheckCircle2 className="h-5 w-5 text-safe" />;
      case "Running": return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "Failed": return <XCircle className="h-5 w-5 text-destructive" />;
      case "Waiting":
      case "Skipped": return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-2">
      {agents.map((agent, index) => (
        <div key={agent.id} className="relative">
          {index > 0 && (
            <div className="absolute left-6 -top-2 w-0.5 h-4 bg-border" />
          )}
          <Card className={`border-border transition-colors ${agent.status === 'Running' ? 'bg-primary/5 border-primary/30' : 'bg-card/50'}`}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6">
                  {getStatusIcon(agent.status)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{agent.name}</h4>
                  <p className="text-xs text-muted-foreground">{agent.status}</p>
                </div>
              </div>
              {agent.durationMs && (
                <span className="text-xs text-muted-foreground font-mono">{agent.durationMs}ms</span>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

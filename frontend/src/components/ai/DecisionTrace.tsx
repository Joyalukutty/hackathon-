import { TraceEvent } from "@/types/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

interface DecisionTraceProps {
  trace: TraceEvent[];
}

export function DecisionTrace({ trace }: DecisionTraceProps) {
  return (
    <div className="flex flex-col h-full bg-card/30 border border-border rounded-xl">
      <div className="p-4 border-b border-border bg-muted/20">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Decision Trace
        </h3>
        <p className="text-xs text-muted-foreground mt-1">Real-time audit log of multi-agent execution</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {trace.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Analysis not started.
            </div>
          ) : (
            trace.map((event, i) => (
              <div key={event.id} className="relative pl-4 border-l-2 border-border/50 pb-4 last:pb-0 last:border-transparent">
                <div className="absolute -left-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                <span className="text-xs font-mono text-muted-foreground block mb-1">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
                  {event.agentId && <span className="ml-2 text-primary">[{event.agentId}]</span>}
                </span>
                <p className="text-sm">{event.message}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

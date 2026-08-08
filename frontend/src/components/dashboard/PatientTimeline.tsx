import { TimelineEvent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Stethoscope, TestTube, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientTimelineProps {
  timeline: TimelineEvent[];
}

export function PatientTimeline({ timeline }: PatientTimelineProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "lab": return <TestTube className="h-4 w-4" />;
      case "medication": return <Stethoscope className="h-4 w-4" />;
      case "vitals": return <Activity className="h-4 w-4" />;
      case "note":
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "lab": return "bg-primary/20 text-primary border-primary/30";
      case "medication": return "bg-warning/20 text-warning border-warning/30";
      case "vitals": return "bg-safe/20 text-safe border-safe/30";
      case "note":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="border-border bg-card/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Clinical Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-border ml-3 space-y-6 pb-2">
          {timeline.map((event, index) => (
            <div key={event.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div 
                className={cn(
                  "absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-background",
                  getEventColor(event.type)
                )}
              >
                {getEventIcon(event.type)}
              </div>
              
              {/* Event Content */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground mb-1">
                  {event.time}
                </span>
                <h4 className="text-sm font-semibold text-foreground mb-0.5">
                  {event.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

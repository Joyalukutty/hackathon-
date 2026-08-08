import { Badge } from "@/components/ui/badge";
import { Severity } from "@/types";
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = {
    critical: {
      color: "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30",
      icon: AlertTriangle,
      label: "CRITICAL",
    },
    warning: {
      color: "bg-warning/15 text-warning hover:bg-warning/25 border-warning/30",
      icon: AlertCircle,
      label: "HIGH",
    },
    normal: {
      color: "bg-primary/15 text-primary hover:bg-primary/25 border-primary/30",
      icon: Info,
      label: "MODERATE",
    },
    safe: {
      color: "bg-safe/15 text-safe hover:bg-safe/25 border-safe/30",
      icon: CheckCircle2,
      label: "LOW",
    },
  };

  const { color, icon: Icon, label } = config[severity];

  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center gap-1.5 font-semibold px-2.5 py-0.5", color, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

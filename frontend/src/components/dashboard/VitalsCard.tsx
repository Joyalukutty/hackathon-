import { Vitals } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Wind } from "lucide-react";

interface VitalsCardProps {
  vitals: Vitals;
}

export function VitalsCard({ vitals }: VitalsCardProps) {
  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Current Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Heart className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium uppercase tracking-wider">Heart Rate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{vitals.heartRate}</span>
              <span className="text-xs text-muted-foreground font-medium">bpm</span>
            </div>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider">Blood Pressure</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{vitals.bloodPressure}</span>
              <span className="text-xs text-muted-foreground font-medium">mmHg</span>
            </div>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wind className="h-4 w-4 text-safe" />
              <span className="text-xs font-medium uppercase tracking-wider">SpO₂</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{vitals.oxygenLevel}</span>
              <span className="text-xs text-muted-foreground font-medium">%</span>
            </div>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Thermometer className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium uppercase tracking-wider">Temperature</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{vitals.temperature}</span>
              <span className="text-xs text-muted-foreground font-medium">°C</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

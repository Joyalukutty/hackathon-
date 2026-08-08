import { Patient } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SeverityBadge } from "./SeverityBadge";
import { User, Activity, Clock } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  isSelected?: boolean;
  onClick?: (patient: Patient) => void;
}

export function PatientCard({ patient, isSelected, onClick }: PatientCardProps) {
  return (
    <Card 
      className={`border-border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer ${
        isSelected ? 'border-primary/50 ring-1 ring-primary/50 bg-card/80' : ''
      }`}
      onClick={() => onClick && onClick(patient)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center border border-border">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{patient.name}</h3>
              <p className="text-xs text-muted-foreground">{patient.id} • {patient.age}{patient.gender[0]}</p>
            </div>
          </div>
          <SeverityBadge severity={patient.severity} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span className="truncate">{patient.diagnosis || "Pending Diagnosis"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Room {patient.room}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Patient } from "@/types";
import { PatientCard } from "./PatientCard";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PatientQueueProps {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient: (patient: Patient) => void;
}

export function PatientQueue({ patients, selectedPatientId, onSelectPatient }: PatientQueueProps) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Patient Queue</h2>
          <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
            {patients.length} Active
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="pl-9 h-9 text-sm bg-muted/50 border-border/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-border/50 bg-muted/50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              isSelected={patient.id === selectedPatientId}
              onClick={onSelectPatient}
            />
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            No patients found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

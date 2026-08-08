"use client";

import { useEffect, useState, use } from "react";
import { getPatientById } from "@/lib/api/patients";
import { Patient, TimelineEvent, AIDecision } from "@/types";
import { ApiClientError } from "@/lib/api/client";

import { SeverityBadge } from "@/components/dashboard/SeverityBadge";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
import { PatientTimeline } from "@/components/dashboard/PatientTimeline";
import { AIDecisionPanel } from "@/components/dashboard/AIDecisionPanel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Activity, Clock, FileText, ImageIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientPage({ params }: PatientPageProps) {
  const unwrappedParams = use(params);
  const patientId = unwrappedParams.id;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [aiDecision, setAiDecision] = useState<AIDecision | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchPatient = async () => {
    setLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      const data = await getPatientById(patientId);
      setPatient(data.patient);
      setTimeline(data.timeline);
      setAiDecision(data.aiDecision);
    } catch (err: any) {
      if (err instanceof ApiClientError && err.status === 404) {
        setIsNotFound(true);
      } else {
        setError(err.message || "Failed to load patient data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-6" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
          </div>
          <div className="space-y-6">
            <div className="h-80 w-full bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Patient not found</h2>
        <p className="text-muted-foreground mb-6">The requested patient could not be located in the system.</p>
        <Link href="/dashboard" className={buttonVariants()}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (error || !patient || !aiDecision) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-destructive">Error Loading Data</h2>
        <p className="text-muted-foreground mb-6">{error || "An unknown error occurred"}</p>
        <div className="flex gap-4">
          <Button onClick={fetchPatient}>Retry</Button>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
      {/* Back Navigation */}
      <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2 -ml-3 text-muted-foreground hover:text-foreground" })}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Link>

      {/* Patient Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">{patient.name}</h1>
            <SeverityBadge severity={patient.severity} className="text-base px-3 py-1" />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium"><User className="h-4 w-4" /> {patient.id}</span>
            <span>{patient.age} years old, {patient.gender}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Room {patient.room}</span>
            <span>Admitted: {new Date(patient.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <VitalsCard vitals={patient.vitals} />
          
          {/* Patient Information */}
          <Card className="border-border bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Clinical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground block mb-1">Chief Complaint / Diagnosis</span>
                <p className="text-base font-medium">{patient.diagnosis}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-md border border-border">
                  <span className="font-semibold text-muted-foreground block mb-1">Allergies</span>
                  <p>No known drug allergies</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md border border-border">
                  <span className="font-semibold text-muted-foreground block mb-1">Current Medications</span>
                  <p>Aspirin 81mg daily</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Summary */}
          <Card className="border-border bg-card/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Clinical Evidence
              </CardTitle>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">3 items</span>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-safe" />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Initial ECG report</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-safe" />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Complete Blood Count (CBC)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-safe" />
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Chest X-Ray</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">View Evidence Center →</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AIDecisionPanel decision={aiDecision} />
          <PatientTimeline timeline={timeline} />
        </div>
      </div>
    </div>
  );
}

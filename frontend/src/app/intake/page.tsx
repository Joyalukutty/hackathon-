"use client";

import { useState } from "react";
import { submitTriageIntake, TriageResult } from "@/lib/api/triage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckCircle2,
  User,
  Activity,
  AlertTriangle,
  FileText,
  Upload,
  Cpu,
  Cloud,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function IntakePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    patientId: "",
    chiefComplaint: "",
    onset: "",
    clinicalNotes: "",
    heartRate: "",
    bloodPressure: "",
    spo2: "",
    temperature: "",
  });

  // Multimodal File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitTriageIntake({
        patient_id: formData.patientId || `PT-${Math.floor(100 + Math.random() * 900)}`,
        demographics: {
          full_name: formData.fullName,
          date_of_birth: formData.dob,
          gender: formData.gender,
        },
        symptoms: `${formData.chiefComplaint}. Onset: ${formData.onset}. Notes: ${formData.clinicalNotes}`,
        vitals: {
          heart_rate: formData.heartRate ? Number(formData.heartRate) : undefined,
          blood_pressure: formData.bloodPressure,
          spo2: formData.spo2 ? Number(formData.spo2) : undefined,
          temperature: formData.temperature ? Number(formData.temperature) : undefined,
        },
        image_file: imageFile,
        audio_file: audioFile,
      });

      setTriageResult(result);
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to process AI clinical triage.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setTriageResult(null);
    setSubmitError(null);
    setImageFile(null);
    setAudioFile(null);
    setFormData({
      fullName: "",
      dob: "",
      gender: "",
      patientId: "",
      chiefComplaint: "",
      onset: "",
      clinicalNotes: "",
      heartRate: "",
      bloodPressure: "",
      spo2: "",
      temperature: "",
    });
  };

  // Helper for ESI badge colors
  const getEsiBadgeStyle = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-600 text-white animate-pulse border-red-700";
      case 2:
        return "bg-orange-500 text-white border-orange-600";
      case 3:
        return "bg-yellow-500 text-black border-yellow-600";
      default:
        return "bg-emerald-600 text-white border-emerald-700";
    }
  };

  // SUCCESS / TRIAGE DASHBOARD RESULT VIEW
  if (isSuccess && triageResult) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <h1 className="text-2xl font-bold">Clinical AI Assessment Complete</h1>
              <p className="text-sm text-muted-foreground">
                Patient Record ID: <span className="font-mono text-primary">{triageResult.patient_id}</span>
              </p>
            </div>
          </div>

          {/* Execution Mode Badge (Cloud vs Local GPU) */}
          <div className="flex items-center">
            {triageResult.execution_mode === "CLOUD_GEMINI" ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Cloud className="w-3.5 h-3.5 mr-1.5" />
                Cloud Gemini 2.5 Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Cpu className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                Local RTX GPU Failsafe Active
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ESI Priority Banner */}
          <Card className="md:col-span-1 bg-card/60 border-border shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardDescription>Emergency Severity Index</CardDescription>
              <div className="mt-2 flex justify-center">
                <span
                  className={`px-6 py-2 rounded-xl text-2xl font-black border shadow-md ${getEsiBadgeStyle(
                    triageResult.esi_level
                  )}`}
                >
                  ESI Level {triageResult.esi_level}
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-2 pt-2">
              <h3 className="text-lg font-bold">{triageResult.triage_category} Urgency</h3>
              <p className="text-xs text-muted-foreground">
                Confidence Score: {(triageResult.confidence_score * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>

          {/* Extracted Symptoms & OCR */}
          <Card className="md:col-span-2 bg-card/60 border-border shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Clinical Telemetry & Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {triageResult.extracted_symptoms?.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                  >
                    • {symptom}
                  </span>
                ))}
              </div>

              {triageResult.image_ocr_findings && (
                <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs">
                  <span className="font-semibold text-primary block mb-1">
                    🖼️ Image / Prescription Findings:
                  </span>
                  <p className="text-muted-foreground">{triageResult.image_ocr_findings}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Differential Diagnoses & Clinical Reasoning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/60 border-border">
            <CardHeader>
              <CardTitle className="text-base">Differential Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {triageResult.differential_diagnosis?.map((diag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background border border-border flex justify-between items-center text-sm"
                >
                  <span className="font-medium">{diag.condition}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    {diag.probability}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border">
            <CardHeader>
              <CardTitle className="text-base">Clinical Reasoning Trace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <ul className="space-y-2 bg-background p-4 rounded-lg border border-border">
                {triageResult.clinical_reasoning_trace?.map((trace, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{trace}</span>
                  </li>
                ))}
              </ul>

              {triageResult.counterfactual_analysis && (
                <div className="p-3 mt-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  <strong className="block mb-1">💡 Counterfactual Analysis:</strong>
                  {triageResult.counterfactual_analysis}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={resetForm} className="space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Start New Intake</span>
          </Button>
        </div>
      </div>
    );
  }

  // INTAKE STEPPER FORM VIEW
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Patient Intake</h1>
        <p className="text-muted-foreground">Enter clinical information for initial triage and assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stepper Navigation */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`w-full text-left p-3 rounded-md text-sm font-medium transition-colors ${
              step === 1 ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <User className="inline-block w-4 h-4 mr-2" /> 1. Demographics
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`w-full text-left p-3 rounded-md text-sm font-medium transition-colors ${
              step === 2 ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <AlertTriangle className="inline-block w-4 h-4 mr-2" /> 2. Symptoms & Files
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`w-full text-left p-3 rounded-md text-sm font-medium transition-colors ${
              step === 3 ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <Activity className="inline-block w-4 h-4 mr-2" /> 3. Vital Signs
          </button>
          <button
            type="button"
            onClick={() => setStep(4)}
            className={`w-full text-left p-3 rounded-md text-sm font-medium transition-colors ${
              step === 4 ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <FileText className="inline-block w-4 h-4 mr-2" /> 4. Review & Submit
          </button>
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          <Card className="border-border bg-card/50">
            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep((s) => s + 1); }}>
              
              {/* STEP 1: DEMOGRAPHICS */}
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                    <CardDescription>Enter patient identity information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe"
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="">Select gender...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Patient ID (Optional)</label>
                        <Input
                          name="patientId"
                          value={formData.patientId}
                          onChange={handleInputChange}
                          placeholder="Auto-generated if blank"
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* STEP 2: SYMPTOMS & MULTIMODAL FILES */}
              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>Chief Complaint & Files</CardTitle>
                    <CardDescription>Document symptoms and upload audio/medical images.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chief Complaint</label>
                      <Input
                        name="chiefComplaint"
                        value={formData.chiefComplaint}
                        onChange={handleInputChange}
                        placeholder="e.g. Severe chest pain radiating to jaw"
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Onset</label>
                      <Input
                        name="onset"
                        value={formData.onset}
                        onChange={handleInputChange}
                        placeholder="e.g. 2 hours ago"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Clinical Notes</label>
                      <textarea
                        name="clinicalNotes"
                        value={formData.clinicalNotes}
                        onChange={handleInputChange}
                        className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Additional clinical context..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Attach Image / X-Ray / ECG
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Attach Voice Recording
                        </label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer"
                        />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* STEP 3: VITAL SIGNS */}
              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle>Vital Signs</CardTitle>
                    <CardDescription>Record initial triage vitals.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Heart Rate (bpm)</label>
                        <Input
                          type="number"
                          name="heartRate"
                          value={formData.heartRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 138"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Blood Pressure</label>
                        <Input
                          name="bloodPressure"
                          value={formData.bloodPressure}
                          onChange={handleInputChange}
                          placeholder="e.g. 150/95"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SpO2 (%)</label>
                        <Input
                          type="number"
                          name="spo2"
                          value={formData.spo2}
                          onChange={handleInputChange}
                          placeholder="e.g. 89"
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperature (°C)</label>
                        <Input
                          type="number"
                          step="0.1"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          placeholder="e.g. 37.5"
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {step === 4 && (
                <>
                  <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>Verify information before running AI triage assessment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2 text-sm">
                      <h4 className="font-semibold text-muted-foreground">Patient Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <p><span className="font-semibold">Name:</span> {formData.fullName || "N/A"}</p>
                        <p><span className="font-semibold">Complaint:</span> {formData.chiefComplaint || "N/A"}</p>
                        <p><span className="font-semibold">Heart Rate:</span> {formData.heartRate || "N/A"} bpm</p>
                        <p><span className="font-semibold">SpO2:</span> {formData.spo2 || "N/A"}%</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-400">
                      <strong>⚠️ Clinical Warning:</strong> AI-assisted clinical decision support will process this payload. This output supports but does not replace professional clinical judgment.
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        <strong>Error:</strong> {submitError}
                      </div>
                    )}
                  </CardContent>
                </>
              )}

              <CardFooter className="flex justify-between border-t border-border pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1 || isSubmitting}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Running AI Triage...</span>
                    </span>
                  ) : step === 4 ? (
                    "Submit Intake"
                  ) : (
                    "Next Step"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
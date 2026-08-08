"use client";

import { useState } from "react";
import { EvidenceUpload } from "@/components/evidence/EvidenceUpload";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { uploadEvidenceMock } from "@/lib/api/evidence";
import { Evidence } from "@/types/evidence";
import { MOCK_PATIENTS } from "@/mock/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertCircle, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EvidencePage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const handleUploadStart = async (files: File[]) => {
    for (const file of files) {
      // Determine mock category based on mime type
      let category: Evidence["category"] = "Document";
      if (file.type.startsWith("image/")) category = "Medical Image";
      else if (file.type.startsWith("audio/")) category = "Voice";
      else if (file.type === "application/pdf") category = "Lab Report";

      // Add placeholder to list
      const tempId = `TEMP-${Date.now()}`;
      const tempEvidence: Evidence = {
        id: tempId,
        patientId: selectedPatientId,
        fileName: file.name,
        fileType: file.name.split('.').pop() || "unknown",
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: "Queued",
        category
      };
      
      setEvidenceList(prev => [tempEvidence, ...prev]);

      try {
        const finalEvidence = await uploadEvidenceMock(
          file, 
          selectedPatientId, 
          category,
          (progress) => {
            // In a real app we'd track progress per file ID in a separate state, 
            // for the hackathon we just rely on the text status updates.
          },
          (status) => {
            setEvidenceList(prev => prev.map(e => e.id === tempId ? { ...e, status } : e));
          }
        );
        
        // Replace temp with final
        setEvidenceList(prev => prev.map(e => e.id === tempId ? finalEvidence : e));
      } catch (error) {
        setEvidenceList(prev => prev.map(e => e.id === tempId ? { ...e, status: "Failed", error: "Upload failed." } : e));
      }
    }
  };

  const activePatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence Center</h1>
          <p className="text-muted-foreground">Upload and analyze multimodal clinical evidence.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Patient:</label>
          <select 
            className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            {MOCK_PATIENTS.map(p => (
              <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Upload & Summary */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2">
          <EvidenceUpload onUploadStart={handleUploadStart} />
          
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Evidence Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Total Items</span>
                <span className="font-bold">{evidenceList.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-safe/10 text-safe rounded-lg border border-safe/20">
                <span className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Analyzed</span>
                <span className="font-bold">{evidenceList.filter(e => e.status === "Analyzed").length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <span className="text-sm font-medium flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed</span>
                <span className="font-bold">{evidenceList.filter(e => e.status === "Failed").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Evidence List & Preview */}
        <div className="w-full lg:w-2/3 flex flex-col bg-muted/10 border border-border rounded-xl overflow-hidden">
          {selectedEvidence ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border bg-card flex items-center justify-between shrink-0">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {selectedEvidence.fileName}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEvidence(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {selectedEvidence.thumbnailUrl && (
                  <div className="border border-border rounded-lg overflow-hidden bg-black/5 flex items-center justify-center max-h-[400px]">
                    {/* Safe local preview, no Base64 PHI logging */}
                    <img src={selectedEvidence.thumbnailUrl} alt="Evidence preview" className="max-w-full max-h-[400px] object-contain" />
                  </div>
                )}

                {!selectedEvidence.thumbnailUrl && selectedEvidence.mimeType.startsWith('audio/') && (
                  <div className="p-6 border border-border rounded-lg bg-card flex flex-col items-center gap-4">
                    <p className="text-muted-foreground text-sm">Audio Evidence</p>
                    <audio controls className="w-full max-w-md" />
                  </div>
                )}

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">AI-Assisted Analysis</CardTitle>
                    <CardDescription>
                      Clinical decision support only. Requires clinician review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedEvidence.analysis?.findings && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Detected Findings</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {selectedEvidence.analysis.findings.map((finding, i) => (
                            <li key={i}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedEvidence.analysis?.extractedText && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">OCR Extracted Text</h4>
                        <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap font-mono">
                          {selectedEvidence.analysis.extractedText}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full p-4">
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search uploaded evidence..." className="pl-9 bg-background" />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {evidenceList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-xl">
                    <FileText className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                    <p className="font-medium">No clinical evidence yet</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">Upload an image, PDF, or audio file to begin analysis.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evidenceList.map(evidence => (
                      <EvidenceCard 
                        key={evidence.id} 
                        evidence={evidence} 
                        onClick={setSelectedEvidence}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

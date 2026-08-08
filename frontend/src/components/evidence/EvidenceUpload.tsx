"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvidenceUploadProps {
  onUploadStart: (files: File[]) => void;
}

export function EvidenceUpload({ onUploadStart }: EvidenceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadStart(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadStart(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card/30'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept="image/*,application/pdf,audio/*" 
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Upload Clinical Evidence</h3>
          <p className="text-sm text-muted-foreground mt-1">Drag & Drop files here or select to browse</p>
        </div>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Select Files
        </Button>
        <p className="text-xs text-muted-foreground">Supported: Images, PDF, Audio (Max 10MB)</p>
      </div>
    </div>
  );
}

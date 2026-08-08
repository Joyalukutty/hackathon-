import { Evidence } from "@/types/evidence";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, FileAudio, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface EvidenceCardProps {
  evidence: Evidence;
  onClick?: (evidence: Evidence) => void;
}

export function EvidenceCard({ evidence, onClick }: EvidenceCardProps) {
  const getIcon = () => {
    switch (evidence.category) {
      case "Medical Image": return <ImageIcon className="h-5 w-5 text-primary" />;
      case "Voice": return <FileAudio className="h-5 w-5 text-primary" />;
      case "Lab Report":
      case "Prescription":
      case "Document": return <FileText className="h-5 w-5 text-primary" />;
      default: return <File className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusDisplay = () => {
    switch (evidence.status) {
      case "Analyzed":
        return <span className="flex items-center gap-1.5 text-safe text-sm"><CheckCircle2 className="h-4 w-4" /> Analysis Complete</span>;
      case "Failed":
        return <span className="flex items-center gap-1.5 text-destructive text-sm"><AlertCircle className="h-4 w-4" /> Processing Failed</span>;
      case "Queued":
      case "Uploading":
      case "Processing":
        return <span className="flex items-center gap-1.5 text-warning text-sm"><Loader2 className="h-4 w-4 animate-spin" /> {evidence.status}...</span>;
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Card className="border-border bg-card/50 hover:bg-card transition-colors">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getIcon()}
            </div>
            <div className="truncate">
              <h4 className="font-semibold text-sm truncate max-w-[150px]">{evidence.fileName}</h4>
              <p className="text-xs text-muted-foreground">{evidence.category} • {formatSize(evidence.size)}</p>
            </div>
          </div>
        </div>
        
        <div>
          {getStatusDisplay()}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          disabled={evidence.status !== "Analyzed"}
          onClick={() => onClick && onClick(evidence)}
        >
          View Evidence
        </Button>
      </CardContent>
    </Card>
  );
}

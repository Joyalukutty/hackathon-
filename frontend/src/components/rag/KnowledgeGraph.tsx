import { KnowledgeConcept } from "@/types/knowledge";
import { Activity, BookOpen, AlertTriangle, FileText, ArrowRight } from "lucide-react";

interface KnowledgeGraphProps {
  concepts: KnowledgeConcept[];
}

export function KnowledgeGraph({ concepts }: KnowledgeGraphProps) {
  // A simple SVG/CSS based visual layout demonstrating the relationships
  // without relying on heavy canvas graph libraries.

  const getIcon = (type: KnowledgeConcept["type"]) => {
    switch (type) {
      case "Condition": return <Activity className="h-4 w-4" />;
      case "Guideline": return <BookOpen className="h-4 w-4" />;
      case "Risk Factor": return <AlertTriangle className="h-4 w-4" />;
      case "Patient Finding": return <FileText className="h-4 w-4" />;
    }
  };

  const getColor = (type: KnowledgeConcept["type"]) => {
    switch (type) {
      case "Condition": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Guideline": return "bg-primary/10 text-primary border-primary/20";
      case "Risk Factor": return "bg-warning/10 text-warning border-warning/20";
      case "Patient Finding": return "bg-safe/10 text-safe border-safe/20";
    }
  };

  return (
    <div className="relative p-6 bg-card/30 border border-border rounded-xl min-h-[300px] flex items-center justify-center overflow-x-auto">
      <div className="flex items-center justify-center min-w-[500px]">
        {/* Very simplified mock representation of a connected graph for Phase 7 */}
        <div className="flex flex-col items-center gap-6 w-full max-w-lg relative">
          
          {/* Finding Layer */}
          <div className="w-full flex justify-around">
             {concepts.filter(c => c.type === "Patient Finding").map(c => (
               <div key={c.id} className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium ${getColor(c.type)}`}>
                 {getIcon(c.type)}
                 {c.label}
               </div>
             ))}
          </div>

          <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />

          {/* Condition Layer */}
          <div className="w-full flex justify-center">
             {concepts.filter(c => c.type === "Condition").map(c => (
               <div key={c.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-sm border-2 text-sm font-bold ${getColor(c.type)}`}>
                 {getIcon(c.type)}
                 {c.label}
               </div>
             ))}
          </div>

          <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />

          {/* Guideline Layer */}
          <div className="w-full flex justify-around">
             {concepts.filter(c => c.type === "Guideline").map(c => (
               <div key={c.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm text-sm font-medium ${getColor(c.type)}`}>
                 {getIcon(c.type)}
                 {c.label}
               </div>
             ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

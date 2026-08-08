import { KnowledgeSource } from "@/types/knowledge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, Pill, Stethoscope, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeSourceCardProps {
  source: KnowledgeSource;
}

export function KnowledgeSourceCard({ source }: KnowledgeSourceCardProps) {
  const getIcon = () => {
    switch (source.type) {
      case "Clinical Guideline": return <BookOpen className="h-5 w-5 text-primary" />;
      case "Hospital Protocol": return <Stethoscope className="h-5 w-5 text-primary" />;
      case "Drug Information": return <Pill className="h-5 w-5 text-primary" />;
      case "Medical Reference": return <FileText className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="border-border bg-card/50 hover:bg-card/80 transition-colors">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              {getIcon()}
            </div>
            <div>
              <h4 className="font-semibold text-sm leading-tight">{source.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{source.type}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-semibold text-primary">{Math.round(source.relevanceScore * 100)}% Match</div>
          </div>
        </div>

        <div className="bg-muted/30 p-3 rounded-md text-sm border border-border/50 text-muted-foreground italic relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-l-md" />
          "{source.snippet}"
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-muted-foreground flex gap-2">
            {source.organization && <span>Org: {source.organization}</span>}
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-primary hover:text-primary">
            View Source <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { HumanReviewAction } from "@/types/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ShieldAlert, FileWarning } from "lucide-react";

interface ClinicianReviewProps {
  onReviewSubmit: (action: HumanReviewAction) => void;
}

export function ClinicianReview({ onReviewSubmit }: ClinicianReviewProps) {
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverride, setShowOverride] = useState(false);

  const handleSubmit = (action: HumanReviewAction["action"]) => {
    onReviewSubmit({
      action,
      reason: action === "Override" ? overrideReason : undefined,
      timestamp: new Date().toISOString(),
      clinicianId: "DR-SMITH"
    });
    if (action !== "Override") {
      setShowOverride(false);
    }
  };

  return (
    <Card className="border-border bg-card/80 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Human-in-the-loop Review</span>
          <span className="text-xs font-semibold bg-warning/20 text-warning px-2 py-1 rounded-full">Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showOverride ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-safe hover:bg-safe/90 text-white" 
              onClick={() => handleSubmit("Accept")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Accept AI Recommendation
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
              onClick={() => setShowOverride(true)}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              Override Decision
            </Button>
            <Button variant="secondary" onClick={() => handleSubmit("Reassess")}>
              Reassess
            </Button>
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
              <FileWarning className="h-5 w-5" />
              Override Required Justification
            </div>
            <Input 
              placeholder="Enter clinical reason for overriding AI recommendation..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="bg-background"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowOverride(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                disabled={overrideReason.length < 5}
                onClick={() => handleSubmit("Override")}
              >
                Confirm Override
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

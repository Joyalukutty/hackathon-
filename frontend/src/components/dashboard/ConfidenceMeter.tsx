"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  confidence: number;
}

export function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  // Determine color based on confidence level
  const getColorClass = (value: number) => {
    if (value >= 90) return "text-safe stroke-safe";
    if (value >= 75) return "text-warning stroke-warning";
    return "text-destructive stroke-destructive";
  };

  const colorClass = getColorClass(confidence);
  
  // SVG Arc calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-border"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className={cn(colorClass, "transition-colors duration-300")}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <Brain className={cn("h-6 w-6 mb-1 opacity-80", colorClass.split(" ")[0])} />
          <span className="text-2xl font-bold tracking-tight">
            {confidence}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-2">
        AI Confidence Score
      </span>
    </div>
  );
}

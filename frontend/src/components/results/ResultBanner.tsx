"use client";

import React from "react";
import { Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ResultBannerProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  category: string;
  gradeText: string;
  gradeClass: string;
  onReturn: () => void;
}

export function ResultBanner({
  score,
  totalQuestions,
  percentage,
  category,
  gradeText,
  gradeClass,
  onReturn,
}: ResultBannerProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-16 pb-12 border-b border-border">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-foreground" />
          <h1 className="text-xl font-medium tracking-tight">
            Session Complete
          </h1>
          <span
            className={`px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded border ${gradeClass}`}
          >
            {gradeText}
          </span>
        </div>
        <p className="text-muted text-sm max-w-sm leading-relaxed mb-6">
          Great job! Your performance in{" "}
          <span className="text-foreground tracking-widest font-semibold uppercase">
            {category?.replace(/_/g, " ") || "General"}
          </span>{" "}
          has been recorded and your score is now on the leaderboard.
        </p>
        <Button onClick={onReturn} className="gap-2 shrink-0">
          <RotateCcw className="w-4 h-4" />
          Return to Dashboard
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col p-6 rounded bg-secondary/50 border border-border min-w-[120px]">
          <span className="text-muted text-xs font-medium uppercase tracking-widest mb-1">
            Score
          </span>
          <span
            className={`text-4xl font-semibold tracking-tighter ${percentage >= 50 ? "text-foreground" : "text-danger"}`}
          >
            {score}
            <span className="text-lg text-muted">/{totalQuestions}</span>
          </span>
        </div>
        <div className="flex flex-col p-6 rounded bg-secondary/50 border border-border min-w-[120px]">
          <span className="text-muted text-xs font-medium uppercase tracking-widest mb-1">
            Accuracy
          </span>
          <span
            className={`text-4xl font-semibold tracking-tighter ${percentage >= 50 ? "text-foreground" : "text-danger"}`}
          >
            {percentage}
            <span className="text-lg text-muted">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

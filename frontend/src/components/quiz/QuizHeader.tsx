"use client";

import React from "react";
import { TimerReset } from "lucide-react";

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
}

export function QuizHeader({
  currentIndex,
  totalQuestions,
  timeLeft,
}: QuizHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-foreground tracking-widest uppercase">
          {currentIndex + 1} / {totalQuestions}
        </div>
        <div className="w-px h-3 bg-border" />
      </div>

      <div
        className={`flex items-center gap-1.5 font-mono text-sm font-medium px-3 py-1.5 rounded border transition-colors ${
          timeLeft <= 5
            ? "text-danger border-danger/30 bg-danger/5"
            : "text-foreground border-border bg-background"
        }`}
      >
        <TimerReset className="w-3.5 h-3.5" />
        00:{timeLeft.toString().padStart(2, "0")}
      </div>
    </header>
  );
}

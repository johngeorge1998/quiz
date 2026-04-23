"use client";

import React from "react";

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (opt: string) => void;
}

export function QuestionDisplay({
  question,
  options,
  selectedOption,
  onSelect,
}: QuestionDisplayProps) {
  return (
    <div className="flex-grow flex flex-col justify-center">
      <h2 className="text-xl md:text-2xl font-semibold leading-relaxed mb-10 text-foreground tracking-tight">
        {question}
      </h2>

      <div className="grid grid-cols-1 gap-3 mb-10">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt)}
            className={`px-5 py-4 text-left rounded text-sm transition-all focus:outline-none focus-visible:border-foreground border cursor-pointer ${
              selectedOption === opt
                ? "border-foreground bg-secondary text-foreground font-medium shadow-sm"
                : "border-border bg-background hover:bg-secondary/50 text-foreground hover:border-border-hover"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

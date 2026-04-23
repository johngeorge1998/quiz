"use client";

interface QuizProgressProps {
  progress: number;
}

export function QuizProgress({ progress }: QuizProgressProps) {
  return (
    <div className="w-full h-[2px] bg-border rounded-full mb-12 overflow-hidden">
      <div
        className="h-full bg-foreground transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

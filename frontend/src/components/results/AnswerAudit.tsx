'use client';

import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { GeistMono } from 'geist/font/mono';

interface Question {
  id: string;
  question: string;
  correctAnswer: string;
}

interface AnswerAuditProps {
  questions: Question[];
  userAnswers: Record<string, string>;
}

export function AnswerAudit({ questions, userAnswers }: AnswerAuditProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-sm font-semibold tracking-tight text-foreground">Diagnostic Log</h2>
      </div>

      <div className="rounded border border-border overflow-hidden bg-background">
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-4 p-4 border-b border-border bg-secondary/30">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted w-8 text-center">#</div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">Question Details</div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">Evaluation Match</div>
        </div>
        
        <div className="divide-y divide-border">
          {questions.map((q, i) => {
            const uA = userAnswers[q.id];
            const isCorrect = uA === q.correctAnswer;
            const isUnanswered = uA === 'Unanswered' || uA === null;

            return (
              <div key={q.id} className="group p-4 md:p-0 md:grid grid-cols-[auto_1fr_1fr] gap-4 items-stretch hover:bg-secondary/20 transition-colors">
                
                <div className="hidden md:flex items-center justify-center p-4 border-r border-border text-xs text-muted font-medium tabular-nums w-12 bg-secondary/10">
                  {(i + 1).toString().padStart(2, '0')}
                </div>

                <div className="py-2 md:py-4 md:pr-4 flex flex-col justify-center mb-3 md:mb-0">
                  <span className="md:hidden text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">Question {(i + 1)}</span>
                  <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>
                </div>

                <div className="py-2 md:py-4 md:pr-4 flex flex-col justify-center space-y-3">
                  <div>
                     <span className="text-[10px] uppercase tracking-widest text-muted font-medium block mb-1">Your Output</span>
                     <div className="flex items-start gap-2">
                       <div className="mt-0.5">
                         {isCorrect ? (
                           <Check className="w-3.5 h-3.5 text-success" />
                         ) : isUnanswered ? (
                           <AlertCircle className="w-3.5 h-3.5 text-warning" />
                         ) : (
                           <X className="w-3.5 h-3.5 text-danger" />
                         )}
                       </div>
                       <span className={`${GeistMono.className} text-xs ${
                         isCorrect ? 'text-success font-medium' : 
                         isUnanswered ? 'text-warning' : 'text-danger font-medium'
                       }`}>
                         {isUnanswered ? 'ERR_TIMEOUT' : uA}
                       </span>
                     </div>
                  </div>

                  {!isCorrect && (
                    <div className="pl-5 border-l-2 border-border ml-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-medium block mb-1">Expected Match</span>
                      <span className={`${GeistMono.className} text-xs text-foreground font-medium`}>
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

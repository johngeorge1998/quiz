"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "sonner";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizLoading } from "@/components/quiz/QuizLoading";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Question {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  options?: string[];
}

const TRIVIA_API_URL =
  process.env.NEXT_PUBLIC_TRIVIA_API_URL || "https://the-trivia-api.com/api";

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const { data: questions = [], isLoading: loading } = useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const res = await fetch(
        `${TRIVIA_API_URL}/questions?categories=${id}&limit=15`,
      );
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      return data.map((q: Question) => ({
        ...q,
        options: [...q.incorrectAnswers, q.correctAnswer].sort(
          () => Math.random() - 0.5,
        ),
      })) as Question[];
    },
    staleTime: Infinity,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, questions]);

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt);
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: selectedOption || "Unanswered",
    };

    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      finalizeQuiz(newAnswers);
    }
  };

  const finalizeQuiz = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    const correctCount = questions.reduce((acc, q) => {
      return finalAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
    }, 0);

    const payload = {
      score: correctCount,
      totalQuestions: questions.length,
      questions,
      userAnswers: finalAnswers,
      category: id,
    };

    try {
      const res = await api.post("/quiz/submit", {
        score: correctCount,
        totalQuestions: questions.length,
        category: id,
      });
      toast.success(res.data.message || "Score saved!");
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    } catch (err: any) {
      console.error("[Quiz Service]: Submission failure", err);
      toast.error(err.response?.data?.message || "Failed to save score");
    } finally {
      setIsSubmitting(false);
    }

    sessionStorage.setItem("quizResult", JSON.stringify(payload));
    router.push("/results");
  };

  const handleReset = () => {
    router.push("/categories");
  };

  if (loading) {
    return <QuizLoading />;
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <p className="text-foreground text-sm mb-4">
          Failed to initialize session. Upstream API may be unavailable.
        </p>
        <Button onClick={handleReset} variant="outline">
          Exit
        </Button>
      </div>
    );
  }

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="min-h-screen py-10 px-6 max-w-2xl mx-auto flex flex-col bg-background selection:bg-primary selection:text-primary-foreground cursor-default">
      <QuizHeader
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
      />

      <QuizProgress progress={progress} />

      <QuestionDisplay
        question={questions[currentIndex].question}
        options={questions[currentIndex].options || []}
        selectedOption={selectedOption}
        onSelect={handleSelectOption}
      />

      <div className="flex justify-between items-center pt-6 border-t border-border mt-auto">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="gap-1.5 text-sm min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

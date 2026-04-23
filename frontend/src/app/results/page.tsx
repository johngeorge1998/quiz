"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultBanner } from "@/components/results/ResultBanner";
import { AnswerAudit } from "@/components/results/AnswerAudit";

export default function ResultsPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("quizResult");
    if (data) {
      setResultData(JSON.parse(data));
    } else {
      router.push("/categories");
    }
  }, [router]);

  if (!resultData) return null;

  const { score, totalQuestions, questions, userAnswers, category } =
    resultData;
  const percentage = Math.round((score / totalQuestions) * 100);

  let gradeText = "";
  let gradeClass = "";

  if (percentage >= 60) {
    gradeText = "Winner!";
    gradeClass = "border-success text-success bg-success/10";
  } else if (percentage >= 40) {
    gradeText = "Better";
    gradeClass = "border-warning text-warning bg-warning/10";
  } else {
    gradeText = "Failed";
    gradeClass = "border-danger text-danger bg-danger/10";
  }

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto selection:bg-primary selection:text-primary-foreground">
      <ResultBanner
        score={score}
        totalQuestions={totalQuestions}
        percentage={percentage}
        category={category}
        gradeText={gradeText}
        gradeClass={gradeClass}
        onReturn={() => router.push("/categories")}
      />

      <AnswerAudit questions={questions} userAnswers={userAnswers} />
    </div>
  );
}

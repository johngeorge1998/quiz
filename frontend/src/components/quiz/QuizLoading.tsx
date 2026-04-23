"use client";

import React from "react";

export function QuizLoading() {
  return (
    <div className="min-h-screen py-10 px-6 max-w-2xl mx-auto flex flex-col bg-background">
      <header className="flex items-center justify-between mb-12">
        <div className="skeleton h-8 w-24 rounded" />
        <div className="skeleton h-8 w-20 rounded" />
      </header>
      <div className="w-full h-1 skeleton mb-12" />
      <div className="flex-grow">
        <div className="skeleton h-6 w-3/4 mb-3 rounded" />
        <div className="skeleton h-6 w-1/2 mb-10 rounded" />
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

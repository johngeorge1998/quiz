"use client";

import React from "react";
import { Trophy, User as UserIcon } from "lucide-react";

interface LeaderboardEntry {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  score: number;
  totalQuestions: number;
  category: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
}

export function Leaderboard({ leaderboard, isLoading }: LeaderboardProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-muted" />
        <h2 className="text-base font-medium text-muted">Leaderboard</h2>
        <div className="h-px bg-border flex-grow" />
      </div>

      <div className="vercel-panel overflow-hidden divide-y divide-border">
        {isLoading ? (
          <div className="p-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="skeleton w-5 h-5 rounded-full" />
                  <div className="skeleton w-16 h-4 rounded" />
                </div>
                <div className="skeleton w-10 h-5 rounded" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm font-medium">
            No scores available.
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry._id}
              className="flex items-center justify-between p-4 bg-background group"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted text-sm font-medium tabular-nums w-4">
                  {index + 1}.
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="bg-secondary w-6 h-6 rounded-full flex items-center justify-center border border-border">
                    <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {entry.userId?.username || "Unknown"}
                    </span>
                    <span className="text-[10px] uppercase text-muted tracking-wider mt-0.5">
                      {entry.category
                        ? entry.category.replace(/_/g, " ")
                        : "General"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold tabular-nums text-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                {entry.score}/{entry.totalQuestions}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

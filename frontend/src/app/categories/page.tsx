'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Music, Activity, Film, Landmark, Globe, FlaskConical, BookOpen, Coffee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { useQuery } from '@tanstack/react-query';

const CATEGORY_MAP = [
  { id: 'music', title: 'Music', Icon: Music },
  { id: 'sport_and_leisure', title: 'Sports', Icon: Activity },
  { id: 'film_and_tv', title: 'Film & TV', Icon: Film },
  { id: 'history', title: 'History', Icon: Landmark },
  { id: 'geography', title: 'Geography', Icon: Globe },
  { id: 'science', title: 'Science', Icon: FlaskConical },
  { id: 'arts_and_literature', title: 'Literature', Icon: BookOpen },
  { id: 'food_and_drink', title: 'Food', Icon: Coffee },
];

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

export default function CategoriesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: leaderboardData, isLoading: isLoadingScores } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/quiz/leaderboard');
      return data.data as LeaderboardEntry[];
    },
    enabled: !!user,
  });

  const leaderboard = leaderboardData || [];

  const initiateQuizSequence = (categoryId: string) => {
    router.push(`/quiz/${categoryId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-12 selection:bg-primary selection:text-[var(--color-primary-foreground)] cursor-default">
      <DashboardHeader username={user.username} onLogout={logout} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-base font-medium text-muted">Test Categories</h2>
            <div className="h-px bg-border flex-grow ml-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORY_MAP.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                title={cat.title}
                Icon={cat.Icon}
                onClick={initiateQuizSequence}
              />
            ))}
          </div>

          <div className="mt-8 vercel-panel p-6 bg-secondary/20">
            <h3 className="text-base font-semibold mb-2">Instructions</h3>
            <ul className="text-sm text-foreground space-y-1 ml-4 list-disc marker:text-muted">
              <li>Select a category above to instantly begin.</li>
              <li>You have exactly 30 seconds per question.</li>
              <li>Unanswered questions will be automatically marked incorrect upon timeout.</li>
            </ul>
          </div>
        </div>

        <div>
          <Leaderboard leaderboard={leaderboard} isLoading={isLoadingScores} />
        </div>
      </div>
    </div>
  );
}

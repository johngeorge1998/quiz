"use client";

import React from "react";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

export function DashboardHeader({ username, onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between mb-12">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded border border-border flex items-center justify-center bg-background shrink-0 shadow-sm">
          <Sparkles className="text-foreground w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quizy</h1>
          <p className="text-muted text-sm mt-0.5">Welcome, {username}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onLogout}
        className="gap-2 h-9 px-4"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </header>
  );
}

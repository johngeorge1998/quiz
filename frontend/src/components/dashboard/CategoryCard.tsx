"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  Icon: LucideIcon;
  onClick: (id: string) => void;
}

export function CategoryCard({ id, title, Icon, onClick }: CategoryCardProps) {
  return (
    <div
      className="vercel-panel p-5 flex flex-col cursor-pointer group hover:bg-secondary/50"
      onClick={() => onClick(id)}
    >
      <div className="mb-4 flex items-center justify-center w-12 h-12 rounded border border-border group-hover:scale-105 transition-transform bg-background group-hover:bg-foreground group-hover:border-foreground shadow-sm">
        <Icon className="w-5 h-5 text-muted group-hover:text-background transition-colors" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="text-muted text-xs mt-1 tracking-widest uppercase">
        15 Questions
      </p>
    </div>
  );
}

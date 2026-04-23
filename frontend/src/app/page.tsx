"use client";

import { AuthForm } from "@/components/auth";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-primary selection:text-primary-foreground">
      <AuthForm />
    </div>
  );
}

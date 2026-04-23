'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { loginSchema, registerSchema, AuthFormValues } from './auth-schema';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const { login } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    }
  });

  const { formState: { errors } } = form;

  const onSubmit = async (data: AuthFormValues) => {
    setIsPending(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email: data.email,
          password: data.password,
        });
        toast.success(res.data.message || 'Logged in successfully');
        login(res.data.data);
      } else {
        const res = await api.post('/auth/register', {
          username: data.username,
          email: data.email,
          password: data.password,
        });
        toast.success(res.data.message || 'Account created successfully');
        login(res.data.data);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] vercel-panel p-8">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="w-10 h-10 rounded bg-background flex justify-center items-center mb-4 border border-border shadow-sm">
          <Zap className="w-5 h-5 text-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
          Quizy
        </h1>
        <p className="text-muted text-sm pb-1">
          {isLogin ? 'Log in to your account' : 'Create a new account'}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Username</label>
            <Input
              {...form.register('username')}
              placeholder="John Doe"
            />
            {errors.username && (
              <p className="text-danger text-sm ml-1">{errors.username.message}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
          <Input
            {...form.register('email')}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-danger text-sm ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
          <Input
            {...form.register('password')}
            type="password"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-danger text-sm ml-1">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Confirm Password</label>
            <Input
              {...form.register('confirmPassword')}
              type="password"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-danger text-sm ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Login' : 'Sign Up')}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border text-center">
        <p className="text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              form.reset();
              setIsPending(false);
            }}
            className="text-foreground hover:underline font-medium cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}

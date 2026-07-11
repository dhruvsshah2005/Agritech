'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Leaf, Mail, Lock, Eye, EyeOff, Loader2,
  Mic, CloudSun, Sprout, TrendingUp, AlertCircle,
} from 'lucide-react';
import { useAuth } from "@/lib/auth";

/* ────────────────────────────────────────────── */
/*  Floating feature badges for the left panel    */
/* ────────────────────────────────────────────── */
const features = [
  { icon: Mic,        label: 'AI Voice Assistant' },
  { icon: CloudSun,   label: 'Weather Alerts' },
  { icon: Sprout,     label: 'Crop Guidance' },
  { icon: TrendingUp, label: 'Market Prices' },
];

export default function Login() {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  /* simple email check */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen flex">
      {/* ═══════════════════════════════════════════
          LEFT PANEL — branding + features (md+)
         ═══════════════════════════════════════════ */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] gradient-hero relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-12 -right-16 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute top-1/3 right-12 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute bottom-1/4 left-16 w-24 h-24 rounded-full border border-white/10" />

        {/* Branding */}
        <div className="relative z-10 animate-fade-in text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold tracking-tight">Kisaan Sahayak</h1>
              <p className="text-sm text-white/70">Smart Farm Assistant</p>
            </div>
          </div>

          <p className="text-white/80 text-lg leading-relaxed mb-12">
            Empowering farmers with AI-driven insights, real-time weather data, and personalized crop guidance.
          </p>

          {/* Floating feature badges */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`animate-float stagger-${i + 1} flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 hover-lift`}
              >
                <f.icon className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT PANEL — login form
         ═══════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background relative">
        {/* Subtle gradient wash at top-right for visual interest */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="w-full max-w-md animate-fade-in-up relative z-10">
          {/* Mobile-only branding */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Kisaan Sahayak</h1>
              <p className="text-xs text-muted-foreground">Smart Farm Assistant</p>
            </div>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to access your farm dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={`pl-10 premium-input h-11 ${
                      touched.email && email && !emailValid
                        ? 'border-destructive focus:border-destructive'
                        : ''
                    }`}
                    placeholder="farmer@example.com"
                    autoComplete="email"
                  />
                </div>
                {touched.email && email && !emailValid && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Enter a valid email
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className="pl-10 pr-11 premium-input h-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error display */}
              {displayError && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold hover-lift"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
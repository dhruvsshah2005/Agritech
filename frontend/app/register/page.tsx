'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Leaf, User, Phone, MapPin, Building2,
  Sprout, CalendarDays, Ruler, ArrowRight,
  ArrowLeft, Check, SkipForward, Loader2,
} from 'lucide-react';

/* ────────────────────────────────────────────── */
/*  Step definitions                              */
/* ────────────────────────────────────────────── */
const steps = [
  { id: 1, title: 'Account Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Farm Details', description: 'Tell us about your farm' },
];

const seasons = ['Kharif', 'Rabi', 'Zaid'];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    state: '',
    district: '',
    crop_name: '',
    season: '',
    area_acres: '',
    sowing_date: '',
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setDirection('forward');
    setCurrentStep(2);
  };

  const goBack = () => {
    setDirection('back');
    setCurrentStep(1);
  };

  const submit = async () => {
    setSaving(true);
    try {
      // Will connect to Supabase later
      console.log(form);
      // Simulate a brief delay so user sees confirmation
      await new Promise((r) => setTimeout(r, 600));
      router.push('/dashboard');
    } catch {
      setSaving(false);
    }
  };

  const skip = () => {
    router.push('/dashboard');
  };

  /* Progress percentage */
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ═══════════════════════════════════════════
          HERO HEADER
         ═══════════════════════════════════════════ */}
      <div className="gradient-hero relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white/[0.03] blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-14 text-center text-white animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight">Kisaan Sahayak</h1>
              <p className="text-xs text-white/60">Smart Farm Assistant</p>
            </div>
          </div>
          <p className="text-white/80 text-sm max-w-sm mx-auto">
            Complete your profile so we can personalise weather alerts, crop guidance, and market insights for you.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT (pulls up into the header)
         ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center px-4 -mt-8 pb-10">
        <div className="w-full max-w-xl animate-fade-in-up">
          {/* Glass card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* ─── Progress bar ─── */}
            <div className="h-1.5 bg-muted/40">
              <div
                className="progress-bar-fill h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* ─── Step indicators ─── */}
            <div className="flex items-center justify-center gap-8 pt-7 pb-2 px-6">
              {steps.map((s) => {
                const done = currentStep > s.id;
                const active = currentStep === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <div
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                        ${done
                          ? 'bg-primary text-primary-foreground scale-100'
                          : active
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                            : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {done ? <Check className="w-4 h-4" /> : s.id}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-sm font-semibold leading-none ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── Step content ─── */}
            <div className="p-6 sm:p-8">
              {/* Step 1 — Account Info */}
              {currentStep === 1 && (
                <div
                  key="step1"
                  className={`space-y-5 ${
                    direction === 'forward' ? 'animate-fade-in-up' : 'animate-fade-in'
                  }`}
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Full Name
                    </label>
                    <Input
                      placeholder="e.g. Ramesh Kumar"
                      value={form.full_name}
                      onChange={(e) => update('full_name', e.target.value)}
                      className="premium-input h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      Phone Number
                    </label>
                    <Input
                      placeholder="e.g. 9876543210"
                      value={form.phone_number}
                      onChange={(e) => update('phone_number', e.target.value)}
                      className="premium-input h-11"
                      type="tel"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        State
                      </label>
                      <Input
                        placeholder="e.g. Madhya Pradesh"
                        value={form.state}
                        onChange={(e) => update('state', e.target.value)}
                        className="premium-input h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        District
                      </label>
                      <Input
                        placeholder="e.g. Indore"
                        value={form.district}
                        onChange={(e) => update('district', e.target.value)}
                        className="premium-input h-11"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3">
                    <Button
                      onClick={goNext}
                      className="flex-1 h-11 text-base font-semibold hover-lift"
                    >
                      <span className="flex items-center gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={skip}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <SkipForward className="w-4 h-4 mr-1.5" />
                      Skip
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 — Farm Details */}
              {currentStep === 2 && (
                <div
                  key="step2"
                  className={`space-y-5 ${
                    direction === 'forward' ? 'animate-fade-in-up' : 'animate-fade-in'
                  }`}
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-muted-foreground" />
                      Crop Name
                    </label>
                    <Input
                      placeholder="e.g. Wheat, Rice, Soybean"
                      value={form.crop_name}
                      onChange={(e) => update('crop_name', e.target.value)}
                      className="premium-input h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                        Season
                      </label>
                      <select
                        value={form.season}
                        onChange={(e) => update('season', e.target.value)}
                        className="premium-input h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="" disabled>
                          Select season
                        </option>
                        {seasons.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
                        Area (Acres)
                      </label>
                      <Input
                        placeholder="e.g. 5"
                        type="number"
                        min={0}
                        step="0.5"
                        value={form.area_acres}
                        onChange={(e) => update('area_acres', e.target.value)}
                        className="premium-input h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                      Sowing Date
                    </label>
                    <Input
                      type="date"
                      value={form.sowing_date}
                      onChange={(e) => update('sowing_date', e.target.value)}
                      className="premium-input h-11"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3">
                    <Button
                      variant="outline"
                      onClick={goBack}
                      className="h-11 px-5 hover-lift"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Back
                    </Button>
                    <Button
                      onClick={submit}
                      disabled={saving}
                      className="flex-1 h-11 text-base font-semibold hover-lift"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Save &amp; Continue
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={skip}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      Skip for Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Link back to login */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  FileCheck,
  Bot,
  Brain,
  Award,
  ChevronRight,
  Briefcase,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const pipelineFeatures = [
    {
      step: '01',
      title: 'Seamless Onboarding',
      desc: 'Verify candidate identity and capture comprehensive profile & career telemetry in minutes.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Neural CV Screening',
      desc: 'Deep NLP parsing extracts verified competencies, comparing against technical matrix benchmarks.',
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'Adaptive Competency Quiz',
      desc: 'Timed, distraction-free technical assessment with randomized questions and live code evaluations.',
      icon: Zap,
    },
    {
      step: '04',
      title: 'Constrained AI HR Room',
      desc: 'Conversational AI recruiter strictly constrained to job-specific behavioral and architectural rubrics.',
      icon: Bot,
    },
    {
      step: '05',
      title: 'Psychological Profiling',
      desc: 'Calibrated Likert-scale assessment analyzing stress resilience, ownership, and team dynamics.',
      icon: Brain,
    },
    {
      step: '06 & 07',
      title: 'Practical & Decision Matrix',
      desc: 'Hands-on architectural case study evaluation with automated executive offer/decision generation.',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfe] flex flex-col">
      {/* Top Header */}
      <header className="border-b border-corporate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blush-500 to-blush-400 flex items-center justify-center text-white shadow-sm shadow-blush-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-corporate-900 text-base">
                NexaRecruit <span className="text-blush-500">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-corporate-400 uppercase tracking-wider">
                Corporate Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-corporate-700">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
                Apply for Roles <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-pastel-blush/60 via-white to-[#fafbfe]">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blush-200/40 via-pastel-lavender/50 to-pink-100/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <Badge variant="blush" className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blush-500 mr-1.5" />
            Autonomous Recruitment Intelligence 2.0
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-corporate-900 tracking-tight leading-[1.15]">
            Corporate Hiring, Redesigned with{' '}
            <span className="bg-gradient-to-r from-blush-600 via-blush-500 to-pink-500 bg-clip-text text-transparent">
              Precision & Empathy.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-corporate-600 max-w-2xl mx-auto leading-relaxed">
            Experience our 7-stage automated recruitment workflow: from neural CV screening and
            distraction-free competency testing to constrained AI HR interviews and real-time hiring decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard/status" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-md">
                Launch Candidate Experience <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/screening" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-sm">
                Try AI CV Screening
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/90 border border-corporate-200/80 shadow-subtle">
              <span className="text-2xl font-black text-blush-600">7</span>
              <p className="text-xs font-semibold text-corporate-800">Integrated Stages</p>
              <p className="text-[11px] text-corporate-500">End-to-end automated</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-corporate-200/80 shadow-subtle">
              <span className="text-2xl font-black text-corporate-900">94%</span>
              <p className="text-xs font-semibold text-corporate-800">Skills Accuracy</p>
              <p className="text-[11px] text-corporate-500">Semantic AI parsing</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-corporate-200/80 shadow-subtle">
              <span className="text-2xl font-black text-emerald-600">0</span>
              <p className="text-xs font-semibold text-corporate-800">Distractions</p>
              <p className="text-[11px] text-corporate-500">Pure focus quiz UX</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-corporate-200/80 shadow-subtle">
              <span className="text-2xl font-black text-purple-600">100%</span>
              <p className="text-xs font-semibold text-corporate-800">Role Constrained</p>
              <p className="text-[11px] text-corporate-500">Fair AI recruiter ethics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Stage Pipeline Visual Overview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="pastel" className="mb-2">
            The Candidate Journey
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight">
            Transparent, Objective, & Human-Centric
          </h2>
          <p className="text-xs sm:text-sm text-corporate-500 mt-2">
            Click into any stage below to explore the interactive mock interface and review state management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.step}
                className="group border border-corporate-200/80 hover:border-blush-300 transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-blush-50 group-hover:bg-blush-100/80 text-blush-600 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
                      Stage {feat.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-corporate-900 group-hover:text-blush-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-corporate-500 mt-1.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-corporate-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blush-500 text-white flex items-center justify-center text-xs font-bold">
              N
            </div>
            <span className="text-xs font-semibold text-corporate-700">
              NexaRecruit Enterprise Automated Hiring Suite
            </span>
          </div>
          <p className="text-xs text-corporate-400">
            Phase 1 UI/UX Implementation • App Router • Tailwind CSS • TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

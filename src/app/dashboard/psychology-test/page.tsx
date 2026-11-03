'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { MOCK_PSYCH_QUESTIONS } from '@/data/mockRecruitmentData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  Activity,
  Award,
  Layers,
} from 'lucide-react';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', shortLabel: 'SD', color: 'text-rose-600' },
  { value: 2, label: 'Disagree', shortLabel: 'D', color: 'text-rose-400' },
  { value: 3, label: 'Neutral', shortLabel: 'N', color: 'text-corporate-400' },
  { value: 4, label: 'Agree', shortLabel: 'A', color: 'text-emerald-500' },
  { value: 5, label: 'Strongly Agree', shortLabel: 'SA', color: 'text-emerald-600' },
];

export default function PsychologyTestPage() {
  const router = useRouter();
  const { psychAnswers, setPsychAnswer, submitPsychTest } = useRecruitment();

  const [submitted, setSubmitted] = useState(false);
  const questions = MOCK_PSYCH_QUESTIONS;

  const answeredCount = Object.keys(psychAnswers).length;
  const totalCount = questions.length;
  const progressPct = Math.round((answeredCount / totalCount) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPsychTest();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-corporate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="blush">Stage 6 of 7</Badge>
            <span className="text-xs text-corporate-400 font-medium">• Behavioral & Situational Dynamics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight mt-1">
            Psychological & Workplace Behavioral Assessment
          </h1>
          <p className="text-xs sm:text-sm text-corporate-500 mt-0.5">
            Calibrated Likert assessment evaluating constructive communication, stress resilience under deadlines, and team ownership.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pastel" className="text-xs font-semibold py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 mr-1" />
            Psychometric Validity Verified
          </Badge>
        </div>
      </div>

      {/* Progress Card */}
      <div className="rounded-2xl bg-white border border-corporate-200/80 p-4 sm:p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-corporate-600">
          <span className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blush-500" />
            Behavioral Questions Progress: {answeredCount} of {totalCount} Answered
          </span>
          <span className="text-blush-600 font-bold">{progressPct}%</span>
        </div>
        <Progress value={progressPct} />

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-corporate-100 text-[11px] text-corporate-500">
          <span className="font-semibold text-corporate-700">Rating Scale:</span>
          <div className="flex flex-wrap items-center gap-3">
            {LIKERT_OPTIONS.map((opt) => (
              <span key={opt.value} className="flex items-center gap-1 font-medium">
                <span className="font-bold text-corporate-900">[{opt.value}]</span> {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Grid / List */}
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const currentScore = psychAnswers[q.id];

              return (
                <Card
                  key={q.id}
                  className={`border transition-all duration-200 ${
                    currentScore
                      ? 'border-corporate-200/90 bg-white shadow-subtle'
                      : 'border-corporate-200/50 bg-corporate-50/30'
                  }`}
                >
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blush-600">
                            Statement {idx + 1}
                          </span>
                          <span className="text-xs text-corporate-300">•</span>
                          <Badge variant="outline" className="text-[10px] text-corporate-600">
                            {q.category}
                          </Badge>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-corporate-900 leading-relaxed">
                          &ldquo;{q.statement}&rdquo;
                        </h3>
                      </div>

                      {currentScore && (
                        <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 shrink-0">
                          <Check className="w-4 h-4" /> Selected
                        </div>
                      )}
                    </div>

                    {/* Likert Scale Radio Selector Buttons */}
                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {LIKERT_OPTIONS.map((opt) => {
                        const isChosen = currentScore === opt.value;

                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => setPsychAnswer(q.id, opt.value)}
                            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                              isChosen
                                ? 'bg-gradient-to-b from-blush-50 to-blush-100/70 border-blush-400 text-blush-950 ring-2 ring-blush-300 shadow-xs'
                                : 'bg-white hover:bg-corporate-50/80 border-corporate-200 text-corporate-600 hover:border-corporate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-extrabold mb-0.5">
                              {opt.value}
                            </span>
                            <span className="hidden sm:inline text-[11px] text-center leading-tight">
                              {opt.label}
                            </span>
                            <span className="sm:hidden text-[10px]">{opt.shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Form Actions Footer */}
          <div className="rounded-2xl bg-white border border-corporate-200/80 p-5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-corporate-500 text-center sm:text-left">
              {answeredCount === totalCount ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> All statements rated. Ready for submission.
                </span>
              ) : (
                <span>Please rate all statements before submitting your psychometric evaluation.</span>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={answeredCount < totalCount}
              className="w-full sm:w-auto gap-2 text-xs font-semibold shadow-blush"
            >
              Submit Behavioral Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      ) : (
        /* Completed State */
        <Card className="border-emerald-200 bg-white shadow-card animate-in fade-in">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" className="text-xs uppercase font-bold tracking-wider">
                Assessment Completed & Calibrated
              </Badge>
              <h2 className="text-2xl font-bold text-corporate-900">
                Psychological Alignment: 95% High Match
              </h2>
              <p className="text-xs sm:text-sm text-corporate-500 max-w-md mx-auto">
                Your responses reveal exceptional team ownership, low conflict friction, and calm adaptability under high-pressure engineering sprints.
              </p>
            </div>

            {/* Radar / Dimensions breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left pt-2">
              <div className="p-3.5 rounded-xl bg-corporate-50 border border-corporate-200/80">
                <span className="text-[10px] uppercase font-bold text-corporate-400">Collaboration</span>
                <p className="text-lg font-black text-blush-600 mt-1">98%</p>
                <p className="text-[11px] text-corporate-500">Very High Alignment</p>
              </div>
              <div className="p-3.5 rounded-xl bg-corporate-50 border border-corporate-200/80">
                <span className="text-[10px] uppercase font-bold text-corporate-400">Stress Resilience</span>
                <p className="text-lg font-black text-corporate-900 mt-1">94%</p>
                <p className="text-[11px] text-corporate-500">Calm Under Fire</p>
              </div>
              <div className="p-3.5 rounded-xl bg-corporate-50 border border-corporate-200/80">
                <span className="text-[10px] uppercase font-bold text-corporate-400">Ownership</span>
                <p className="text-lg font-black text-corporate-900 mt-1">96%</p>
                <p className="text-[11px] text-corporate-500">Proactive Leader</p>
              </div>
              <div className="p-3.5 rounded-xl bg-corporate-50 border border-corporate-200/80">
                <span className="text-[10px] uppercase font-bold text-corporate-400">Communication</span>
                <p className="text-lg font-black text-emerald-600 mt-1">93%</p>
                <p className="text-[11px] text-corporate-500">Objective & Direct</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/dashboard/status">
                <Button size="lg" className="gap-2 text-sm font-semibold shadow-blush">
                  Advance to Final Decision & Practical Test <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


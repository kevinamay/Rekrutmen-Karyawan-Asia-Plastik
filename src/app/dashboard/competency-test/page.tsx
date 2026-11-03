'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { MOCK_COMPETENCY_QUESTIONS } from '@/data/mockRecruitmentData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { formatTimeRemaining } from '@/lib/utils';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Code2,
  Check,
  Send,
  Zap,
} from 'lucide-react';

export default function CompetencyTestPage() {
  const router = useRouter();
  const {
    competencyAnswers,
    competencyFlagged,
    setCompetencyAnswer,
    toggleFlagQuestion,
    submitCompetencyTest,
  } = useRecruitment();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(1480); // ~24:40 mins
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);

  const questions = MOCK_COMPETENCY_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const selectedOption = competencyAnswers[currentQuestion.id];
  const isFlagged = competencyFlagged.includes(currentQuestion.id);

  const answeredCount = Object.keys(competencyAnswers).length;
  const totalCount = questions.length;
  const progressPct = Math.round((answeredCount / totalCount) * 100);

  // Countdown timer effect
  useEffect(() => {
    if (testSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [testSubmitted]);

  const handleSelectOption = (optionId: string) => {
    setCompetencyAnswer(currentQuestion.id, optionId);
  };

  const handleConfirmSubmit = () => {
    submitCompetencyTest();
    setTestSubmitted(true);
    setSubmitModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Test Banner & Distraction-Free Header */}
      <div className="rounded-2xl bg-white border border-corporate-200/80 p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blush-50 text-blush-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-corporate-900">
                Senior Technical Competency Assessment
              </span>
              <Badge variant="blush" className="text-[10px]">
                Stage 4 of 7
              </Badge>
            </div>
            <p className="text-xs text-corporate-500 mt-0.5">
              Next.js 14/15, TypeScript & Enterprise Architecture • Single Choice
            </p>
          </div>
        </div>

        {/* Live Countdown Timer & Submit Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold ${
              secondsRemaining < 300
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-corporate-50 text-corporate-700 border-corporate-200'
            }`}
          >
            <Timer className="w-4 h-4 text-blush-500" />
            <span>Time Left: {formatTimeRemaining(secondsRemaining)}</span>
          </div>

          <Button
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
            className="text-xs font-semibold shadow-blush gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Finish & Submit
          </Button>
        </div>
      </div>

      {/* Progress & Question Palette Bar */}
      <div className="rounded-2xl bg-white border border-corporate-200/80 p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-corporate-600">
          <span>
            Question {currentIndex + 1} of {totalCount} ({answeredCount} answered)
          </span>
          <span className="text-blush-600 font-bold">{progressPct}% Complete</span>
        </div>
        <Progress value={progressPct} />

        {/* Question Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {questions.map((q, idx) => {
            const hasAnswer = !!competencyAnswers[q.id];
            const isQFlagged = competencyFlagged.includes(q.id);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center ${
                  isCurrent
                    ? 'bg-blush-600 text-white shadow-sm ring-2 ring-blush-300'
                    : hasAnswer
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-corporate-50 text-corporate-600 hover:bg-corporate-100 border border-corporate-200'
                }`}
              >
                {idx + 1}
                {isQFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Display Card */}
      {!testSubmitted ? (
        <Card className="border border-corporate-200/80 shadow-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Question Category & Flag */}
            <div className="flex items-center justify-between">
              <Badge variant="pastel" className="text-xs font-semibold">
                Category: {currentQuestion.category}
              </Badge>

              <button
                type="button"
                onClick={() => toggleFlagQuestion(currentQuestion.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                  isFlagged
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'text-corporate-500 hover:text-corporate-800 border-transparent hover:bg-corporate-50'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-corporate-900 leading-snug">
              {currentIndex + 1}. {currentQuestion.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl bg-corporate-900 text-corporate-100 p-4 font-mono text-xs overflow-x-auto border border-corporate-800">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-corporate-800 text-corporate-400 text-[11px]">
                  <Code2 className="w-3.5 h-3.5 text-blush-400" />
                  <span>TypeScript Snippet</span>
                </div>
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* Multiple Choice Radio Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`cursor-pointer rounded-xl p-4 border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blush-500 bg-blush-50/70 text-corporate-900 font-medium ring-1 ring-blush-300 shadow-sm'
                        : 'border-corporate-200/90 bg-white hover:border-corporate-300 hover:bg-corporate-50/60 text-corporate-700'
                    }`}
                  >
                    {/* Accessible Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blush-600 bg-blush-600 text-white'
                          : 'border-corporate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 leading-relaxed">
                      <span className="font-bold text-corporate-900 mr-2">[{option.id}]</span>
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-corporate-100">
              <Button
                variant="outline"
                size="md"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="gap-2 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </Button>

              {currentIndex < totalCount - 1 ? (
                <Button
                  size="md"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                  className="gap-2 text-xs font-semibold shadow-blush"
                >
                  Next Question <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  size="md"
                  onClick={() => setSubmitModalOpen(true)}
                  className="gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Review & Final Submit <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Test Completed Success Screen */
        <Card className="border-emerald-200 bg-white shadow-card animate-in fade-in">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" className="text-xs uppercase font-bold tracking-wider">
                Competency Test Passed (Score: 92%)
              </Badge>
              <h2 className="text-2xl font-bold text-corporate-900">
                Technical Assessment Successfully Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-corporate-500 max-w-md mx-auto">
                You demonstrated advanced proficiency in Next.js Server Components, bundle optimization,
                and enterprise state management.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-corporate-50 border border-corporate-100 flex items-center justify-around text-xs">
              <div>
                <span className="text-corporate-400 block text-[11px]">Correct Answers</span>
                <span className="text-lg font-bold text-emerald-600">6 / 6 (100%)</span>
              </div>
              <div className="w-px h-8 bg-corporate-200" />
              <div>
                <span className="text-corporate-400 block text-[11px]">Time Spent</span>
                <span className="text-lg font-bold text-corporate-800">5m 20s</span>
              </div>
              <div className="w-px h-8 bg-corporate-200" />
              <div>
                <span className="text-corporate-400 block text-[11px]">Percentile</span>
                <span className="text-lg font-bold text-blush-600">Top 5%</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard/ai-interview">
                <Button size="lg" className="gap-2 text-sm font-semibold shadow-blush">
                  Advance to Stage 5: AI HR Interview Room <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal before Submit */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Technical Assessment?"
        description="Verify your answers before submitting your assessment for automated scoring."
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-xl bg-blush-50/60 border border-blush-200/80 text-xs text-corporate-700 space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span>Total Questions:</span>
              <span>{totalCount}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Answered:</span>
              <span>{answeredCount}</span>
            </div>
            {competencyFlagged.length > 0 && (
              <div className="flex justify-between font-semibold text-amber-700">
                <span>Flagged for Review:</span>
                <span>{competencyFlagged.length}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-corporate-500">
            Once submitted, your score will be logged in your candidate record and you will proceed
            directly to the AI HR Interview Room.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubmitModalOpen(false)}
            >
              Back to Review
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmSubmit}
              className="font-semibold shadow-blush"
            >
              Confirm & Submit Test
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


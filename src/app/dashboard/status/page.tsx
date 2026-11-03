'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRecruitment } from '@/context/RecruitmentContext';
import { MOCK_PRACTICAL_TEST } from '@/data/mockRecruitmentData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
  Layout,
  GitBranch,
  Code2,
  Send,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';

export default function StatusDecisionDashboardPage() {
  const {
    candidate,
    stages,
    practicalSubmitted,
    practicalSubmissionData,
    submitPracticalTest,
    setFinalDecision,
  } = useRecruitment();

  const [repoUrl, setRepoUrl] = useState(practicalSubmissionData?.repoUrl || 'https://github.com/sarah-jenkins/nexacorp-frontend-challenge');
  const [previewUrl, setPreviewUrl] = useState(practicalSubmissionData?.previewUrl || 'https://nexacorp-challenge.vercel.app');
  const [submissionNotes, setSubmissionNotes] = useState(practicalSubmissionData?.notes || 'Implemented Next.js App Router with streaming SSR, 92% Vitest coverage, and accessible WCAG 2.1 AA keyboard support.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const practicalDetails = MOCK_PRACTICAL_TEST;

  const handlePracticalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      submitPracticalTest({
        repoUrl,
        previewUrl,
        notes: submissionNotes,
      });
      setFinalDecision('hired');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header & Interactive Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-corporate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="blush">Stage 7 of 7</Badge>
            <span className="text-xs text-corporate-400 font-medium">• Final Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight mt-1">
            Recruitment Journey & Executive Decision
          </h1>
          <p className="text-xs sm:text-sm text-corporate-500 mt-0.5">
            Holistic performance breakdown across automated screening, competency quizzes, AI HR interviews, and practical challenges.
          </p>
        </div>

        {/* State Toggle for Reviewers */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="text-[10px] uppercase font-bold text-corporate-400">Preview Decision State:</span>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-corporate-200 shadow-xs">
            <button
              onClick={() => setFinalDecision('hired')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                candidate.finalDecision === 'hired'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs font-bold'
                  : 'text-corporate-500 hover:text-corporate-800'
              }`}
            >
              Hired
            </button>
            <button
              onClick={() => setFinalDecision('practical_required')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                candidate.finalDecision === 'practical_required'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs font-bold'
                  : 'text-corporate-500 hover:text-corporate-800'
              }`}
            >
              Practical Required
            </button>
            <button
              onClick={() => setFinalDecision('rejected')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                candidate.finalDecision === 'rejected'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs font-bold'
                  : 'text-corporate-500 hover:text-corporate-800'
              }`}
            >
              Disqualified
            </button>
          </div>
        </div>
      </div>

      {/* PROMINENT FINAL STATUS BANNER */}
      {candidate.finalDecision === 'hired' && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-blush-50/60 border-2 border-emerald-300 p-6 sm:p-8 shadow-card relative overflow-hidden animate-in fade-in zoom-in-95">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 blur-3xl pointer-events-none rounded-full" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="success" className="text-xs uppercase font-extrabold px-3 py-1 tracking-wider shadow-xs">
                Official Hiring Verdict: HIRED & OFFER EXTENDED
              </Badge>
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                93.4% Cumulative Fit Score
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-900 tracking-tight">
                Congratulations, {candidate.fullName}!
              </h2>
              <p className="text-sm text-corporate-600 max-w-2xl leading-relaxed">
                Based on your outstanding performance across all 7 automated evaluation stages, the Executive
                Engineering Committee has extended a formal offer for the position of{' '}
                <strong className="text-corporate-900">{candidate.appliedRole}</strong>.
              </p>
            </div>

            {/* Offer Package Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <span className="text-[11px] font-bold text-corporate-400 uppercase tracking-wider block">
                  Base Compensation
                </span>
                <span className="text-xl font-black text-corporate-900">$215,000 USD</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                  + 20% Performance Bonus
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <span className="text-[11px] font-bold text-corporate-400 uppercase tracking-wider block">
                  Equity Incentive
                </span>
                <span className="text-xl font-black text-corporate-900">$180,000 RSUs</span>
                <span className="text-[11px] text-corporate-500 font-medium block mt-0.5">
                  4-Year Vesting Schedule
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <span className="text-[11px] font-bold text-corporate-400 uppercase tracking-wider block">
                  Start Date & Workstyle
                </span>
                <span className="text-xl font-black text-blush-600">Nov 18, 2026</span>
                <span className="text-[11px] text-corporate-500 font-medium block mt-0.5">
                  Remote (San Francisco HQ Hub)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="md" className="gap-2 text-xs font-semibold shadow-blush">
                <Download className="w-4 h-4" /> Download Official Offer Letter (PDF)
              </Button>
              <Button variant="outline" size="md" className="gap-2 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sign Digital Acceptance Agreement
              </Button>
            </div>
          </div>
        </div>
      )}

      {candidate.finalDecision === 'rejected' && (
        <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-white to-slate-50 border-2 border-rose-300 p-6 sm:p-8 shadow-card relative overflow-hidden animate-in fade-in">
          <div className="space-y-4">
            <Badge variant="danger" className="text-xs uppercase font-extrabold px-3 py-1 tracking-wider">
              Application Verdict: NOT SELECTED AT THIS TIME
            </Badge>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-corporate-900 tracking-tight">
                Application Status Update
              </h2>
              <p className="text-sm text-corporate-600 max-w-2xl leading-relaxed">
                Thank you for taking the time to participate in our automated recruitment process for the{' '}
                <strong className="text-corporate-900">{candidate.appliedRole}</strong> position. While your
                competencies were strong, we have opted to proceed with applicants whose architectural focus more
                closely matches our immediate infrastructure requirements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-rose-200 text-xs text-corporate-700 space-y-1">
              <span className="font-bold text-corporate-900 block">Talent Network Retention:</span>
              <p className="text-corporate-500">
                Your profile and assessment benchmarks will remain in our Priority Talent Directory for 12 months.
                Our automated matching engine will notify you when compatible senior roles open.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CENTRAL 7-STAGE TIMELINE / STEPPER COMPONENT */}
      <div className="rounded-3xl bg-white border border-corporate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-corporate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-corporate-900">
              7-Stage Candidate Journey & Progress Stepper
            </h3>
            <p className="text-xs text-corporate-500 mt-0.5">
              Live status and telemetry for each milestone in the automated hiring pipeline.
            </p>
          </div>
          <Badge variant="blush" className="self-start sm:self-auto font-semibold">
            All Milestones Tracked
          </Badge>
        </div>

        {/* Stepper Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-corporate-200">
          {stages.map((st, i) => {
            const isCompleted = st.status === 'completed' || st.status === 'passed';
            const isInProgress = st.status === 'in_progress';

            return (
              <div key={st.id} className="relative flex items-start gap-4 group">
                {/* Stepper Node Icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 mt-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isInProgress
                      ? 'bg-blush-500 text-white ring-blush-100 animate-pulse'
                      : 'bg-corporate-200 text-corporate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl bg-corporate-50/50 hover:bg-blush-50/30 p-4 border border-corporate-200/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-corporate-400 uppercase tracking-wider">
                        Stage {i + 1}
                      </span>
                      <span className="text-xs text-corporate-300">•</span>
                      <h4 className="text-sm font-bold text-corporate-900">{st.title}</h4>
                      {st.score && (
                        <Badge variant="blush" className="text-[10px] py-0 px-2 font-bold">
                          {st.score}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-corporate-500">{st.description}</p>
                    {st.completedAt && (
                      <span className="text-[10px] text-corporate-400 block">
                        Completed: {st.completedAt}
                      </span>
                    )}
                  </div>

                  <Link href={st.route}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold gap-1 self-start sm:self-auto"
                    >
                      <span>Review Stage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONDITIONAL RENDERING SECTION: PRACTICAL TEST INVITATION & INSTRUCTIONS */}
      {(candidate.finalDecision === 'practical_required' || practicalSubmitted) && (
        <Card className="border-amber-200/80 bg-white shadow-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-corporate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[11px] uppercase font-bold">
                      Practical Assignment Required
                    </Badge>
                    <span className="text-xs text-corporate-400">• 48 Hours Allocation</span>
                  </div>
                  <h3 className="text-lg font-bold text-corporate-900 mt-1">
                    {practicalDetails.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs py-1 px-3 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                  Due: {practicalDetails.submissionDeadline}
                </Badge>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-corporate-600 leading-relaxed">
              {practicalDetails.description}
            </p>

            {/* Resources Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={practicalDetails.figmaDesignUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-corporate-200 bg-corporate-50/50 hover:bg-blush-50/50 transition-colors group text-xs font-semibold text-corporate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Layout className="w-4 h-4 text-purple-600" />
                  <span>Download Figma Design Specs</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-corporate-400 group-hover:text-blush-600" />
              </a>

              <a
                href={practicalDetails.repositoryTemplateUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-corporate-200 bg-corporate-50/50 hover:bg-blush-50/50 transition-colors group text-xs font-semibold text-corporate-800"
              >
                <div className="flex items-center gap-2.5">
                  <GitBranch className="w-4 h-4 text-corporate-900" />
                  <span>Clone Starter Repo (GitHub)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-corporate-400 group-hover:text-blush-600" />
              </a>
            </div>

            {/* Core Requirements Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-corporate-500">
                Core Assignment Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {practicalDetails.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-corporate-50/70 border border-corporate-100 text-xs text-corporate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Form */}
            <div className="pt-4 border-t border-corporate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-corporate-900">
                  {practicalSubmitted ? 'Your Submission (Recorded)' : 'Submit Your Solution'}
                </h4>
                {practicalSubmitted && (
                  <Badge variant="success" className="text-xs">
                    Submitted & Under Peer Evaluation
                  </Badge>
                )}
              </div>

              <form onSubmit={handlePracticalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="GitHub Solution Repository URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/repo"
                    required
                    isValid={repoUrl.includes('github.com')}
                  />
                  <Input
                    label="Live Production Preview URL"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://your-challenge.vercel.app"
                    required
                    isValid={previewUrl.startsWith('http')}
                  />
                </div>

                <Textarea
                  label="Architectural Summary & Engineering Trade-offs"
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Document key trade-offs, state orchestration reasoning, bundle optimization, and test coverage metrics..."
                  required
                />

                {!practicalSubmitted ? (
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto gap-2 text-xs font-semibold shadow-blush"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Assignment for Evaluation
                  </Button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Solution received! The team will review your commit history and unit tests.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Holistic Performance Scorecard Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-corporate-200/80 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-400">
            CV Match
          </span>
          <p className="text-2xl font-black text-blush-600">94%</p>
          <p className="text-xs text-corporate-500 font-medium">Neural NLP Parsing</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-corporate-200/80 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-400">
            Competency Test
          </span>
          <p className="text-2xl font-black text-corporate-900">92%</p>
          <p className="text-xs text-corporate-500 font-medium">Next.js & TypeScript</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-corporate-200/80 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-400">
            AI HR Recruiter
          </span>
          <p className="text-2xl font-black text-emerald-600">89%</p>
          <p className="text-xs text-corporate-500 font-medium">System Architecture</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-corporate-200/80 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-400">
            Psych Alignment
          </span>
          <p className="text-2xl font-black text-purple-600">95%</p>
          <p className="text-xs text-corporate-500 font-medium">Team Dynamics</p>
        </div>
      </div>
    </div>
  );
}


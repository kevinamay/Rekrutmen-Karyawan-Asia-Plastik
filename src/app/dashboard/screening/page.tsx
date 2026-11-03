'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Check,
  XCircle,
  FileCheck2,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function CVScreeningPage() {
  const router = useRouter();
  const {
    cvResult,
    isAnalyzingCV,
    cvUploadProgress,
    triggerCVAnalysis,
    setCVOutcome,
  } = useRecruitment();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>(cvResult.fileName);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file.name);
      triggerCVAnalysis(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
      triggerCVAnalysis(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-corporate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="blush">Stage 3 of 7</Badge>
            <span className="text-xs text-corporate-400 font-medium">• Automated CV Screening</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight mt-1">
            AI Resume & Skill Matrix Analysis
          </h1>
          <p className="text-xs sm:text-sm text-corporate-500 mt-0.5">
            Our neural parser extracts verified technical competencies and benchmarks them against the Lead Frontend Architect criteria.
          </p>
        </div>

        {/* Quick Mock Scenarios Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-corporate-200/80 shadow-xs">
          <button
            onClick={() => {
              setSelectedFile('Sarah_Jenkins_Staff_Frontend_Resume.pdf');
              setCVOutcome('passed');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              cvResult.status === 'passed' && !isAnalyzingCV
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                : 'text-corporate-500 hover:text-corporate-800'
            }`}
          >
            Mock Passed
          </button>
          <button
            onClick={() => {
              setSelectedFile('Candidate_Junior_Draft_CV.pdf');
              setCVOutcome('disqualified');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              cvResult.status === 'disqualified' && !isAnalyzingCV
                ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                : 'text-corporate-500 hover:text-corporate-800'
            }`}
          >
            Mock Disqualified
          </button>
        </div>
      </div>

      {/* Upload Zone Card */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? 'border-blush-500 bg-blush-50/80 scale-[1.01]'
                : 'border-corporate-200 hover:border-blush-300 bg-corporate-50/40'
            }`}
          >
            <input
              type="file"
              id="cv-upload-input"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blush-100 to-pastel-blush text-blush-600 flex items-center justify-center shadow-sm">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-corporate-900">
                  Drag and drop your candidate CV here
                </h3>
                <p className="text-xs text-corporate-500 mt-1 max-w-sm mx-auto">
                  Supports PDF or DOCX formats (up to 10MB). Text layers are instantly vectorized by our AI model.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label
                  htmlFor="cv-upload-input"
                  className="cursor-pointer inline-flex items-center justify-center rounded-xl font-medium text-xs h-9 px-4 bg-blush-600 hover:bg-blush-700 text-white shadow-blush shadow-xs transition-colors"
                >
                  Browse Document
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerCVAnalysis(true)}
                  className="text-xs gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-corporate-500" />
                  Re-run Analysis
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulated Processing State with Skeleton Loaders & Scanner */}
      {isAnalyzingCV && (
        <Card className="border-blush-200 bg-gradient-to-b from-white to-blush-50/20 overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blush-100 text-blush-600 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-corporate-900 flex items-center gap-2">
                    Neural Engine Analyzing CV Document
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blush-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blush-500" />
                    </span>
                  </h3>
                  <p className="text-xs text-corporate-500 mt-0.5">
                    Analyzing file: <span className="font-semibold text-corporate-800">{selectedFile}</span>
                  </p>
                </div>
              </div>
              <Badge variant="blush" className="animate-pulse">
                Processing {cvUploadProgress}%
              </Badge>
            </div>

            {/* Simulated Animated Scanner Box */}
            <div className="relative h-28 rounded-xl bg-corporate-900/5 border border-corporate-200 overflow-hidden flex flex-col justify-center items-center">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blush-500 to-transparent animate-scan shadow-[0_0_15px_rgba(230,53,115,0.8)]" />
              <div className="flex flex-col items-center gap-1.5 text-xs text-corporate-600 font-medium z-10">
                <Cpu className="w-5 h-5 text-blush-500" />
                <span>Extracting Abstract Syntax Tree & Semantic Embedding Matrix...</span>
              </div>
            </div>

            {/* Skeleton Loaders */}
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-corporate-200/60 rounded-md w-3/4 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-corporate-200/50 rounded-xl animate-pulse" />
                <div className="h-10 bg-corporate-200/50 rounded-xl animate-pulse" />
              </div>
              <div className="h-24 bg-corporate-200/40 rounded-xl animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Card (Passed or Disqualified) */}
      {!isAnalyzingCV && (
        <Card
          className={`border transition-all duration-300 ${
            cvResult.status === 'passed'
              ? 'border-emerald-200/80 bg-white shadow-card'
              : 'border-rose-200/80 bg-white shadow-card'
          }`}
        >
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Verdict Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-corporate-100">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${
                    cvResult.status === 'passed'
                      ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50'
                      : 'bg-rose-50 text-rose-600 ring-4 ring-rose-50'
                  }`}
                >
                  {cvResult.status === 'passed' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={cvResult.status === 'passed' ? 'success' : 'danger'}
                      className="text-xs uppercase font-bold tracking-wider"
                    >
                      {cvResult.status === 'passed'
                        ? 'Passed Screening'
                        : 'Disqualified (Does not meet criteria)'}
                    </Badge>
                    <span className="text-xs text-corporate-400">• Verified by AI</span>
                  </div>

                  <h3 className="text-lg font-bold text-corporate-900 mt-1">
                    {cvResult.verdict}
                  </h3>
                  <p className="text-xs text-corporate-500 mt-0.5">
                    Analyzed Document:{' '}
                    <span className="font-semibold text-corporate-800">{cvResult.fileName}</span> ({cvResult.fileSize})
                  </p>
                </div>
              </div>

              {/* Match Fit Score Circle */}
              <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 sm:p-4 rounded-xl bg-corporate-50 border border-corporate-100 shrink-0">
                <span className="text-[11px] font-bold text-corporate-400 uppercase tracking-wider">
                  Role Fit Score
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black ${
                    cvResult.status === 'passed' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {cvResult.matchScore}%
                </span>
              </div>
            </div>

            {/* Skills Match Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-corporate-500">
                  Identified Matching Skills ({cvResult.matchingSkills.length})
                </h4>
                <span className="text-xs text-corporate-400">Benchmark: 80%+ Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cvResult.matchingSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-xl border border-corporate-100 bg-corporate-50/40 hover:bg-blush-50/30 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-corporate-800 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-bold text-corporate-500">
                        {skill.relevance}%
                      </span>
                    </div>
                    <Progress
                      value={skill.relevance}
                      indicatorColor={
                        skill.relevance >= 90
                          ? 'bg-gradient-to-r from-blush-500 to-blush-400'
                          : 'bg-emerald-500'
                      }
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis or Missing Skills if any */}
            {cvResult.missingSkills.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-corporate-500">
                  Criteria Gap Analysis / Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cvResult.missingSkills.map((missing) => (
                    <Badge
                      key={missing}
                      variant={cvResult.status === 'passed' ? 'outline' : 'danger'}
                      className="text-xs py-1 px-3"
                    >
                      {missing}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Strengths & Recommendation Notes */}
            <div className="p-4 rounded-xl bg-corporate-50/70 border border-corporate-200/80 space-y-2">
              <span className="text-xs font-bold text-corporate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blush-500" />
                AI Evaluator Recommendation:
              </span>
              <p className="text-xs text-corporate-600 leading-relaxed">
                {cvResult.recommendationNotes}
              </p>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-4 border-t border-corporate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/profile')}
                className="text-xs font-semibold"
              >
                Back to Profile
              </Button>

              {cvResult.status === 'passed' ? (
                <Link href="/dashboard/competency-test">
                  <Button size="md" className="gap-2 text-xs font-semibold shadow-blush">
                    Proceed to Stage 4: Online Competency Test <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => triggerCVAnalysis(true)}
                  className="gap-2 text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-upload Optimized CV
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


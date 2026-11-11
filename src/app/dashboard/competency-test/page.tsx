'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardCheck,
  Clock,
  LogOut,
  Phone,
  Menu,
  X,
  ArrowLeft,
  Timer,
  CheckCircle2,
  AlertCircle,
  Send,
  HelpCircle,
  ShieldCheck,
  Check,
  Award,
  ArrowUp,
  Info,
  XCircle,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';
import { QC_COMPETENCY_QUESTIONS } from './mockQuestions';

const EXAM_STORAGE_KEY = 'asiaplastik_competency_answers';

export default function CompetencyTestPage() {
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    competencyAnswers: contextAnswers,
    competencyScore: contextScore,
    competencyPassed: contextPassed,
    saveCompetencyResult,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  // Exam Answers State: Clean empty object
  const [answers, setAnswers] = useState<Record<number, string>>(contextAnswers || {});
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 minutes
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    correctCount: number;
    passed: boolean;
  } | null>(
    contextScore !== null
      ? {
          score: contextScore,
          correctCount: Math.round((contextScore / 100) * QC_COMPETENCY_QUESTIONS.length),
          passed: !!contextPassed,
        }
      : null
  );

  // Sync candidate name
  useEffect(() => {
    if (candidate.fullName) setCandidateName(candidate.fullName);
  }, [candidate.fullName]);

  // Load from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(EXAM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.result) {
          setExamResult(parsed.result);
          setSubmitted(true);
        }
      }
    } catch (e) {}
  }, []);

  // Sync Auth and Firestore Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) setCandidateName(user.displayName);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.fullName) setCandidateName(data.fullName);
            if (data.competencyAnswers) setAnswers(data.competencyAnswers);
            if (data.competencyScore !== undefined) {
              const res = {
                score: data.competencyScore,
                correctCount: Math.round((data.competencyScore / 100) * QC_COMPETENCY_QUESTIONS.length),
                passed: Boolean(data.competencyPassed),
              };
              setExamResult(res);
              setSubmitted(true);
            }
          }
        } catch (err) {
          console.error('Error fetching candidate data in exam:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const questions = QC_COMPETENCY_QUESTIONS;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: number, optId: string) => {
    if (submitted) return;
    const updated = { ...answers, [qId]: optId };
    setAnswers(updated);
    try {
      localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify({ answers: updated, result: examResult }));
    } catch (e) {}
  };

  const scrollToQuestion = (id: number) => {
    const el = document.getElementById(`soal-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    // Calculate real score based on answer key
    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 80;

    const resultData = { score, correctCount, passed };
    setExamResult(resultData);
    setSubmitted(true);

    saveCompetencyResult(answers, score, passed);

    try {
      localStorage.setItem(
        EXAM_STORAGE_KEY,
        JSON.stringify({ answers, result: resultData })
      );
    } catch (e) {}

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            competencyAnswers: answers,
            competencyScore: score,
            competencyPassed: passed,
            competencyCompletedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving exam score to Firestore:', err);
      }
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={openMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-sky-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 hidden sm:inline">Portal Rekrutmen</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900">Ujian Kompetensi Teknis QC</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-1 rounded-full border border-sky-200 hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
            <span>Tahap 4: Ujian Kompetensi QC</span>
          </span>
          <a
            href="https://wa.me/6282244109503"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bantuan HRD</span>
            <span className="sm:hidden">HRD</span>
          </a>
        </div>
      </header>

      {/* Viewport Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-32">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Result Alert if exam is finished */}
          {examResult && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                examResult.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    examResult.passed
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  }`}
                >
                  {examResult.score}%
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {examResult.passed
                      ? 'Selamat! Anda Dinyatakan Lolos Ujian Kompetensi Teknis QC'
                      : 'Hasil Ujian Kompetensi Teknis QC Telah Diterbitkan'}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Skor: <strong>{examResult.score}%</strong> ({examResult.correctCount} dari{' '}
                    {totalQuestions} soal terjawab benar). Passing grade minimum adalah 80%.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/status"
                className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-colors shadow-sm text-center ${
                  examResult.passed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                Lihat Status Seleksi
              </Link>
            </div>
          )}

          {/* Sticky Exam Progress Bar */}
          <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-bold text-sm shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Lembar Ujian Teknis Terbuka (Continuous Sheet)
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {answeredCount} / {totalQuestions} Terjawab ({progressPct}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Semua butir soal ditampilkan berurutan. Klik nomor untuk navigasi instan.
                </p>
              </div>
            </div>

            {/* Question Jump Chips, Countdown Timer & Submit Button */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {questions.map((q) => {
                  const isAnswered = !!answers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuestion(q.id)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        isAnswered
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                      title={`Soal #${q.id}: ${isAnswered ? 'Sudah dijawab' : 'Belum dijawab'}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 text-white font-mono text-sm font-bold shadow-sm">
                <Timer className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              {!submitted && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Continuous Document Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Column: All Questions (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Instructions Box */}
              <div className="bg-gradient-to-r from-sky-50 via-slate-50 to-white p-5 rounded-2xl border border-sky-100 text-xs text-slate-700 flex items-start gap-3 shadow-sm">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block text-sm">
                    Petunjuk Pengerjaan Lembar Ujian Teknis QC
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Pilihlah salah satu jawaban yang paling tepat untuk masing-masing butir soal di
                    bawah ini. Anda dapat mengubah jawaban sewaktu-waktu selama sisa waktu ujian
                    masih tersedia. Setelah seluruh butir soal terjawab, klik tombol{' '}
                    <strong>&quot;Selesai & Kumpulkan&quot;</strong> di bagian bawah atau panel atas.
                  </p>
                </div>
              </div>

              {/* Question List */}
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const currentSelected = answers[q.id];

                return (
                  <div
                    key={q.id}
                    id={`soal-${q.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 transition-all hover:border-slate-300"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                          {q.category}
                        </span>
                      </div>
                      <div>
                        {isAnswered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Terjawab ({currentSelected})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            Belum Dijawab
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
                      {q.question}
                    </h3>

                    {/* Option Cards */}
                    <div className="space-y-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isChecked = currentSelected === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                              isChecked
                                ? 'bg-sky-50/70 border-sky-500 shadow-sm ring-1 ring-sky-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isChecked
                                  ? 'bg-sky-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span
                              className={`text-xs md:text-sm leading-relaxed ${
                                isChecked ? 'font-semibold text-slate-900' : 'text-slate-700'
                              }`}
                            >
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if reviewed after submit */}
                    {submitted && (
                      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                        <span className="font-bold text-slate-800 block">
                          Kunci Jawaban: {q.correctAnswer}
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Action Footer */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {answeredCount} dari {totalQuestions} Soal Telah Terisi
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pastikan semua butir jawaban telah terisi sesuai standar teknis operasional.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Kembali ke Atas</span>
                  </button>
                  {!submitted && (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kumpulkan Lembar Jawaban</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary & Candidate Dossier (1 col) */}
            <div className="space-y-6 lg:sticky lg:top-40">
              {/* Candidate Badge */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {candidateName ? candidateName.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{candidateName}</h4>
                    <p className="text-[11px] text-slate-500">Pelamar QC CV. Asia Plastik</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Posisi:</span>
                    <span className="font-semibold text-slate-900 text-right">Supervisor QC</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Lokasi Ujian:</span>
                    <span className="font-semibold text-slate-900 text-right">
                      Online Portal Asia Plastik
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Batas Waktu:</span>
                    <span className="font-semibold text-slate-900">30 Menit</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Passing Grade:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      Minimal 80%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Navigator Grid */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Daftar Status Soal</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q) => {
                    const isAnswered = !!answers[q.id];
                    return (
                      <button
                        key={q.id}
                        onClick={() => scrollToQuestion(q.id)}
                        className={`h-9 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          isAnswered
                            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{q.id}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                    <span>Hijau: Soal sudah terjawab ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                    <span>Abu-abu: Soal belum terjawab ({totalQuestions - answeredCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Pengumpulan Lembar Ujian
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda telah menjawab{' '}
                <strong className="text-slate-800">
                  {answeredCount} dari {totalQuestions} butir soal
                </strong>
                . Apakah Anda yakin ingin menyelesaikan dan mengunci lembar jawaban ini?
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Sisa Waktu:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status Jawaban:</span>
                <span className="font-bold text-emerald-600">
                  {answeredCount === totalQuestions
                    ? 'Lengkap 100%'
                    : `${totalQuestions - answeredCount} belum diisi`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Success Modal */}
      {submitted && examResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
                examResult.passed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  examResult.passed
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}
              >
                {examResult.passed ? 'Lolos Passing Grade' : 'Ujian Selesai'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Skor Anda: {examResult.score}%
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {examResult.passed
                  ? `Selamat ${candidateName}, Anda berhasil menjawab ${examResult.correctCount} dari ${totalQuestions} soal dengan benar dan memenuhi kualifikasi teknis minimum Supervisor QC!`
                  : `Terima kasih ${candidateName}. Anda menjawab ${examResult.correctCount} dari ${totalQuestions} soal dengan benar. Ambang batas minimum kelulusan adalah 80%.`}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Jawaban Benar:</span>
                <span className="font-bold text-slate-800">
                  {examResult.correctCount} / {totalQuestions} Soal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nilai Akhir:</span>
                <span className={`font-bold ${examResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {examResult.score}% (Passing Grade: 80%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Tahap:</span>
                <span className="font-bold text-sky-700">
                  {examResult.passed ? 'Lolos ke Wawancara Tatap Muka' : 'Evaluasi Selesai'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
              >
                Tinjau Pembahasan Soal
              </button>
              <Link
                href="/dashboard/status"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all text-center flex items-center justify-center"
              >
                Buka Status Lamaran
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

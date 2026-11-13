'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Timer,
  CheckCircle2,
  AlertCircle,
  Send,
  HelpCircle,
  ShieldCheck,
  Check,
  Award,
  ArrowRight,
  Lock,
  Phone,
  Menu,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';
import { QC_COMPETENCY_QUESTIONS } from '../competency-test/mockQuestions';

const SKILL_STORAGE_KEY = 'asiaplastik_skill_test_answers';
const PSYCHO_STORAGE_KEY = 'asiaplastik_psychology_result';

export default function SkillTestPage() {
  const router = useRouter();
  const {
    candidate,
    competencyScore,
    competencyPassed,
    saveCompetencyResult,
    psychologyPassed,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  // Psychology Prerequisite Check
  const [isPsychologyPassed, setIsPsychologyPassed] = useState<boolean>(false);
  const [checkingPrereq, setCheckingPrereq] = useState<boolean>(true);

  // Technical Exam State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 minutes
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    correctCount: number;
    passed: boolean;
  } | null>(null);

  // Check Prerequisite from Context / LocalStorage / Firestore
  useEffect(() => {
    if (psychologyPassed) {
      setIsPsychologyPassed(true);
    }

    // 1. Check localStorage first
    try {
      const savedPsycho = localStorage.getItem(PSYCHO_STORAGE_KEY);
      if (savedPsycho) {
        const parsed = JSON.parse(savedPsycho);
        if (parsed.passed) {
          setIsPsychologyPassed(true);
        }
      }

      const savedSkill = localStorage.getItem(SKILL_STORAGE_KEY);
      if (savedSkill) {
        const parsed = JSON.parse(savedSkill);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.result) {
          setExamResult(parsed.result);
          setSubmitted(true);
        }
      }
    } catch (e) {}

    // 2. Check Auth & Firestore
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) setCandidateName(user.displayName);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.fullName) setCandidateName(data.fullName);
            if (data.psychologyPassed) {
              setIsPsychologyPassed(true);
            }
            if (data.competencyScore !== undefined) {
              setExamResult({
                score: data.competencyScore,
                correctCount: Math.round((data.competencyScore / 100) * QC_COMPETENCY_QUESTIONS.length),
                passed: Boolean(data.competencyPassed),
              });
              setSubmitted(true);
            }
          }
        } catch (err) {
          console.error('Error checking prereq in skill test:', err);
        }
      }
      setCheckingPrereq(false);
    });

    return () => unsubscribe();
  }, [psychologyPassed]);

  // Countdown Timer
  useEffect(() => {
    if (!isPsychologyPassed || submitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPsychologyPassed, submitted]);

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
      localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify({ answers: updated, result: examResult }));
    } catch (e) {}
  };

  const handleFinishExam = async () => {
    setShowConfirmModal(false);
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / totalQuestions) * 100);
    const passed = finalScore >= 80;
    const res = { score: finalScore, correctCount: correct, passed };
    setExamResult(res);
    setSubmitted(true);

    try {
      localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify({ answers, result: res }));
    } catch (e) {}

    saveCompetencyResult(answers, finalScore, passed);

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            competencyAnswers: answers,
            competencyScore: finalScore,
            competencyPassed: passed,
            competencyCompletedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving skill test result to Firestore:', err);
      }
    }
  };

  if (checkingPrereq) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-xs font-semibold">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mr-2" />
        <span>Memeriksa Persyaratan Kelulusan Psikotes...</span>
      </div>
    );
  }

  // LOCKED STATE: If candidate has NOT passed the Psikotes yet
  if (!isPsychologyPassed) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={openMobileSidebar} className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <Link href="/dashboard" className="text-slate-400 hover:text-sky-600">Dashboard</Link>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-900">Ujian Kompetensi Keahlian Teknis</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-xl mx-auto my-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Tahap Terkunci (Prerequisite Locked)
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              Selesaikan Psikotes Terlebih Dahulu
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Sesuai standar rekrutmen CV. Asia Plastik, Anda wajib mengerjakan dan <strong>dinyatakan LULUS pada Psikotes Online</strong> (minimal nilai 75%) sebelum dapat membuka Lembar Ujian Kompetensi Keahlian Teknis ini.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/competency-test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02]"
            >
              <span>Buka & Kerjakan Psikotes Online Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <footer className="h-14 border-t border-slate-200 bg-white flex items-center justify-center text-xs text-slate-400">
          <span>CV. Asia Plastik © 2026</span>
        </footer>
      </div>
    );
  }

  // UNLOCKED STATE: Full Technical Competency Exam
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={openMobileSidebar} className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/dashboard" className="text-slate-400 hover:text-sky-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900">Ujian Kompetensi Keahlian Teknis</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Psikotes Lulus</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
        {/* Exam Header Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800">
                Tahap 6: Ujian Keahlian Teknis
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {answeredCount}/{totalQuestions} Terjawab ({progressPct}%)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Ujian Kompetensi Teknis Spesifikasi Industri Plastik
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi pemahaman defek molding, pengujian bahan polimer, dan sistem mutu ISO 9001:2015.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex items-center gap-2 shadow-sm">
              <Timer className="w-4 h-4 text-sky-400" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            {!submitted && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Selesai & Kumpulkan</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Banner if Submitted */}
        {examResult && (
          <div className={`p-6 rounded-2xl border text-center space-y-3 shadow-md animate-in fade-in ${
            examResult.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-white shadow-sm"
              style={{ backgroundColor: examResult.passed ? '#059669' : '#e11d48' }}>
              {examResult.score}%
            </div>
            <h3 className="text-lg font-bold">
              {examResult.passed ? 'Selamat! Anda Dinyatakan LULUS Ujian Teknis' : 'Nilai Belum Mencapai Batas Minimum'}
            </h3>
            <p className="text-xs max-w-md mx-auto">
              {examResult.passed
                ? 'Hasil evaluasi teknis Anda memenuhi kualifikasi standar CV. Asia Plastik. Tahapan selanjutnya adalah Wawancara Tatap Muka.'
                : 'Batas kelulusan minimum adalah 80%. Tim HRD akan mereview kembali profil Anda.'}
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/status"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm"
              >
                <span>Lihat Status Tahapan Lamaran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/60">
                  Soal #{idx + 1} • {q.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {answers[q.id] ? 'Sudah Dijawab' : 'Belum Dijawab'}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2 pt-2">
                {q.options.map((opt) => {
                  const isChecked = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isChecked ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.id}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800">Kunci Jawaban: {q.correctAnswer}</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Kumpulkan Ujian Teknis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda telah menjawab <strong>{answeredCount}</strong> dari <strong>{totalQuestions}</strong> soal. Apakah Anda yakin ingin menyelesaikan ujian sekarang? Jawaban tidak dapat diubah setelah dikumpulkan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleFinishExam}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Timer,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  Phone,
  Menu,
  Activity,
  Layers,
  Sparkles,
  Lock,
  RotateCcw,
  Check,
  Table,
  Target,
  FileCheck2,
  Flame,
  Gauge,
  ListChecks,
  MonitorCheck,
  Cpu,
  ChevronLeft,
  UserCheck,
  Compass,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  PlayCircle,
  Info,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRecruitment, isCandidateProfileComplete } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';
import {
  COGNITIVE_QUESTIONS,
  PERSONALITY_SETS,
  SJT_QUESTIONS,
  LOGIC_ALGORITHM_QUESTIONS,
  generateKraepelinPairs,
  KraepelinPair,
} from '@/data/psychologyTestData';

const PSYCHO_STORAGE_KEY = 'asiaplastik_psychology_result';

// Durasi waktu rigid per sub-tes (dalam detik)
const SUBTEST_DURATIONS = [
  720, // Subtest 1: Kognitif (12 Menit)
  600, // Subtest 2: Kepribadian (10 Menit)
  600, // Subtest 3: SJT (10 Menit)
  90,  // Subtest 4: Kraepelin Digital (90 Detik)
  480, // Subtest 5: Logika Algoritma (8 Menit)
];

const SUBTEST_NAMES = [
  'Tes Kemampuan Kognitif (Aptitude Test)',
  'Tes Kepribadian (Personality Inventory)',
  'Situational Judgment Test (SJT)',
  'Tes Ketelitian & Kecepatan (Kraepelin Digital)',
  'Tes Logika Algoritma & Sistem',
];

export default function PsychologyTestPage() {
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    isProfileCompleted,
    isDocsCompleted,
    isPsychologyUnlocked,
    savePsychologyResult,
    uploadedDocs,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);
  const [candidateRole, setCandidateRole] = useState(candidate.appliedRole || 'Calon Karyawan');

  // Subtest Stepper State (0 to 4, 5 = Selesai/Hasil)
  const [currentSubtest, setCurrentSubtest] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(SUBTEST_DURATIONS[0]);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);

  // Subtest 1 (Kognitif) Answers
  const [cognitiveAnswers, setCognitiveAnswers] = useState<Record<number, string>>({});

  // Subtest 2 (Kepribadian) Answers
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<number, { most?: string; least?: string }>>({});

  // Subtest 3 (SJT) Answers
  const [sjtAnswers, setSjtAnswers] = useState<Record<number, string>>({});

  // Subtest 4 (Kraepelin) Dynamic Pairs & Answers
  const [kraepelinPairs, setKraepelinPairs] = useState<KraepelinPair[]>([]);
  const [kraepelinIndex, setKraepelinIndex] = useState<number>(0);
  const [kraepelinCorrect, setKraepelinCorrect] = useState<number>(0);
  const [kraepelinTotalAnswered, setKraepelinTotalAnswered] = useState<number>(0);

  // Subtest 5 (Logika Algoritma) Answers
  const [logicAnswers, setLogicAnswers] = useState<Record<number, string>>({});

  // Final Composite Score State
  const [finalScoreData, setFinalScoreData] = useState<{
    totalScore: number;
    passed: boolean;
    cognitiveScore: number;
    personalityScore: number;
    sjtScore: number;
    kraepelinScore: number;
    logicScore: number;
    kraepelinTotal: number;
    kraepelinAccuracy: number;
  } | null>(null);

  // Guidelines Accordion & Practice States (Pre-test Launchpad)
  const [expandedGuides, setExpandedGuides] = useState<Record<number, boolean>>({ 1: true });
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const [hasAgreedToRules, setHasAgreedToRules] = useState<boolean>(true);

  // Subtest 1 (Cognitive) Practice Question State
  const [practiceCogAnswer, setPracticeCogAnswer] = useState<string | null>(null);

  // Subtest 2 (Personality) Practice Selection State
  const [practicePersMost, setPracticePersMost] = useState<string | null>(null);
  const [practicePersLeast, setPracticePersLeast] = useState<string | null>(null);

  // Subtest 3 (SJT) Practice Question State
  const [practiceSjtAnswer, setPracticeSjtAnswer] = useState<string | null>(null);

  // Subtest 4 (Kraepelin Digital) Mini Drill State
  const [kraepelinDrill, setKraepelinDrill] = useState<{
    n1: number;
    n2: number;
    feedback: string | null;
    correctCount: number;
  }>({
    n1: 7,
    n2: 8,
    feedback: null,
    correctCount: 0,
  });

  // Subtest 5 (Logic Algorithm) Practice Question State
  const [practiceLogicAnswer, setPracticeLogicAnswer] = useState<string | null>(null);

  const toggleGuide = (subtestNum: number) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [subtestNum]: !prev[subtestNum],
    }));
  };

  const toggleAllGuides = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    setExpandedGuides({
      1: next,
      2: next,
      3: next,
      4: next,
      5: next,
    });
  };

  const handleKraepelinDrillInput = (digit: number) => {
    const sum = kraepelinDrill.n1 + kraepelinDrill.n2;
    const unitDigit = sum % 10;
    if (digit === unitDigit) {
      const nextN1 = Math.floor(Math.random() * 9) + 1;
      const nextN2 = Math.floor(Math.random() * 9) + 1;
      setKraepelinDrill({
        n1: nextN1,
        n2: nextN2,
        feedback: `Hebat! ${kraepelinDrill.n1} + ${kraepelinDrill.n2} = ${sum} (Digit Satuan: ${digit}). Jawaban Anda Benar! Coba pasangan angka baru.`,
        correctCount: kraepelinDrill.correctCount + 1,
      });
    } else {
      setKraepelinDrill((prev) => ({
        ...prev,
        feedback: `Kurang tepat. ${prev.n1} + ${prev.n2} = ${sum}, digit satuannya adalah ${unitDigit} (bukan ${digit}). Ingat hanya ambil angka belakangnya!`,
      }));
    }
  };

  // Sync candidate profile & check prior test results
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PSYCHO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.totalScore !== undefined) {
          setFinalScoreData(parsed);
          setTestFinished(true);
          setIsTestStarted(true);
        }
      }
    } catch (e) {}

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) setCandidateName(user.displayName);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.fullName) setCandidateName(data.fullName);
            if (data.appliedRole) setCandidateRole(data.appliedRole);
            if (data.psychologyScore !== undefined) {
              setFinalScoreData({
                totalScore: data.psychologyScore,
                passed: Boolean(data.psychologyPassed),
                cognitiveScore: data.psychologyCognitive || 80,
                personalityScore: data.psychologyPersonality || 85,
                sjtScore: data.psychologySjt || 80,
                kraepelinScore: data.psychologyKraepelin || 80,
                logicScore: data.psychologyLogic || 80,
                kraepelinTotal: data.kraepelinTotal || 35,
                kraepelinAccuracy: data.kraepelinAccuracy || 90,
              });
              setTestFinished(true);
              setIsTestStarted(true);
            }
          }
        } catch (err) {
          console.error('Error fetching candidate doc in psycho test:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize Kraepelin pairs on mount
  useEffect(() => {
    setKraepelinPairs(generateKraepelinPairs(80));
  }, []);

  // Calculate and Finalize Score
  const calculateFinalScores = useCallback(async () => {
    // 1. Cognitive (11 Soal)
    let cogCorrect = 0;
    COGNITIVE_QUESTIONS.forEach((q) => {
      if (cognitiveAnswers[q.id] === q.correctAnswer) cogCorrect++;
    });
    const cogScore = Math.round((cogCorrect / COGNITIVE_QUESTIONS.length) * 100);

    // 2. Personality Consistency (5 Set, must have valid most/least)
    const completedSets = Object.values(personalityAnswers).filter((s) => s.most && s.least).length;
    const persScore = Math.round((completedSets / PERSONALITY_SETS.length) * 100);

    // 3. SJT (4 Soal, nilai 1-4 per opsi)
    let sjtTotalPoints = 0;
    SJT_QUESTIONS.forEach((q) => {
      const chosenId = sjtAnswers[q.id];
      const opt = q.options.find((o) => o.id === chosenId);
      sjtTotalPoints += opt ? opt.score : 2;
    });
    const sjtScore = Math.round((sjtTotalPoints / (SJT_QUESTIONS.length * 4)) * 100);

    // 4. Kraepelin (90 Detik: Akurasi & Kecepatan)
    const accuracy = kraepelinTotalAnswered > 0 ? Math.round((kraepelinCorrect / kraepelinTotalAnswered) * 100) : 0;
    const speedScore = Math.min(Math.round((kraepelinTotalAnswered / 35) * 100), 100);
    const kraepScore = Math.round((accuracy * 0.6) + (speedScore * 0.4));

    // 5. Logic & Algoritma (3 Soal)
    let logCorrect = 0;
    LOGIC_ALGORITHM_QUESTIONS.forEach((q) => {
      if (logicAnswers[q.id] === q.correctAnswer) logCorrect++;
    });
    const logScore = Math.round((logCorrect / LOGIC_ALGORITHM_QUESTIONS.length) * 100);

    // Weighted Overall Score (Passing Grade: >= 75%)
    const compositeScore = Math.round(
      cogScore * 0.30 +
      persScore * 0.15 +
      sjtScore * 0.20 +
      kraepScore * 0.15 +
      logScore * 0.20
    );

    const isPassed = compositeScore >= 75;

    const resultPayload = {
      totalScore: compositeScore,
      passed: isPassed,
      cognitiveScore: cogScore,
      personalityScore: persScore,
      sjtScore: sjtScore,
      kraepelinScore: kraepScore,
      logicScore: logScore,
      kraepelinTotal: kraepelinTotalAnswered,
      kraepelinAccuracy: accuracy,
    };

    setFinalScoreData(resultPayload);
    setTestFinished(true);
    savePsychologyResult(compositeScore, isPassed);

    try {
      localStorage.setItem(PSYCHO_STORAGE_KEY, JSON.stringify(resultPayload));
    } catch (e) {}

    // Save to Firestore
    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            psychologyScore: compositeScore,
            psychologyPassed: isPassed,
            psychologyCompletedAt: new Date().toISOString(),
            psychologyCognitive: cogScore,
            psychologyPersonality: persScore,
            psychologySjt: sjtScore,
            psychologyKraepelin: kraepScore,
            psychologyLogic: logScore,
            kraepelinTotal: kraepelinTotalAnswered,
            kraepelinAccuracy: accuracy,
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving psychology score to Firestore:', err);
      }
    }
  }, [cognitiveAnswers, personalityAnswers, sjtAnswers, kraepelinTotalAnswered, kraepelinCorrect, logicAnswers, candidateUid, savePsychologyResult]);

  // Handle advancing to the next subtest (Manual or Auto-Submit on Timer Expiry)
  const advanceToNextSubtest = useCallback(() => {
    if (currentSubtest < 4) {
      const nextIdx = currentSubtest + 1;
      setCurrentSubtest(nextIdx);
      setSecondsRemaining(SUBTEST_DURATIONS[nextIdx]);
    } else {
      calculateFinalScores();
    }
  }, [currentSubtest, calculateFinalScores]);

  // Rigid Timer per Subtest with Auto-Submit
  useEffect(() => {
    if (!isTestStarted || testFinished) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          advanceToNextSubtest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestStarted, testFinished, advanceToNextSubtest]);

  // Format Timer mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Kraepelin Answer Handler
  const handleKraepelinInput = (unitDigit: number) => {
    if (kraepelinIndex >= kraepelinPairs.length) return;
    const currentPair = kraepelinPairs[kraepelinIndex];
    const isCorrect = unitDigit === currentPair.correctUnit;

    setKraepelinTotalAnswered((prev) => prev + 1);
    if (isCorrect) {
      setKraepelinCorrect((prev) => prev + 1);
    }
    setKraepelinIndex((prev) => prev + 1);
  };

  // Keyboard Listener for Kraepelin
  useEffect(() => {
    if (!isTestStarted || testFinished || currentSubtest !== 3) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKraepelinInput(parseInt(e.key, 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTestStarted, testFinished, currentSubtest, kraepelinIndex, kraepelinPairs]);

  // Start Examination Handler
  const handleStartExam = () => {
    setIsTestStarted(true);
    setCurrentSubtest(0);
    setSecondsRemaining(SUBTEST_DURATIONS[0]);
  };

  const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
  const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;

  let profileIsDone = Boolean(isProfileCompleted);
  if (typeof window !== 'undefined') {
    const savedProf = localStorage.getItem('asiaplastik_profile_data');
    const savedDone = localStorage.getItem('asiaplastik_profile_completed');
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        profileIsDone = Boolean(savedDone === 'true' && isCandidateProfileComplete(parsed));
      } catch (e) {
        profileIsDone = false;
      }
    } else {
      profileIsDone = false;
    }
  }

  const docsAreDone = isDocsCompleted || (requiredDocs.length > 0 && uploadedRequiredCount >= requiredDocs.length);

  // Prerequisite Gates: Only active if test hasn't been completed yet
  if (!testFinished && !finalScoreData) {
    if (!profileIsDone) {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-800 pb-20">
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={openMobileSidebar}
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs">
                <Link href="/dashboard" className="text-slate-400 hover:text-sky-600">
                  Dashboard
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-900">Psikotes Online Pelamar</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Tahap 4 Terkunci</span>
              </span>
              <a
                href="https://wa.me/6282244109503"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bantuan HRD</span>
              </a>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6 my-auto">
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  Tahap 4 Terkunci: Prasyarat Biodata Diri
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Lengkapi Formulir Biodata Diri Terlebih Dahulu
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sesuai dengan regulasi rekrutmen terpadu CV. Asia Plastik, Anda wajib melengkapi data pribadi, kontak darurat, dan riwayat pendidikan pada <strong>Tahap 2</strong> sebelum dapat mengakses asesmen psikotes online.
                </p>
              </div>

              {/* Stepper Status Visual */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Alur Tahapan Rekrutmen:
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    ✓
                  </span>
                  <span className="text-slate-700 font-semibold">Tahap 1: Registrasi & Pilihan Posisi Lowongan</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </span>
                  <span className="text-slate-900 font-bold">Tahap 2: Pengisian Biodata Diri (Perlu Dilengkapi)</span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-60">
                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                    <Lock className="w-3 h-3" />
                  </span>
                  <span className="text-slate-500 font-medium">Tahap 3: Unggah Berkas & CV (Terkunci)</span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-60">
                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                    <Lock className="w-3 h-3" />
                  </span>
                  <span className="text-slate-500 font-medium">Tahap 4: Psikotes Online (Terkunci)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Isi Formulir Biodata Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      );
    }

    if (!docsAreDone) {
      return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-800 pb-20">
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={openMobileSidebar}
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs">
                <Link href="/dashboard" className="text-slate-400 hover:text-sky-600">
                  Dashboard
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-900">Psikotes Online Pelamar</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Tahap 4 Terkunci</span>
              </span>
              <a
                href="https://wa.me/6282244109503"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bantuan HRD</span>
              </a>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6 my-auto">
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  Tahap 4 Terkunci: Prasyarat Berkas Belum Lengkap
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Unggah Seluruh Berkas & Dokumen CV Terlebih Dahulu
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Anda baru mengunggah <strong>{uploadedRequiredCount} dari {requiredDocs.length || 5} berkas wajib</strong> (CV, KTP, Ijazah, Pas Foto, SKCK). Sesuai alur resmi rekrutmen CV. Asia Plastik, seluruh berkas wajib harus diunggah di <strong>Tahap 3</strong> sebelum Anda diizinkan mengerjakan Psikotes Online.
                </p>
              </div>

              {/* Stepper Status Visual */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Alur Tahapan Rekrutmen:
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    ✓
                  </span>
                  <span className="text-slate-700 font-semibold">Tahap 1: Registrasi & Pilihan Posisi Lowongan</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    ✓
                  </span>
                  <span className="text-slate-700 font-semibold">Tahap 2: Pengisian Biodata Diri (Lengkap)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </span>
                  <span className="text-slate-900 font-bold">
                    Tahap 3: Unggah Berkas & CV ({uploadedRequiredCount}/{requiredDocs.length || 5} Berkas)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-60">
                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                    <Lock className="w-3 h-3" />
                  </span>
                  <span className="text-slate-500 font-medium">Tahap 4: Psikotes Online (Terkunci)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/screening"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Unggah Berkas Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={openMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/dashboard" className="text-slate-400 hover:text-sky-600">
              Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900">Psikotes Online Pelamar</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2.5 py-1 rounded-full border border-sky-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Standar Asesmen Nasional & SHL</span>
            <span className="sm:hidden">Standar Psikotes</span>
          </span>
          <a
            href="https://wa.me/6282244109503"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bantuan HRD</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* ========================================================
            CASE 1: ROADMAP STEPPER UTAMA - PANDUAN LENGKAP & CONTOH SOAL
            (Desain Terpilih - Fixed Launchpad Pelamar)
            ======================================================== */}
        {!isTestStarted && !testFinished && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-300">
            {/* Header Brief & Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 inline-block">
                    Tahap 4 Seleksi Resmi
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Standar SHL & Nasional
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Roadmap Asesmen Psikotes Terpadu
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pelamar: <strong className="text-slate-800">{candidateName}</strong> • Posisi: <strong className="text-slate-800">{candidateRole}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <div className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-center">
                  <span className="block text-[10px] text-slate-400">Total Durasi</span>
                  <strong className="text-base font-bold text-sky-400">41 Menit</strong>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                  <span className="block text-[10px] text-sky-600">Ambang Kelulusan</span>
                  <strong className="text-base font-bold text-sky-900">75%</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Bar for Guides */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  <strong>Petunjuk & Contoh Soal:</strong> Pelajari tata cara pengerjaan dan coba simulasi contoh soal di bawah ini sebelum memulai tes resmi.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleAllGuides}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 font-bold text-[11px] transition-all shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{allExpanded ? 'Tutup Semua Panduan' : 'Buka Semua Panduan & Contoh Soal'}</span>
                {allExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Vertical Stepper Timeline with Connecting Line */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 via-blue-500 to-indigo-600">
              {/* ======================================================
                  STEP 1: TES KEMAMPUAN KOGNITIF (APTITUDE TEST)
                  ====================================================== */}
              <div className="relative pl-6 space-y-3 group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                  1
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">Tes Kemampuan Kognitif (Aptitude Test)</h4>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Bobot 25%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mengukur kecerdasan daya tangkap dan logika analitis melalui 3 domain: Logika Numerik (deret angka), Logika Verbal (silogisme & analogi), dan Logika Spasial visual 3D.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0">
                    12 Menit • 11 Soal
                  </span>
                </div>

                {/* Toggle Guide & Example Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGuide(1)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/80 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{expandedGuides[1] ? 'Sembunyikan Panduan & Contoh Soal' : 'Lihat Cara Mengerjakan & Contoh Soal Sub-tes 1'}</span>
                    {expandedGuides[1] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Box: Cara Mengerjakan & Contoh Soal Kognitif */}
                {expandedGuides[1] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-4 animate-in fade-in duration-200 text-xs">
                    {/* Petunjuk Cara Mengerjakan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-sky-950">
                        <BookOpen className="w-4 h-4 text-sky-700" />
                        <span>Cara Mengerjakan Sub-tes 1:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                        <li>
                          <strong>Format Soal:</strong> Berisi 11 butir soal pilihan ganda (A, B, C, D) yang menguji deret angka, silogisme rasional, dan penalaran matriks 3 dimensi.
                        </li>
                        <li>
                          <strong>Alokasi Waktu:</strong> Disediakan 12 menit (~65 detik per soal). Dahulukan mengerjakan soal yang polanya langsung Anda pahami.
                        </li>
                        <li>
                          <strong>Aturan Penilaian:</strong> Tidak ada sistem minus untuk jawaban salah. Pastikan seluruh soal dijawab sebelum timer auto-submit.
                        </li>
                      </ul>
                    </div>

                    {/* Kotak Contoh Soal Interaktif */}
                    <div className="p-4 rounded-xl bg-white border border-sky-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-sky-600" />
                          Contoh Soal Latihan: Logika Numerik (Deret Angka)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Simulasi Interaktif</span>
                      </div>

                      <p className="text-slate-800 font-medium">
                        Tentukan angka berikutnya pada barisan deret di bawah ini: <br />
                        <span className="font-mono font-bold text-sky-800 text-sm tracking-widest bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100 mt-1 inline-block">
                          3, 8, 18, 38, 78, [ ... ]
                        </span>
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {[
                          { id: 'A', text: '148' },
                          { id: 'B', text: '158' },
                          { id: 'C', text: '168' },
                          { id: 'D', text: '178' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPracticeCogAnswer(opt.id)}
                            className={`p-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                              practiceCogAnswer === opt.id
                                ? opt.id === 'B'
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400'
                                  : 'bg-rose-50 border-rose-400 text-rose-800'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt.id}. {opt.text}</span>
                          </button>
                        ))}
                      </div>

                      {/* Penjelasan Kunci */}
                      {practiceCogAnswer && (
                        <div
                          className={`p-3 rounded-lg text-[11px] leading-relaxed border ${
                            practiceCogAnswer === 'B'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <strong className="block font-bold">
                            {practiceCogAnswer === 'B' ? '✅ Jawaban Benar (B. 158)!' : '⚠️ Jawaban Kurang Tepat! Kunci yang benar adalah B (158).'}
                          </strong>
                          <span>
                            <strong>Pembahasan Pola:</strong> Setiap suku merupakan hasil perkalian 2 dari suku sebelumnya lalu ditambah 2: <br />
                            • (3 × 2) + 2 = 8 <br />
                            • (8 × 2) + 2 = 18 <br />
                            • (18 × 2) + 2 = 38 <br />
                            • (38 × 2) + 2 = 78 <br />
                            • (78 × 2) + 2 = <strong>158</strong>.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================
                  STEP 2: TES KEPRIBADIAN (WORK STYLE INVENTORY)
                  ====================================================== */}
              <div className="relative pl-6 space-y-3 group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                  2
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">Tes Kepribadian (Work Style Inventory)</h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Bobot 20%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Format Forced-Choice DISC/PAPI Kostick: Mengukur profil etos kerja, konsistensi etika, stabilitas kepribadian, dan kecocokan budaya kerja manufaktur.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shrink-0">
                    10 Menit • 5 Set Pernyataan
                  </span>
                </div>

                {/* Toggle Guide & Example Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGuide(2)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{expandedGuides[2] ? 'Sembunyikan Panduan & Contoh Soal' : 'Lihat Cara Mengerjakan & Contoh Soal Sub-tes 2'}</span>
                    {expandedGuides[2] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Box: Cara Mengerjakan & Contoh Soal Kepribadian */}
                {expandedGuides[2] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 animate-in fade-in duration-200 text-xs">
                    {/* Petunjuk Cara Mengerjakan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-blue-950">
                        <BookOpen className="w-4 h-4 text-blue-700" />
                        <span>Cara Mengerjakan Sub-tes 2 (Format Forced-Choice):</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                        <li>
                          <strong>Mekanisme Most & Least:</strong> Di setiap kelompok terdapat 4 pernyataan kerja. Anda <strong>WAJIB</strong> memilih 1 pernyataan yang <strong>[M] (Paling Menggambarkan)</strong> dan 1 pernyataan yang <strong>[L] (Paling Tidak Menggambarkan)</strong> diri Anda.
                        </li>
                        <li>
                          <strong>Aturan Validasi:</strong> Anda TIDAK dapat memilih kolom [M] dan kolom [L] pada baris pernyataan yang sama.
                        </li>
                        <li>
                          <strong>Konsistensi Jawaban:</strong> Tidak ada jawaban benar atau salah. Sistem psikometri mengukur konsistensi pola kepribadian dan integritas kerja Anda.
                        </li>
                      </ul>
                    </div>

                    {/* Kotak Contoh Latihan Interaktif Most/Least */}
                    <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                          Simulasi Latihan Format Most [M] dan Least [L]
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Coba Klik Tombol M & L</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 'p1', text: 'Saya selalu teliti memeriksa kepatuhan spesifikasi sebelum meloloskan barang.' },
                          { id: 'p2', text: 'Saya berani mengambil inisiatif cepat saat mesin lini produksi mengalami kendala.' },
                          { id: 'p3', text: 'Saya mengutamakan kerja sama tim yang rukun dan suasana kerja harmonis.' },
                          { id: 'p4', text: 'Saya menyukai metode kerja yang terencana rapi dengan instruksi kerja (SOP) tertulis.' },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                              practicePersMost === item.id
                                ? 'bg-sky-50 border-sky-300'
                                : practicePersLeast === item.id
                                ? 'bg-rose-50 border-rose-300'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-slate-800 flex-1 leading-snug">{item.text}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setPracticePersMost(item.id);
                                  if (practicePersLeast === item.id) setPracticePersLeast(null);
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  practicePersMost === item.id
                                    ? 'bg-sky-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                [M] Paling
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPracticePersLeast(item.id);
                                  if (practicePersMost === item.id) setPracticePersMost(null);
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  practicePersLeast === item.id
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                [L] Kurang
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feedback Interaktif */}
                      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                        {practicePersMost && practicePersLeast ? (
                          <span>
                            ✅ <strong>Format Pilihan Anda Sempurna!</strong> Anda telah memilih 1 pernyataan [M] dan 1 pernyataan [L] pada baris berbeda. Pada tes asli, lengkapi ke-5 set pernyataan seperti ini.
                          </span>
                        ) : (
                          <span>
                            👉 <em>Pilih 1 tombol <strong>[M]</strong> dan 1 tombol <strong>[L]</strong> pada dua baris yang berbeda untuk mencoba simulasi.</em>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================
                  STEP 3: SITUATIONAL JUDGMENT TEST (SJT)
                  ====================================================== */}
              <div className="relative pl-6 space-y-3 group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                  3
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">Situational Judgment Test (SJT)</h4>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Bobot 20%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Skenario dilema operasional pabrik manufaktur plastik (konflik mutu, kepatuhan K3, integritas stok) untuk menguji respons etika dan kepemimpinan profesional.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shrink-0">
                    10 Menit • 4 Kasus Nyata
                  </span>
                </div>

                {/* Toggle Guide & Example Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGuide(3)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{expandedGuides[3] ? 'Sembunyikan Panduan & Contoh Soal' : 'Lihat Cara Mengerjakan & Contoh Soal Sub-tes 3'}</span>
                    {expandedGuides[3] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Box: Cara Mengerjakan & Contoh Soal SJT */}
                {expandedGuides[3] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-4 animate-in fade-in duration-200 text-xs">
                    {/* Petunjuk Cara Mengerjakan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                        <BookOpen className="w-4 h-4 text-indigo-700" />
                        <span>Cara Mengerjakan Sub-tes 3:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                        <li>
                          <strong>Evaluasi Dilema:</strong> Anda dihadapkan pada skenario kerja nyata di pabrik di mana terjadi pertentangan antara target kecepatan, SOP mutu, dan keselamatan kerja (K3).
                        </li>
                        <li>
                          <strong>Kriteria Pilihan:</strong> Pilih 1 tindakan yang paling menunjukkan integritas, kepatuhan standar mutu ISO 9001, serta komunikasi yang beretika.
                        </li>
                        <li>
                          <strong>Hindari Solusi Pintas:</strong> Hindari tindakan yang meloloskan barang cacat atau menyembunyikan kesalahan demi mengejar target sesaat.
                        </li>
                      </ul>
                    </div>

                    {/* Kotak Contoh Soal Interaktif SJT */}
                    <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                          Contoh Kasus Operasional: Dilema Mutu vs Deadline Pengiriman
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Simulasi Interaktif</span>
                      </div>

                      <p className="text-slate-800 leading-relaxed">
                        <em>
                          &quot;Menjelang jam pengiriman sore, ditemukan 2 palet produk botol plastik dengan cacat goresan halus yang melebihi toleransi visual. Staf Penjualan mendesak agar produk tetap dimuat ke truk karena pelanggan meminta barang sampai hari ini. Tindakan terbaik Anda adalah...&quot;
                        </em>
                      </p>

                      <div className="space-y-2 pt-1">
                        {[
                          {
                            id: 'A',
                            text: 'Meloloskan pengiriman dengan memberi diskon informal kepada supir ekspedisi.',
                            isBest: false,
                          },
                          {
                            id: 'B',
                            text: 'Menahan lot tersebut, melakukan sortir cepat bersama tim QC, dan menginformasikan manajemen untuk menjadwalkan pengiriman pengganti sesuai SOP mutu ISO 9001.',
                            isBest: true,
                          },
                          {
                            id: 'C',
                            text: 'Mematikan sistem komputer dan membiarkan truk pengiriman menunggu tanpa kepastian.',
                            isBest: false,
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPracticeSjtAnswer(opt.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                              practiceSjtAnswer === opt.id
                                ? opt.isBest
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400'
                                  : 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-bold shrink-0">{opt.id}.</span>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        ))}
                      </div>

                      {/* Penjelasan Kunci */}
                      {practiceSjtAnswer && (
                        <div
                          className={`p-3 rounded-lg text-[11px] leading-relaxed border ${
                            practiceSjtAnswer === 'B'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <strong className="block font-bold">
                            {practiceSjtAnswer === 'B'
                              ? '✅ Pilihan Respons Terbaik (B)!'
                              : '⚠️ Kurang Tepat! Pilihan terbaik adalah B.'}
                          </strong>
                          <span>
                            <strong>Ulasan Etika Industri:</strong> Meloloskan barang cacat berisiko memicu retur massal dan klaim ganti rugi dari klien yang merusak reputasi pabrik. Tindakan terbaik adalah menahan lot, melakukan sortir cepat, dan mengomunikasikan jadwal kirim pengganti secara transparan.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================
                  STEP 4: TES KETELITIAN & KECEPATAN (KRAEPELIN DIGITAL)
                  ====================================================== */}
              <div className="relative pl-6 space-y-3 group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                  4
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">Tes Ketelitian & Kecepatan (Kraepelin Digital)</h4>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Bobot 15%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tes koran digital: penjumlahan cepat dua angka acak beruntun untuk mengukur fokus, tempo kerja, dan ketahanan di bawah tekanan waktu.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shrink-0">
                    90 Detik Cepat • Aliran Kontinu
                  </span>
                </div>

                {/* Toggle Guide & Example Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGuide(4)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{expandedGuides[4] ? 'Sembunyikan Panduan & Contoh Soal' : 'Lihat Cara Mengerjakan & Mini Simulasi Kraepelin'}</span>
                    {expandedGuides[4] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Box: Cara Mengerjakan & Mini Kraepelin Simulator */}
                {expandedGuides[4] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-4 animate-in fade-in duration-200 text-xs">
                    {/* Petunjuk Cara Mengerjakan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-teal-950">
                        <BookOpen className="w-4 h-4 text-teal-700" />
                        <span>Cara Mengerjakan Sub-tes 4 (Aturan Digit Satuan):</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                        <li>
                          <strong>ATURAN SATUAN (Paling Penting):</strong> Jumlahkan dua angka yang muncul di layar. Jika hasil penjumlahan adalah dua digit (≥ 10), <strong>HANYA KETIKKAN DIGIT TERAKHIRNYA (SATUANNYA) SAJA</strong>!
                          <div className="mt-1 p-2 rounded bg-white border border-teal-200 font-mono text-[11px] text-teal-900 space-y-0.5">
                            <div>• 3 + 4 = 7 &rarr; Jawab: <strong>7</strong></div>
                            <div>• 8 + 7 = 15 &rarr; Jawab: <strong>5</strong> (bukan 15)</div>
                            <div>• 9 + 9 = 18 &rarr; Jawab: <strong>8</strong></div>
                            <div>• 6 + 4 = 10 &rarr; Jawab: <strong>0</strong></div>
                          </div>
                        </li>
                        <li>
                          <strong>Input Mudah:</strong> Anda bisa mengetik langsung tombol angka <strong>0–9 di keyboard fisik laptop/PC</strong> atau mengklik keypad di layar.
                        </li>
                        <li>
                          <strong>Auto-Flow:</strong> Setiap menekan tombol angka, sistem langsung melompat ke pasangan angka berikutnya secara instan tanpa perlu menekan Enter.
                        </li>
                      </ul>
                    </div>

                    {/* Mini Kraepelin Simulator */}
                    <div className="p-4 rounded-xl bg-white border border-teal-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-teal-600" />
                          Mini Simulator Kraepelin (Coba Jawab Sekarang)
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Berhasil: {kraepelinDrill.correctCount}x
                        </span>
                      </div>

                      {/* Math Display */}
                      <div className="text-center py-2 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                          Berapa digit satuan hasil penjumlahan ini?
                        </span>
                        <div className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-inner font-mono text-2xl font-black">
                          <span className="text-sky-400">{kraepelinDrill.n1}</span>
                          <span className="text-slate-500">+</span>
                          <span className="text-emerald-400">{kraepelinDrill.n2}</span>
                          <span className="text-slate-500">=</span>
                          <span className="text-amber-400">?</span>
                        </div>
                      </div>

                      {/* Interactive Keypad 0-9 */}
                      <div className="max-w-xs mx-auto">
                        <div className="grid grid-cols-5 gap-1.5">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleKraepelinDrillInput(val)}
                              className="py-2 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white border border-slate-300 font-mono font-bold text-sm text-slate-800 transition-colors active:scale-95 shadow-sm cursor-pointer"
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback Simulator */}
                      {kraepelinDrill.feedback && (
                        <div
                          className={`p-2.5 rounded-lg text-[11px] leading-relaxed text-center font-medium border ${
                            kraepelinDrill.feedback.includes('Hebat')
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}
                        >
                          {kraepelinDrill.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================
                  STEP 5: TES LOGIKA ALGORITMA & ALUR SISTEM
                  ====================================================== */}
              <div className="relative pl-6 space-y-3 group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow">
                  5
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">Tes Logika Algoritma & Alur Sistem</h4>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Bobot 20%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Analisis diagram alur percabangan flowchart, optimasi antrian mesin (SPT), dan investigasi akar penyebab 5-Why problem solving.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                    8 Menit • 3 Studi Kasus Teknis
                  </span>
                </div>

                {/* Toggle Guide & Example Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGuide(5)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{expandedGuides[5] ? 'Sembunyikan Panduan & Contoh Soal' : 'Lihat Cara Mengerjakan & Contoh Soal Sub-tes 5'}</span>
                    {expandedGuides[5] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Box: Cara Mengerjakan & Contoh Soal Logika Algoritma */}
                {expandedGuides[5] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/60 border border-slate-200 space-y-4 animate-in fade-in duration-200 text-xs">
                    {/* Petunjuk Cara Mengerjakan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-950">
                        <BookOpen className="w-4 h-4 text-slate-700" />
                        <span>Cara Mengerjakan Sub-tes 5:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                        <li>
                          <strong>3 Konsep Pemecahan Masalah:</strong> Menguji pemahaman terhadap alur kondisi mesin (Flowchart IF-THEN), optimasi urutan pengerjaan pesanan (Shortest Processing Time / SPT), dan metode investigasi akar masalah 5-Why.
                        </li>
                        <li>
                          <strong>Telusuri Logika Sistem:</strong> Ikuti urutan flowchart langkah demi langkah sesuai input data sensor yang tertera pada soal.
                        </li>
                      </ul>
                    </div>

                    {/* Kotak Contoh Soal Interaktif Flowchart */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5 text-slate-700" />
                          Contoh Logika Flowchart: Kontrol Suhu Barel Ekstrusi
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Simulasi Interaktif</span>
                      </div>

                      {/* Visual Flowchart Box */}
                      <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 overflow-x-auto">
                        <div className="text-sky-400 font-bold">[Mulai: Sensor Suhu Barel]</div>
                        <div>├── Apakah Suhu &gt; 220°C?</div>
                        <div>│   ├── [YA]   &rarr; <span className="text-amber-400 font-bold">Jalankan Chiller Pendingin Otomatis</span></div>
                        <div>│   └── [TIDAK]&rarr; Apakah Suhu &lt; 190°C?</div>
                        <div>│                   ├── [YA]   &rarr; <span className="text-rose-400 font-bold">Nyalakan Elemen Pemanas Barel</span></div>
                        <div>│                   └── [TIDAK]&rarr; <span className="text-emerald-400 font-bold">Suhu Optimal: Pertahankan Kecepatan Mesin</span></div>
                      </div>

                      <p className="text-slate-800 font-medium">
                        Jika sensor mendeteksi suhu barel saat ini adalah <strong>232°C</strong>, tindakan otomatis sistem berikutnya adalah...
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {[
                          { id: 'A', text: 'Nyalakan Elemen Pemanas', isCorrect: false },
                          { id: 'B', text: 'Jalankan Chiller Pendingin Otomatis', isCorrect: true },
                          { id: 'C', text: 'Matikan Seluruh Mesin', isCorrect: false },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPracticeLogicAnswer(opt.id)}
                            className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                              practiceLogicAnswer === opt.id
                                ? opt.isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                                  : 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt.id}. {opt.text}</span>
                          </button>
                        ))}
                      </div>

                      {/* Penjelasan Kunci */}
                      {practiceLogicAnswer && (
                        <div
                          className={`p-3 rounded-lg text-[11px] leading-relaxed border ${
                            practiceLogicAnswer === 'B'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <strong className="block font-bold">
                            {practiceLogicAnswer === 'B'
                              ? '✅ Tepat Sekali (B)!'
                              : '⚠️ Kurang Tepat! Kunci yang benar adalah B.'}
                          </strong>
                          <span>
                            <strong>Pembahasan Alur:</strong> Suhu 232°C &gt; 220°C, sehingga kondisi percabangan pertama bernilai YA. Sistem segera menyalakan Chiller Pendingin Otomatis agar biji plastik di barel tidak mengalami degradasi termal (hangus).
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Readiness Callout & Passing Criteria */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Ketentuan Penting & Mekanisme Waktu Kaku (Rigid Timer):</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 text-[11px] leading-relaxed">
                <li>
                  Setiap sub-tes diatur dengan batas waktu rigid tersendiri. Ketika waktu habis, lembar jawaban akan di-<strong>auto submit</strong> otomatis dan Anda langsung dipindahkan ke sub-tes berikutnya tanpa bisa merevisi sub-tes sebelumnya.
                </li>
                <li>
                  Batas kelulusan minimum (Passing Grade) adalah <strong>75%</strong> dari total bobot evaluasi. Jika dinyatakan <strong>LULUS</strong>, tahap berikutnya yaitu <strong>Ujian Kompetensi Keahlian Teknis</strong> akan otomatis terbuka di portal pelamar Anda.
                </li>
              </ul>
            </div>

            {/* Checkbox Konfirmasi Kesiapan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                id="agree-rules"
                type="checkbox"
                checked={hasAgreedToRules}
                onChange={(e) => setHasAgreedToRules(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="agree-rules" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                <strong>Konfirmasi Kesiapan Ujian:</strong> Saya telah membaca petunjuk cara pengerjaan dan memahami simulasi contoh soal untuk ke-5 sub-tes di atas. Saya siap memulai sesi asesmen resmi berbatas waktu ini secara mandiri dan jujur.
              </label>
            </div>

            {/* Launch Action CTA */}
            <div className="text-center pt-2">
              <button
                type="button"
                disabled={!hasAgreedToRules}
                onClick={handleStartExam}
                className={`px-8 py-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mx-auto ${
                  hasAgreedToRules
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25 hover:scale-[1.02] cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Mulai Menjalani Sesi Asesmen Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Pastikan perangkat baterai cukup dan koneksi internet stabil sebelum memulai.
              </p>
            </div>
          </div>
        )}


        {/* ========================================================
            CASE 2: TEST RUNNER AKTIF (SUBTEST 1 - 5)
            ======================================================== */}
        {isTestStarted && !testFinished && (
          <div className="space-y-6">
            {/* Top Bar Runner: Active Subtest Name + Stepper + Rigid Timer */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800">
                    Sub-tes {currentSubtest + 1} dari 5
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {SUBTEST_NAMES[currentSubtest]}
                  </span>
                </div>
                {/* Visual Progress Stepper */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step === currentSubtest
                          ? 'w-10 bg-sky-600'
                          : step < currentSubtest
                          ? 'w-6 bg-emerald-500'
                          : 'w-6 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer Badge + Action Button */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <div className={`px-4 py-2 rounded-xl text-white font-mono font-bold text-sm flex items-center gap-2 shadow-sm ${
                  secondsRemaining < 60 ? 'bg-rose-600 animate-pulse' : 'bg-slate-900'
                }`}>
                  <Timer className="w-4 h-4 text-sky-400" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  type="button"
                  onClick={advanceToNextSubtest}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>{currentSubtest === 4 ? 'Kumpulkan Psikotes' : 'Lanjut ke Sub-tes Berikutnya'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------
                SUBTEST 1 CONTENT: COGNITIVE APTITUDE (11 SOAL)
                ---------------------------------------------------- */}
            {currentSubtest === 0 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-xs">
                  <strong>Petunjuk Sub-tes 1:</strong> Jawablah seluruh soal kognitif di bawah ini dengan memilih satu jawaban yang paling benar. Waktu otomatis mengumpulkan saat hitungan mundur habis.
                </div>

                {COGNITIVE_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200/60">
                        Soal #{idx + 1} • {q.subTypeLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {cognitiveAnswers[q.id] ? 'Terjawab' : 'Belum Dijawab'}
                      </span>
                    </div>

                    {q.contextText && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                        {q.contextText}
                      </div>
                    )}

                    {q.tableData && (
                      <div className="overflow-x-auto my-2 border border-slate-200 rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              {q.tableData.headers.map((h, i) => (
                                <th key={i} className="p-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {q.tableData.rows.map((row, rI) => (
                              <tr key={rI} className="hover:bg-slate-50">
                                {row.map((cell, cI) => (
                                  <td key={cI} className="p-2.5">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                      {q.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isChecked = cognitiveAnswers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => setCognitiveAnswers({ ...cognitiveAnswers, [q.id]: opt.id })}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-all ${
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
                  </div>
                ))}
              </div>
            )}

            {/* ----------------------------------------------------
                SUBTEST 2 CONTENT: PERSONALITY (FORCED-CHOICE MOST / LEAST)
                ---------------------------------------------------- */}
            {currentSubtest === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-xs space-y-1">
                  <strong>Petunjuk Sub-tes 2 (Personality Inventory):</strong>
                  <p className="text-[11px] text-sky-800">
                    Pada setiap kelompok di bawah ini, pilih 1 pernyataan yang <strong>Paling Menggambarkan diri Anda (M = Most)</strong> dan 1 pernyataan yang <strong>Paling Tidak Menggambarkan diri Anda (L = Least)</strong>. Pilihan M dan L tidak boleh berada pada baris yang sama.
                  </p>
                </div>

                {PERSONALITY_SETS.map((set, setIdx) => {
                  const currentAns = personalityAnswers[set.id] || {};

                  return (
                    <div key={set.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200/60">
                          Kelompok Pernyataan #{setIdx + 1}
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          currentAns.most && currentAns.least ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {currentAns.most && currentAns.least ? 'Lengkap (M & L Terpilih)' : 'Belum Lengkap'}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {set.options.map((opt) => {
                          const isMost = currentAns.most === opt.id;
                          const isLeast = currentAns.least === opt.id;

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                                isMost
                                  ? 'border-emerald-300 bg-emerald-50/50'
                                  : isLeast
                                  ? 'border-rose-300 bg-rose-50/50'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed flex-1">
                                {opt.text}
                              </p>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newLeast = currentAns.least === opt.id ? undefined : currentAns.least;
                                    setPersonalityAnswers({
                                      ...personalityAnswers,
                                      [set.id]: { most: isMost ? undefined : opt.id, least: newLeast },
                                    });
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isMost
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                                  }`}
                                  title="Paling Menggambarkan Diri Anda"
                                >
                                  M (Paling)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMost = currentAns.most === opt.id ? undefined : currentAns.most;
                                    setPersonalityAnswers({
                                      ...personalityAnswers,
                                      [set.id]: { most: newMost, least: isLeast ? undefined : opt.id },
                                    });
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isLeast
                                      ? 'bg-rose-600 text-white shadow-sm'
                                      : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                                  }`}
                                  title="Paling Tidak Menggambarkan Diri Anda"
                                >
                                  L (Kurang)
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ----------------------------------------------------
                SUBTEST 3 CONTENT: SITUATIONAL JUDGMENT TEST (SJT)
                ---------------------------------------------------- */}
            {currentSubtest === 2 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-xs">
                  <strong>Petunjuk Sub-tes 3 (SJT):</strong> Baca setiap kasus dilema industri berikut dan pilihlah tindakan atau respons yang <strong>PALING TEPAT & PROFESIONAL</strong> menurut pertimbangan kerja Anda.
                </div>

                {SJT_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200/60">
                        Kasus #{idx + 1} • {q.scenarioTitle}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {sjtAnswers[q.id] ? 'Terjawab' : 'Belum Dijawab'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      {q.scenario}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isChecked = sjtAnswers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => setSjtAnswers({ ...sjtAnswers, [q.id]: opt.id })}
                            className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-all ${
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
                  </div>
                ))}
              </div>
            )}

            {/* ----------------------------------------------------
                SUBTEST 4 CONTENT: KRAEPELIN / PAULI DIGITAL ("TES KORAN")
                ---------------------------------------------------- */}
            {currentSubtest === 3 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center max-w-xl mx-auto">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    Sesi Ketelitian Cepat (90 Detik)
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    Penjumlahan Kraepelin Digital
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Jumlahkan kedua angka di layar, lalu ketik <strong>angka satuannya saja</strong>. (Contoh: 7 + 8 = 15, ketik <strong>5</strong>).
                  </p>
                </div>

                {/* Score Live Stats */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Terjawab</span>
                    <strong className="text-slate-800 text-base font-mono">{kraepelinTotalAnswered}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Jawaban Benar</span>
                    <strong className="text-emerald-700 text-base font-mono">{kraepelinCorrect}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Akurasi</span>
                    <strong className="text-sky-700 text-base font-mono">
                      {kraepelinTotalAnswered > 0 ? Math.round((kraepelinCorrect / kraepelinTotalAnswered) * 100) : 0}%
                    </strong>
                  </div>
                </div>

                {/* Interactive Number Stream Card */}
                {kraepelinPairs[kraepelinIndex] && (
                  <div className="w-48 mx-auto p-6 rounded-3xl bg-gradient-to-b from-sky-50 to-blue-50 border-2 border-sky-300 shadow-inner space-y-3">
                    <div className="text-5xl font-black font-mono text-slate-900">
                      {kraepelinPairs[kraepelinIndex].top}
                    </div>
                    <div className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                      + (Tambah)
                    </div>
                    <div className="text-5xl font-black font-mono text-slate-900">
                      {kraepelinPairs[kraepelinIndex].bottom}
                    </div>
                  </div>
                )}

                {/* Screen Keypad for Fast Tapping */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400">Tekan tombol angka keyboard (0-9) atau tombol keypad di bawah:</span>
                  <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKraepelinInput(num)}
                        className="h-12 rounded-xl bg-slate-100 hover:bg-sky-600 hover:text-white font-mono font-bold text-lg text-slate-800 transition-colors shadow-sm active:scale-95"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                SUBTEST 5 CONTENT: LOGIKA ALGORITMA & SISTEM
                ---------------------------------------------------- */}
            {currentSubtest === 4 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-xs">
                  <strong>Petunjuk Sub-tes 5 (Logika Algoritma):</strong> Evaluasi logika alur sistem kerja, keputusan percabangan, dan pemecahan masalah akar penyebab.
                </div>

                {LOGIC_ALGORITHM_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200/60">
                        Soal #{idx + 1} • {q.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {logicAnswers[q.id] ? 'Terjawab' : 'Belum Dijawab'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                      {q.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isChecked = logicAnswers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => setLogicAnswers({ ...logicAnswers, [q.id]: opt.id })}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-all ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            CASE 3: HASIL KELULUSAN PSIKOTES LENGKAP & UNLOCK TAHAP BERIKUTNYA
            ======================================================== */}
        {testFinished && finalScoreData && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in">
            {/* Header Result Badge */}
            <div className="text-center max-w-lg mx-auto space-y-3">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-white ${
                  finalScoreData.passed
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/25'
                    : 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/25'
                }`}
              >
                {finalScoreData.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  finalScoreData.passed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {finalScoreData.passed ? 'Status: LULUS PSIKOTES' : 'Status: BELUM MEMENUHI STANDAR'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {finalScoreData.passed
                  ? 'Selamat! Anda Dinyatakan Lulus Psikotes Online'
                  : 'Hasil Evaluasi Psikotes Online'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {finalScoreData.passed
                  ? 'Total nilai akumulasi psikometrik Anda telah melampaui batas minimum kualifikasi (Passing Grade 75%). Anda berhak melanjutkan ke Ujian Kompetensi Keahlian Teknis!'
                  : 'Skor akumulasi Anda belum mencapai batas minimum kelulusan 75%. Tim HRD CV. Asia Plastik akan mereview kembali profil data Anda.'}
              </p>
            </div>

            {/* Score Breakdown Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-bold text-sm text-slate-900">Total Akumulasi Skor Psikotes</span>
                <span className={`text-2xl font-black font-mono ${
                  finalScoreData.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {finalScoreData.totalScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px]">1. Kognitif (Aptitude)</span>
                  <strong className="text-slate-800 text-sm font-mono">{finalScoreData.cognitiveScore}%</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px]">2. Kepribadian (Work Style)</span>
                  <strong className="text-slate-800 text-sm font-mono">{finalScoreData.personalityScore}%</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px]">3. Situational (SJT)</span>
                  <strong className="text-slate-800 text-sm font-mono">{finalScoreData.sjtScore}%</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px]">4. Kraepelin (Akurasi)</span>
                  <strong className="text-slate-800 text-sm font-mono">{finalScoreData.kraepelinScore}%</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px]">5. Logika Algoritma</span>
                  <strong className="text-slate-800 text-sm font-mono">{finalScoreData.logicScore}%</strong>
                </div>
              </div>
            </div>

            {/* UNLOCKED CALL TO ACTION: BUKA UJIAN KOMPETENSI KEAHLIAN TEKNIS */}
            {finalScoreData.passed ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-sky-600/20">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    Tahapan Selanjutnya Terbuka
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">
                    Ujian Kompetensi Keahlian Teknis
                  </h3>
                  <p className="text-xs text-sky-100 max-w-xl leading-relaxed">
                    Karena Anda telah lulus Psikotes, lembar soal kompetensi keahlian teknis khusus untuk posisi yang Anda lamar kini telah terbuka.
                  </p>
                </div>

                <Link
                  href="/dashboard/skill-test"
                  className="px-5 py-3 rounded-xl bg-white text-sky-700 font-bold text-xs sm:text-sm hover:bg-sky-50 shrink-0 shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Kerjakan Ujian Teknis Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center pt-2">
                <Link
                  href="/dashboard/status"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors"
                >
                  <span>Kembali ke Halaman Status Lamaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-slate-200 bg-white flex items-center justify-between px-6 text-xs text-slate-400 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Ujian Terakreditasi CV. Asia Plastik</span>
        </div>
        <span>© 2026 CV. Asia Plastik Sidoarjo</span>
      </footer>
    </div>
  );
}

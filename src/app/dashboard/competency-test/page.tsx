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
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
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
  const { candidate, updateCandidate } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);
  const [candidateRole, setCandidateRole] = useState(candidate.appliedRole || 'Calon Karyawan');

  // Subtest Stepper State (0 to 4, 5 = Selesai/Hasil)
  const [currentSubtest, setCurrentSubtest] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(SUBTEST_DURATIONS[0]);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);

  // Subtest 1 (Kognitif) Answers: { [questionId]: 'A' | 'B' | ... }
  const [cognitiveAnswers, setCognitiveAnswers] = useState<Record<number, string>>({});

  // Subtest 2 (Kepribadian) Answers: { [setId]: { most: 'A', least: 'B' } }
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<number, { most?: string; least?: string }>>({});

  // Subtest 3 (SJT) Answers: { [scenarioId]: 'A' | 'B' | ... }
  const [sjtAnswers, setSjtAnswers] = useState<Record<number, string>>({});

  // Subtest 4 (Kraepelin) Dynamic Pairs & Answers
  const [kraepelinPairs, setKraepelinPairs] = useState<KraepelinPair[]>([]);
  const [kraepelinIndex, setKraepelinIndex] = useState<number>(0);
  const [kraepelinCorrect, setKraepelinCorrect] = useState<number>(0);
  const [kraepelinTotalAnswered, setKraepelinTotalAnswered] = useState<number>(0);

  // Subtest 5 (Logika Algoritma) Answers: { [questionId]: 'A' | 'B' | ... }
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
      sjtTotalPoints += opt ? opt.score : 2; // default neutral if unanswered
    });
    const sjtScore = Math.round((sjtTotalPoints / (SJT_QUESTIONS.length * 4)) * 100);

    // 4. Kraepelin (90 Detik: Akurasi & Kecepatan)
    const accuracy = kraepelinTotalAnswered > 0 ? Math.round((kraepelinCorrect / kraepelinTotalAnswered) * 100) : 0;
    // Speed score benchmark: 35 answers in 90 seconds = 100%
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
  }, [cognitiveAnswers, personalityAnswers, sjtAnswers, kraepelinTotalAnswered, kraepelinCorrect, logicAnswers, candidateUid]);

  // Handle advancing to the next subtest (Manual or Auto-Submit on Timer Expiry)
  const advanceToNextSubtest = useCallback(() => {
    if (currentSubtest < 4) {
      const nextIdx = currentSubtest + 1;
      setCurrentSubtest(nextIdx);
      setSecondsRemaining(SUBTEST_DURATIONS[nextIdx]);
    } else {
      // Completed last subtest -> calculate score
      calculateFinalScores();
    }
  }, [currentSubtest, calculateFinalScores]);

  // Rigid Timer per Subtest with Auto-Submit
  useEffect(() => {
    if (!isTestStarted || testFinished) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time expired! Auto-submit this subtest immediately
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

  // Kraepelin Answer Handler (Single Unit Digit)
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

  // Physical Keyboard Listener for Kraepelin
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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-800">
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

      {/* Main Body */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
        {/* ========================================================
            CASE 1: SCREEN SEBELUM MULAI (PETUNJUK RESMI PSIKOTES)
            ======================================================== */}
        {!isTestStarted && !testFinished && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
                <Brain className="w-8 h-8" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200">
                Tahap 4 Seleksi Rekrutmen
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Psikotes & Asesmen Potensi Kerja Online
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Asesmen psikometrik resmi CV. Asia Plastik untuk mengukur kemampuan kognitif, gaya kepribadian kerja, pertimbangan situasional, ketelitian tempo Kraepelin, dan logika sistem.
              </p>
            </div>

            {/* Subtests Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Sub-tes 1
                  </span>
                  <span className="text-xs font-semibold text-slate-500">12 Menit</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Tes Kemampuan Kognitif (Aptitude)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Logika Numerik (deret & aritmatika), Logika Verbal (silogisme & analogi), dan Logika Spasial visual 3D.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Sub-tes 2
                  </span>
                  <span className="text-xs font-semibold text-slate-500">10 Menit</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Tes Kepribadian (Personality)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Format Forced-Choice: Memilih opsi yang <strong>Paling Menggambarkan (Most)</strong> dan <strong>Paling Tidak (Least)</strong> diri Anda di tempat kerja.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Sub-tes 3
                  </span>
                  <span className="text-xs font-semibold text-slate-500">10 Menit</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Situational Judgment Test (SJT)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Menilai respons etika kerja, integritas, dan profesionalitas dalam menghadapi dilema operasional pabrik.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Sub-tes 4
                  </span>
                  <span className="text-xs font-semibold text-slate-500">90 Detik</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Ketelitian Kraepelin Digital</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tes koran interaktif: menjumlahkan angka beruntun secepat mungkin untuk menguji fokus, tempo, dan ketahanan di bawah tekanan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 md:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Sub-tes 5
                  </span>
                  <span className="text-xs font-semibold text-slate-500">8 Menit</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Logika Algoritma & Alur Sistem Kerja</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Analisis flowchart percabangan kondisi mesin, optimasi antrian SPT, dan penyelesaian masalah akar penyebab (5-Why Root Cause).
                </p>
              </div>
            </div>

            {/* Critical Rules Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Ketentuan Penting Sistem Ujian Online:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-900 text-[11px] leading-relaxed">
                <li>Setiap sub-tes diatur dengan <strong>waktu rigid tersendiri</strong>. Ketika waktu di pojok layar habis, sistem akan melakukan <strong>auto-submit otomatis</strong> dan langsung memindahkan Anda ke sub-tes berikutnya tanpa bisa merevisi sub-tes sebelumnya.</li>
                <li>Setelah Anda menyelesaikan satu sub-tes, lembar jawaban tersebut akan <strong>dikunci permanen</strong>.</li>
                <li>Batas kelulusan (passing grade) adalah minimal <strong>75%</strong> dari total bobot evaluasi. Jika dinyatakan <strong>LULUS</strong>, tahap berikutnya yaitu <strong>Ujian Kompetensi Keahlian Teknis</strong> akan otomatis terbuka!</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleStartExam}
                className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
              >
                <span>Mulai Mengerjakan Psikotes Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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

                {/* Screen Keypad for Fast Tapping or Mobile */}
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
      <footer className="h-14 border-t border-slate-200 bg-white flex items-center justify-between px-6 text-xs text-slate-400 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Ujian Terakreditasi CV. Asia Plastik</span>
        </div>
        <span>© 2026 CV. Asia Plastik Sidoarjo</span>
      </footer>
    </div>
  );
}

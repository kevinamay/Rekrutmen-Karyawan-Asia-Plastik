// Three variants of the online interview studio (Mode Terang), switchable via ?variant=, on /prototype/interview.
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Clock,
  User,
  Info,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  Settings,
  Award,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Layers,
  MessageSquare,
  Sparkles,
  PhoneOff,
  SlidersHorizontal,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';
import {
  InterviewService,
  InterviewScorecard,
  AudioDevice,
} from '@/services/interviewService';

// ==========================================
// 1. MOCK DATA: PERTANYAAN WAWANCARA RESMI
// ==========================================
interface InterviewQuestion {
  id: number;
  category: string;
  competency: string;
  questionText: string;
  simplifiedIntent: string;
  expectedPoints: string[];
  keywords: string[];
  jargonGlossary: { term: string; explanation: string }[];
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    category: 'Pengawasan Mutu',
    competency: 'Quality Control & Defect Analysis',
    questionText:
      'Selamat pagi rekan pelamar. Terima kasih telah hadir di sesi wawancara online CV. Asia Plastik. Bisakah Anda menceritakan pengalaman Anda dalam pengawasan mutu di lini produksi, serta bagaimana langkah sistematis Anda dalam mengidentifikasi dan menangani cacat produk seperti "flash" (kelebihan material) dan "shrinkage" (penyusutan) pada mesin cetak plastik?',
    simplifiedIntent:
      'Pewawancara ingin mengetahui pengalaman langsung Anda di lini produksi plastik: bagaimana cara Anda menyetel mesin atau mold ketika menemukan cacat Flash dan Shrinkage.',
    expectedPoints: [
      'Penyetelan clamping force (gaya pencekam) dan tekanan injeksi untuk mengatasi cacat flash',
      'Pengaturan cooling time (waktu pendinginan) dan holding pressure untuk mengatasi shrinkage',
      'Pemeriksaan dimensi produk secara berkala menggunakan caliper / micrometer',
      'Komunikasi cepat dengan operator mesin injection/ekstrusi saat ada ketidaksesuaian',
    ],
    keywords: ['Pengawasan Mutu', 'Mesin Cetak Injeksi', 'Defek Flash', 'Shrinkage', 'Clamping Force'],
    jargonGlossary: [
      {
        term: 'Flash / Burrs',
        explanation: 'Kelebihan lapisan plastik tipis di tepi produk akibat cetakan kurang rapat atau tekanan injeksi terlalu tinggi.',
      },
      {
        term: 'Shrinkage',
        explanation: 'Penyusutan atau cekungan pada permukaan produk akibat pendinginan tidak merata atau holding pressure kurang.',
      },
      {
        term: 'Clamping Force',
        explanation: 'Gaya penekanan mesin hidrolik untuk mengunci dua bagian mold agar lelehan biji plastik tidak bocor keluar.',
      },
    ],
  },
  {
    id: 2,
    category: 'Sistem Mutu ISO',
    competency: 'ISO 9001:2015 & Problem Solving',
    questionText:
      'Ketika terjadi ketidaksesuaian kritis di mana satu lot produksi botol plastik ditemukan mengalami kebocoran mikro sebelum dikirim ke pelanggan B2B, langkah investigasi akar penyebab (metode 5-Why) dan tindakan korektif (CAPA) apa yang akan segera Anda ambil?',
    simplifiedIntent:
      'Pewawancara ingin mengetahui reaksi cepat Anda saat barang cacat lolos: bagaimana cara mengarantina barang, mencari akar masalah lewat 5-Why, dan mencegah agar tidak terulang.',
    expectedPoints: [
      'Segera beri status Karantina (Hold) pada seluruh lot barang agar tidak terkirim ke customer',
      'Cek nomor batch biji plastik, setting suhu barel heater, dan catatan log book shift terkait',
      'Gunakan metode 5-Why untuk menemukan akar masalah (contoh: sensor pemanas tidak akurat)',
      'Terbitkan laporan ketidaksesuaian resmi (NCR) dan formulir tindakan pencegahan (CAPA)',
    ],
    keywords: ['Karantina Lot (Hold)', 'Analisis 5-Why', 'CAPA', 'ISO 9001'],
    jargonGlossary: [
      {
        term: 'NCR (Non-Conformance Report)',
        explanation: 'Surat resmi pencatatan produk yang tidak memenuhi standar spesifikasi mutu pabrik.',
      },
      {
        term: 'CAPA',
        explanation: 'Corrective and Preventive Action: Tindakan perbaikan akar masalah dan pencegahan kekambuhan.',
      },
    ],
  },
  {
    id: 3,
    category: 'Koordinasi Shift',
    competency: 'Ketegasan Mutu & Kolaborasi',
    questionText:
      'Sebagai Supervisor QC, Anda berkoordinasi erat dengan Supervisor Produksi yang sedang mengejar kuota output harian. Jika tim produksi mendesak agar suatu lot yang meragukan tetap diloloskan, bagaimana sikap dan pendekatan komunikasi profesional Anda?',
    simplifiedIntent:
      'Pewawancara menguji ketegasan Anda menjaga mutu: bagaimana menolak tekanan tim produksi secara tenang, tegas, dan berbasis data tanpa menimbulkan konflik personal.',
    expectedPoints: [
      'Berpegang teguh pada lembar spesifikasi mutu resmi (AQL) dan batas toleransi cetak',
      'Menyajikan data hasil uji objektif (bukan opini pribadi) seperti foto cacat dan dimensi produk',
      'Memberikan solusi win-win: melakukan pemilahan (sorting) parsial atau uji ulang sampel acak',
      'Jika deadlock, segera eskalasi ke Manajer Pabrik dengan bukti data yang lengkap',
    ],
    keywords: ['Standar Batas Toleransi', 'Komunikasi Berbasis Data', 'Integritas Mutu'],
    jargonGlossary: [
      {
        term: 'AQL (Acceptable Quality Limit)',
        explanation: 'Batas toleransi persentase cacat maksimum yang diizinkan dalam satu batch pengujian sampel.',
      },
    ],
  },
  {
    id: 4,
    category: 'Keselamatan K3',
    competency: 'Kepatuhan K3 & Prosedur LOTO',
    questionText:
      'Di area mesin injeksi plastik bersuhu tinggi dan sistem utilitas pabrik, potensi bahaya kerja cukup besar. Bagaimana Anda memastikan tim inspeksi QC Anda konsisten mematuhi penggunaan APD dan prosedur Lockout-Tagout (LOTO) saat memeriksa cetakan mold?',
    simplifiedIntent:
      'Pewawancara ingin melihat komitmen Anda terhadap keselamatan anak buah: briefing K3, pematuhan APD tahan panas, dan prosedur mengunci saklar daya mesin sebelum diperiksa.',
    expectedPoints: [
      'Melakukan Safety Briefing (Toolbox Meeting) 5 menit sebelum serah terima shift',
      'Penerapan tegas prosedur LOTO (memutus arus listrik dan hidrolik mesin sebelum masuk mold)',
      'Pemberian sanksi bertahap bagi yang melanggar APD dan apresiasi bagi yang patuh',
      'Pencatatan laporan Near-Miss (hampir celaka) untuk perbaikan berkelanjutan',
    ],
    keywords: ['Prosedur LOTO', 'Toolbox Meeting', 'Kepatuhan APD'],
    jargonGlossary: [
      {
        term: 'LOTO (Lockout / Tagout)',
        explanation: 'Prosedur keselamatan mengunci saklar listrik dan memberi tanda bahaya saat mesin sedang dicek.',
      },
    ],
  },
  {
    id: 5,
    category: 'Motivasi & Komitmen',
    competency: 'Culture Fit & Target 6 Bulan',
    questionText:
      'Mengapa Anda memilih berkarir di CV. Asia Plastik di Sidoarjo, dan apa target kontribusi nyata yang ingin Anda capai dalam 6 bulan pertama kerja jika diterima sebagai Supervisor QC?',
    simplifiedIntent:
      'Pewawancara ingin tahu motivasi realistis Anda bergabung di CV. Asia Plastik dan apa rencana nyata Anda untuk menurunkan cacat produk di pabrik dalam 6 bulan.',
    expectedPoints: [
      'Mengetahui kredibilitas CV. Asia Plastik sebagai industri plastik terpercaya di Jawa Timur',
      'Rencana menurunkan persentase barang reject (scrap rate) di lini ekstrusi dan injeksi',
      'Membuat digitalisasi checklist kontrol mutu harian agar data inspeksi mudah dilacak',
      'Kesiapan penuh bekerja dengan sistem shift dan menjaga kekompakan tim',
    ],
    keywords: ['CV. Asia Plastik Sidoarjo', 'Penurunan Scrap Rate', 'Standardisasi Checklist'],
    jargonGlossary: [
      {
        term: 'Scrap Rate',
        explanation: 'Persentase bahan plastik yang terbuang sia-sia akibat kesalahan cetak dalam satu siklus produksi.',
      },
    ],
  },
];

interface TranscriptItem {
  speaker: 'agent' | 'user';
  text: string;
  timestamp: string;
}

// ==========================================
// ROOT COMPONENT WITH SUSPENSE
// ==========================================
export default function AIInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-sans">
          <div className="flex items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
            <span className="text-sm font-semibold">Memuat Prototype Wawancara Online...</span>
          </div>
        </div>
      }
    >
      <InterviewPrototypeContainer />
    </Suspense>
  );
}

// ==========================================
// CONTAINER & STATE HOLDER
// ==========================================
function InterviewPrototypeContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawVariant = (searchParams.get('variant') || 'A').toUpperCase();
  const currentVariant = ['A', 'B', 'C'].includes(rawVariant) ? rawVariant : 'A';

  const { candidate, saveInterviewCompleted } = useRecruitment();

  // Core Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isCandidateRecording, setIsCandidateRecording] = useState<boolean>(false);
  const [candidateAnswerInput, setCandidateAnswerInput] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Modals
  const [showClarificationModal, setShowClarificationModal] = useState<boolean>(false);
  const [showDeviceSettingsModal, setShowDeviceSettingsModal] = useState<boolean>(false);
  const [showScorecardModal, setShowScorecardModal] = useState<boolean>(false);

  // Transcripts & Scorecard
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      speaker: 'agent',
      text: 'Selamat pagi! Selamat datang di sesi wawancara online CV. Asia Plastik Sidoarjo. Saya Dewi Lestari selaku Asesor. Mari kita mulai dengan pertanyaan pertama mengenai pengalaman QC Anda.',
      timestamp: '00:02',
    },
  ]);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);

  // Audio / Devices
  const [audioDevices, setAudioDevices] = useState<{ mics: AudioDevice[]; speakers: AudioDevice[] }>({
    mics: [],
    speakers: [],
  });
  const [selectedMic, setSelectedMic] = useState<string>('default_mic');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('default_speaker');

  // Media Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex] || INTERVIEW_QUESTIONS[0];
  const totalQuestions = INTERVIEW_QUESTIONS.length;

  // Setup Camera & Mic
  useEffect(() => {
    let localStream: MediaStream | null = null;
    async function initMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.warn('Webcam/Mic permission info:', err);
      }
    }
    initMedia();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung Web Speech Recognition. Anda dapat langsung mengetikkan respon.');
      return;
    }
    if (isCandidateRecording) {
      setIsCandidateRecording(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.onstart = () => setIsCandidateRecording(true);
      recognition.onresult = (e: any) => {
        const text = Array.from(e.results).map((r: any) => r[0].transcript).join('');
        setCandidateAnswerInput(text);
      };
      recognition.onerror = () => setIsCandidateRecording(false);
      recognition.onend = () => setIsCandidateRecording(false);
      recognition.start();
    } catch {
      setIsCandidateRecording(false);
    }
  };

  // Play Question TTS
  const handlePlayQuestionAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(activeQuestion.questionText);
    u.lang = 'id-ID';
    u.rate = 0.95;
    u.onstart = () => setIsAiSpeaking(true);
    u.onend = () => setIsAiSpeaking(false);
    u.onerror = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  // Send Candidate Answer
  const handleSubmitAnswer = async () => {
    if (!candidateAnswerInput.trim()) return;
    const textToSend = candidateAnswerInput.trim();
    setCandidateAnswerInput('');
    setIsSubmittingAnswer(true);

    const timeStr = `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`;
    setTranscripts((prev) => [...prev, { speaker: 'user', text: textToSend, timestamp: timeStr }]);

    try {
      const res = await InterviewService.sendAnswer(textToSend, currentQuestionIndex);
      if (res && res.agentResponse) {
        setTranscripts((prev) => [...prev, { speaker: 'agent', text: res.agentResponse, timestamp: timeStr }]);
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(res.agentResponse);
          u.lang = 'id-ID';
          u.onstart = () => setIsAiSpeaking(true);
          u.onend = () => setIsAiSpeaking(false);
          window.speechSynthesis.speak(u);
        }
      }
      if (res.isFinished) {
        handleFinishInterview();
      } else if (res.nextQuestionIndex !== undefined && res.nextQuestionIndex < totalQuestions) {
        setCurrentQuestionIndex(res.nextQuestionIndex);
      }
    } catch {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Finish Interview
  const handleFinishInterview = async () => {
    try {
      const res = await InterviewService.stopInterview();
      if (res && res.scorecard) setScorecard(res.scorecard);
    } catch (e) {
      console.warn(e);
    }
    setShowScorecardModal(true);
  };

  const handleProceedToPsychology = () => {
    saveInterviewCompleted(true);
    router.push('/dashboard/competency-test');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleMic = () => {
    const next = !isMicOn;
    setIsMicOn(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  const handleToggleCamera = () => {
    const next = !isCameraOn;
    setIsCameraOn(next);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
  };

  // Keyboard navigation for switcher (?variant=A|B|C)
  const variantsList = ['A', 'B', 'C'];
  const handleSwitchVariant = (nextVar: string) => {
    router.replace(`/prototype/interview?variant=${nextVar}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in textarea or input
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      const idx = variantsList.indexOf(currentVariant);
      if (e.key === 'ArrowRight') {
        const nextIdx = (idx + 1) % variantsList.length;
        handleSwitchVariant(variantsList[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (idx - 1 + variantsList.length) % variantsList.length;
        handleSwitchVariant(variantsList[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVariant]);

  const sharedProps = {
    candidate,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    activeQuestion,
    totalQuestions,
    isMicOn,
    handleToggleMic,
    isCameraOn,
    handleToggleCamera,
    isAiSpeaking,
    handlePlayQuestionAudio,
    isCandidateRecording,
    toggleSpeechRecognition,
    candidateAnswerInput,
    setCandidateAnswerInput,
    handleSubmitAnswer,
    isSubmittingAnswer,
    transcripts,
    transcriptEndRef,
    elapsedSeconds,
    formatTimer,
    videoRef,
    canvasRef,
    setShowClarificationModal,
    setShowDeviceSettingsModal,
    handleFinishInterview,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* RENDER ACTIVE PROTOTYPE VARIANT */}
      {currentVariant === 'A' && <VariantA_ExecutiveStudio {...sharedProps} />}
      {currentVariant === 'B' && <VariantB_TeleprompterStage {...sharedProps} />}
      {currentVariant === 'C' && <VariantC_ModernGridMeeting {...sharedProps} />}

      {/* FLOATING PROTOTYPE SWITCHER (Mandatory per /prototype skill) */}
      <PrototypeSwitcher
        currentVariant={currentVariant}
        variantsList={variantsList}
        onSwitch={handleSwitchVariant}
      />

      {/* MODALS */}
      {showClarificationModal && (
        <ClarificationModal
          question={activeQuestion}
          onClose={() => setShowClarificationModal(false)}
        />
      )}
      {showDeviceSettingsModal && (
        <DeviceSettingsModal
          audioDevices={audioDevices}
          selectedMic={selectedMic}
          setSelectedMic={setSelectedMic}
          selectedSpeaker={selectedSpeaker}
          setSelectedSpeaker={setSelectedSpeaker}
          onClose={() => setShowDeviceSettingsModal(false)}
        />
      )}
      {showScorecardModal && (
        <ScorecardModal
          scorecard={scorecard}
          candidate={candidate}
          onClose={() => setShowScorecardModal(false)}
          onProceed={handleProceedToPsychology}
        />
      )}
    </div>
  );
}

// ==========================================
// FLOATING PROTOTYPE SWITCHER (HIGH CONTRAST PILL)
// ==========================================
function PrototypeSwitcher({
  currentVariant,
  variantsList,
  onSwitch,
}: {
  currentVariant: string;
  variantsList: string[];
  onSwitch: (v: string) => void;
}) {
  const variantLabels: Record<string, string> = {
    A: 'Variant A: Executive Studio (2-Kolom)',
    B: 'Variant B: Teleprompter & Focus Stage',
    C: 'Variant C: Grid Meeting Room (Google Meet style)',
  };

  const currIndex = variantsList.indexOf(currentVariant);

  const prevVariant = () => {
    const idx = (currIndex - 1 + variantsList.length) % variantsList.length;
    onSwitch(variantsList[idx]);
  };

  const nextVariant = () => {
    const idx = (currIndex + 1) % variantsList.length;
    onSwitch(variantsList[idx]);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-2xl border border-slate-700">
        <button
          onClick={prevVariant}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Varian Sebelumnya (Tekan ← panah kiri)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-2 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-sky-300 font-bold">{variantLabels[currentVariant]}</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            ({currIndex + 1}/{variantsList.length}) &bull; [←/→]
          </span>
        </div>

        <button
          onClick={nextVariant}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Varian Berikutnya (Tekan → panah kanan)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// VARIAN A: EXECUTIVE STUDIO (Balanced 2-Column Mode Terang)
// =========================================================================
function VariantA_ExecutiveStudio(props: any) {
  const {
    candidate,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    activeQuestion,
    totalQuestions,
    isMicOn,
    handleToggleMic,
    isCameraOn,
    handleToggleCamera,
    isAiSpeaking,
    handlePlayQuestionAudio,
    isCandidateRecording,
    toggleSpeechRecognition,
    candidateAnswerInput,
    setCandidateAnswerInput,
    handleSubmitAnswer,
    isSubmittingAnswer,
    transcripts,
    transcriptEndRef,
    elapsedSeconds,
    formatTimer,
    videoRef,
    setShowClarificationModal,
    setShowDeviceSettingsModal,
    handleFinishInterview,
  } = props;

  return (
    <div className="w-full flex flex-col justify-between">
      {/* TOP HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Image src="/assets/images/logos/logo.webp" alt="CV. Asia Plastik" width={110} height={32} className="h-5 sm:h-6 w-auto" />
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Studio Wawancara AI (Mode Terang)</span>
            <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-mono">
              QC Supervisor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stepper Dots */}
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((num, i) => (
              <button
                key={num}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i === currentQuestionIndex
                    ? 'bg-sky-600 text-white font-black shadow-xs'
                    : i < currentQuestionIndex
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-500 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setShowDeviceSettingsModal(true)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2-COLUMN MAIN CONTENT */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-5">
        {/* LEFT COLUMN: STAGE ASESOR & WEBCAM */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs relative min-h-[440px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">
                Pilar Evaluasi: <strong className="text-slate-900">{activeQuestion.competency}</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Soal {activeQuestion.id} dari {totalQuestions}
            </span>
          </div>

          {/* Avatar Stage */}
          <div className="my-auto text-center space-y-3 py-6">
            <div className="relative w-32 h-32 mx-auto">
              {isAiSpeaking && (
                <>
                  <div className="absolute -inset-3 rounded-full border-2 border-sky-400/40 animate-ping opacity-60" />
                  <div className="absolute -inset-1.5 rounded-full border-2 border-emerald-500/50 animate-pulse" />
                </>
              )}
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-sky-100 via-slate-100 to-sky-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <Image src="/assets/images/Dewi-lestari.jpg" alt="Dewi Lestari" width={140} height={140} className="w-full h-full object-cover" />
                <User className="w-12 h-12 text-sky-400 absolute" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs bg-white border-slate-200 text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span>{isAiSpeaking ? 'Asesor Berbicara...' : 'Mendengarkan Anda'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">Dewi Lestari, S.Psi.</h4>
              <p className="text-xs text-sky-600 font-medium">Lead Talent Acquisition &bull; CV. Asia Plastik</p>
            </div>
          </div>

          {/* Floating Webcam PiP */}
          <div className="absolute top-4 right-4 w-36 sm:w-44 aspect-video rounded-2xl bg-slate-900 border border-slate-200 p-1 flex flex-col justify-between text-white shadow-md overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover rounded-xl ${isCameraOn ? 'block' : 'hidden'}`} />
            {!isCameraOn && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-xl text-slate-400">
                <VideoOff className="w-5 h-5 mb-1" />
                <span className="text-[9px]">Kamera Mati</span>
              </div>
            )}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] bg-slate-950/70 px-2 py-0.5 rounded-md text-white">
              <span className="truncate">{candidate.fullName || 'Anda (Kandidat)'}</span>
              <span className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePlayQuestionAudio}
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isAiSpeaking ? <VolumeX className="w-3.5 h-3.5 text-sky-600" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600" />}
              <span>{isAiSpeaking ? 'Hentikan Suara' : 'Dengarkan Soal (AI)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMic}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isMicOn ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-600" /> : <MicOff className="w-3.5 h-3.5 text-rose-600" />}
                <span>{isMicOn ? 'Mic Aktif' : 'Mic Bisu'}</span>
              </button>
              <button
                onClick={handleToggleCamera}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isCameraOn ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5 text-emerald-600" /> : <VideoOff className="w-3.5 h-3.5 text-rose-600" />}
                <span>{isCameraOn ? 'Cam Aktif' : 'Cam Mati'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERTANYAAN, TRANSKRIP, & INPUT */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  #{activeQuestion.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{activeQuestion.category}</h3>
              </div>
              <button
                onClick={() => setShowClarificationModal(true)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Maksud Soal & Kisi-kisi</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-2xs">
              &ldquo;{activeQuestion.questionText}&rdquo;
            </div>

            {/* Transcripts */}
            <div className="h-44 overflow-y-auto space-y-2.5 border border-slate-200 rounded-2xl p-3 bg-slate-50/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Transkrip Live Wawancara:
              </span>
              {transcripts.map((t: TranscriptItem, idx: number) => (
                <div key={idx} className={`flex items-start gap-2 text-xs ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {t.speaker === 'agent' && (
                    <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                      AI
                    </div>
                  )}
                  <div className={`max-w-[85%] p-2 rounded-xl text-xs leading-relaxed ${t.speaker === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'}`}>
                    <p>{t.text}</p>
                    <span className={`text-[9px] mt-0.5 block ${t.speaker === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'}`}>
                      {t.timestamp}
                    </span>
                  </div>
                  {t.speaker === 'user' && (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center text-[9px] font-bold shrink-0">
                      Anda
                    </div>
                  )}
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Candidate Input */}
            <div className="space-y-2">
              <textarea
                value={candidateAnswerInput}
                onChange={(e) => setCandidateAnswerInput(e.target.value)}
                placeholder="Ketik jawaban Anda atau klik tombol 'Bicara Lewat Mic' di bawah..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeechRecognition}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                    isCandidateRecording ? 'bg-rose-600 text-white border-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isCandidateRecording ? 'Hentikan Rekam' : 'Bicara Lewat Mic'}</span>
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswerInput.trim() || isSubmittingAnswer}
                  className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20 disabled:opacity-40 cursor-pointer"
                >
                  <span>Kirim Respon</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="py-1.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 disabled:opacity-40"
            >
              &larr; Soal Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev: number) => prev + 1)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
                >
                  Berikutnya &rarr;
                </button>
              ) : null}
              <button
                onClick={handleFinishInterview}
                className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center gap-1"
              >
                <span>Evaluasi Selesai</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// VARIAN B: TELEPROMPTER & FOCUS STAGE (Tampilan Terpusat Mode Terang)
// =========================================================================
function VariantB_TeleprompterStage(props: any) {
  const {
    activeQuestion,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    totalQuestions,
    isMicOn,
    handleToggleMic,
    isCameraOn,
    handleToggleCamera,
    isAiSpeaking,
    handlePlayQuestionAudio,
    isCandidateRecording,
    toggleSpeechRecognition,
    candidateAnswerInput,
    setCandidateAnswerInput,
    handleSubmitAnswer,
    isSubmittingAnswer,
    transcripts,
    elapsedSeconds,
    formatTimer,
    videoRef,
    setShowClarificationModal,
    handleFinishInterview,
  } = props;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      {/* HEADER RINGKAS */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Varian B: Focus Stage & Teleprompter</h2>
            <p className="text-[11px] text-slate-500">Konsentrasi penuh kandidat saat menyampaikan argumen teknis</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
          <Clock className="w-4 h-4 text-sky-600" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* DUAL CAMERA POD: ASESOR & KANDIDAT BERDAMPINGAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Asesor Pod */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-sky-200 shrink-0 shadow-xs">
            <Image src="/assets/images/Dewi-lestari.jpg" alt="Dewi" width={80} height={80} className="w-full h-full object-cover" />
            {isAiSpeaking && <div className="absolute inset-0 bg-sky-500/20 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[11px] font-bold text-slate-700">Dewi Lestari (Asesor)</span>
            </div>
            <p className="text-[11px] text-slate-500">CV. Asia Plastik Sidoarjo</p>
            <button
              onClick={handlePlayQuestionAudio}
              className="mt-2 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>{isAiSpeaking ? 'Hentikan Suara' : 'Baca Ulang Soal'}</span>
            </button>
          </div>
        </div>

        {/* Candidate Webcam Pod */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-28 aspect-video rounded-xl bg-slate-900 border border-slate-200 overflow-hidden shadow-xs">
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`} />
              {!isCameraOn && (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-[9px]">
                  Cam Off
                </div>
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">Kamera Anda (Pelamar)</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Feed
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button onClick={handleToggleMic} className={`p-2 rounded-xl border text-xs cursor-pointer ${isMicOn ? 'bg-slate-100 text-slate-700' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-rose-600" />}
            </button>
            <button onClick={handleToggleCamera} className={`p-2 rounded-xl border text-xs cursor-pointer ${isCameraOn ? 'bg-slate-100 text-slate-700' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              {isCameraOn ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4 text-rose-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* TELEPROMPTER CARD (FOKUS UTAMA) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">
              Pertanyaan #{activeQuestion.id} dari {totalQuestions}
            </span>
            <span className="text-xs font-semibold text-slate-600">{activeQuestion.category}</span>
          </div>
          <button
            onClick={() => setShowClarificationModal(true)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Kisi-kisi</span>
          </button>
        </div>

        {/* Teleprompter Big Question */}
        <div className="bg-sky-50/50 rounded-2xl p-6 border border-sky-100 text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-700 block">Pertanyaan Asesor:</span>
          <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed font-sans max-w-2xl mx-auto">
            &ldquo;{activeQuestion.questionText}&rdquo;
          </p>
        </div>

        {/* Hint Expected Points Langsung Terlihat */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-700 block">Fokus Poin Jawaban yang Diinginkan:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
            {activeQuestion.expectedPoints.slice(0, 2).map((pt: string, i: number) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Large Central Push-To-Speak / Input Box */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={toggleSpeechRecognition}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                isCandidateRecording
                  ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isCandidateRecording ? 'Merekam... Klik untuk Berhenti' : 'Bicara Sekarang (Mikrofon)'}</span>
            </button>
            <input
              type="text"
              value={candidateAnswerInput}
              onChange={(e) => setCandidateAnswerInput(e.target.value)}
              placeholder="Atau ketik ringkasan jawaban Anda di sini..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!candidateAnswerInput.trim() || isSubmittingAnswer}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="text-xs font-semibold text-slate-600 disabled:opacity-40"
        >
          &larr; Soal Sebelumnya
        </button>
        <div className="flex items-center gap-2">
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev: number) => prev + 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
            >
              Lewati Soal &rarr;
            </button>
          ) : null}
          <button
            onClick={handleFinishInterview}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
          >
            Selesai Wawancara
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// VARIAN C: MODERN GRID VIDEO CALL (Gaya Google Meet / MS Teams Mode Terang)
// =========================================================================
function VariantC_ModernGridMeeting(props: any) {
  const {
    activeQuestion,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    totalQuestions,
    isMicOn,
    handleToggleMic,
    isCameraOn,
    handleToggleCamera,
    isAiSpeaking,
    handlePlayQuestionAudio,
    isCandidateRecording,
    toggleSpeechRecognition,
    candidateAnswerInput,
    setCandidateAnswerInput,
    handleSubmitAnswer,
    isSubmittingAnswer,
    transcripts,
    transcriptEndRef,
    elapsedSeconds,
    formatTimer,
    videoRef,
    setShowClarificationModal,
    handleFinishInterview,
  } = props;

  const [showDrawer, setShowDrawer] = useState<boolean>(true);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-xs text-slate-900">Ruang Rapat Wawancara Online &bull; CV. Asia Plastik</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Sesi Terenkripsi
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
            {formatTimer(elapsedSeconds)}
          </span>
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 border border-sky-200"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showDrawer ? 'Tutup Transkrip' : 'Buka Transkrip'}</span>
          </button>
        </div>
      </div>

      {/* BANNER SOAL BERJALAN DI ATAS */}
      <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-2.5 flex-1">
          <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            #{activeQuestion.id}
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
              {activeQuestion.category} &bull; {activeQuestion.competency}
            </span>
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              &ldquo;{activeQuestion.questionText}&rdquo;
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePlayQuestionAudio}
            className="p-2 rounded-xl bg-white hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs shadow-2xs"
            title="Dengarkan Suara Soal"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowClarificationModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs shadow-2xs"
            title="Lihat Panduan & Maksud Soal"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GRID 2 LAYAR VIDEO BERDAMPINGAN + DRAWER KANAN */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* VIDEO GRID */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tile 1: AI Asesor */}
          <div className="aspect-video bg-gradient-to-tr from-sky-50 to-white rounded-3xl border-2 border-slate-200 p-4 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs z-10">
              <span className="font-bold text-slate-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-2xs">
                Dewi Lestari, S.Psi. (Asesor)
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${isAiSpeaking ? 'bg-sky-500 animate-ping' : 'bg-emerald-500'}`} />
            </div>

            <div className="my-auto mx-auto relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image src="/assets/images/Dewi-lestari.jpg" alt="Dewi" width={100} height={100} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 z-10 bg-white/90 px-3 py-1 rounded-xl">
              <span>Status: {isAiSpeaking ? 'Sedang Berbicara' : 'Mendengarkan'}</span>
              <span className="font-mono text-sky-700">CV. Asia Plastik</span>
            </div>
          </div>

          {/* Tile 2: Pelamar Live Feed */}
          <div className="aspect-video bg-slate-900 rounded-3xl border-2 border-slate-200 p-3 flex flex-col justify-between text-white shadow-xs relative overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`} />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                Kamera Dinonaktifkan
              </div>
            )}
            <div className="flex items-center justify-between text-xs z-10">
              <span className="font-bold bg-slate-950/70 px-2.5 py-1 rounded-xl">
                Anda (Kandidat QC)
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${isMicOn ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300 z-10 bg-slate-950/60 px-2.5 py-0.5 rounded-md self-start">
              <span>{isMicOn ? 'Mic On' : 'Mic Muted'}</span>
            </div>
          </div>
        </div>

        {/* DRAWER TRANSKRIP & RESPON DI KANAN */}
        {showDrawer && (
          <div className="w-full lg:w-80 bg-white rounded-3xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs h-[360px] lg:h-auto">
            <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
              <span className="text-[11px] font-bold text-slate-700 block border-b border-slate-100 pb-2">
                Live Chat & Transkrip
              </span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {transcripts.map((t: TranscriptItem, idx: number) => (
                  <div key={idx} className={`text-xs p-2 rounded-xl ${t.speaker === 'user' ? 'bg-sky-50 text-sky-900 ml-4 border border-sky-100' : 'bg-slate-50 text-slate-800 mr-4 border border-slate-200'}`}>
                    <strong className="block text-[9px] uppercase font-bold text-slate-400">{t.speaker === 'user' ? 'Anda' : 'Asesor AI'}</strong>
                    <p className="mt-0.5">{t.text}</p>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={candidateAnswerInput}
                  onChange={(e) => setCandidateAnswerInput(e.target.value)}
                  placeholder="Ketik respon..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswerInput.trim() || isSubmittingAnswer}
                  className="p-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM MEETING CONTROLS DOCK */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl border cursor-pointer ${isMicOn ? 'bg-slate-100 text-slate-800' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
            title="Mic"
          >
            {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-rose-600" />}
          </button>
          <button
            onClick={handleToggleCamera}
            className={`p-3 rounded-2xl border cursor-pointer ${isCameraOn ? 'bg-slate-100 text-slate-800' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
            title="Kamera"
          >
            {isCameraOn ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4 text-rose-600" />}
          </button>
          <button
            onClick={toggleSpeechRecognition}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${isCandidateRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isCandidateRecording ? 'Merekam Suara...' : 'Bicara Mic'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentQuestionIndex((prev: number) => (prev + 1) % totalQuestions)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
          >
            Soal #{activeQuestion.id + 1 > totalQuestions ? 1 : activeQuestion.id + 1} &rarr;
          </button>
          <button
            onClick={handleFinishInterview}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Akhiri & Evaluasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: CLARIFICATION (Panduan Soal)
// ==========================================
function ClarificationModal({ question, onClose }: { question: InterviewQuestion; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Panduan Maksud Soal & Kisi-kisi</h3>
              <p className="text-xs text-slate-500">Standar Kompetensi CV. Asia Plastik</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold">✕</button>
        </div>

        <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-800 block mb-1">Maksud Inti:</span>
            <p className="text-slate-700">{question.simplifiedIntent}</p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-sky-700 block">Poin yang Diharapkan:</span>
            {question.expectedPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs">
            Kembali ke Wawancara
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: DEVICE SETTINGS
// ==========================================
function DeviceSettingsModal({
  audioDevices,
  selectedMic,
  setSelectedMic,
  selectedSpeaker,
  setSelectedSpeaker,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-900">Pengaturan Audio & Perangkat</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">✕</button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Input Mikrofon:</label>
            <select
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
            >
              <option value="default_mic">Microphone Standar Sistem</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Output Speaker:</label>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
            >
              <option value="default_speaker">Speaker Standar Sistem</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs">
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: SCORECARD EVALUASI 4-PILAR
// ==========================================
function ScorecardModal({ scorecard, candidate, onClose, onProceed }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Hasil Evaluasi 4-Pilar Wawancara Online AI
          </h3>
          <p className="text-xs text-slate-500">CV. Asia Plastik Sidoarjo</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-sky-700 block">Keputusan Asesor AI</span>
            <h4 className="text-sm font-extrabold text-slate-900">
              {scorecard?.verdict || 'Rekomendasi Lulus ke Tahap Asesmen Psikotes'}
            </h4>
            <p className="text-xs text-slate-600">
              Kandidat: <strong>{candidate.fullName || 'Budi Santoso'}</strong>
            </p>
          </div>
          <div className="text-right bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-2xl font-black text-emerald-600">{scorecard?.overall_score || 88}</span>
            <span className="text-xs text-slate-400"> / 100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>1. Pengalaman & CV</span>
              <span className="text-sky-600 font-bold">86%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>2. Artikulasi</span>
              <span className="text-emerald-600 font-bold">90%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>3. Teknis Injeksi QC</span>
              <span className="text-purple-600 font-bold">88%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>4. 5-Why & K3 LOTO</span>
              <span className="text-amber-600 font-bold">87%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Tutup
          </button>
          <button onClick={onProceed} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs">
            Lanjut ke Tahap 5: Psikotes &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

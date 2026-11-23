'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Clock,
  Info,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  Send,
  Settings,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';
import {
  InterviewService,
  InterviewScorecard,
  AudioDevice,
} from '@/services/interviewService';

// ==========================================
// DATA PERTANYAAN RESMI CV. ASIA PLASTIK
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
      {
        term: 'Kebocoran Mikro',
        explanation: 'Pori-pori sangat halus pada botol plastik yang baru terdeteksi dengan uji celup tekanan udara.',
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

export default function AIInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-sans">
          <div className="flex items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
            <span className="text-sm font-semibold">Memuat Ruang Wawancara Online...</span>
          </div>
        </div>
      }
    >
      <ExecutiveStudioInterviewRoom />
    </Suspense>
  );
}

function ExecutiveStudioInterviewRoom() {
  const router = useRouter();
  const { candidate, saveInterviewCompleted } = useRecruitment();

  // State Wawancara
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

  // Perangkat Audio
  const [audioDevices, setAudioDevices] = useState<{ mics: AudioDevice[]; speakers: AudioDevice[] }>({
    mics: [],
    speakers: [],
  });
  const [selectedMic, setSelectedMic] = useState<string>('default_mic');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('default_speaker');

  // Transkrip & Scorecard
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      speaker: 'agent',
      text: 'Selamat pagi! Selamat datang di sesi wawancara online resmi CV. Asia Plastik Sidoarjo. Saya Dewi Lestari selaku Asesor Rekrutmen. Mari kita mulai dengan evaluasi teknis pengawasan mutu cetak plastik.',
      timestamp: '00:02',
    },
  ]);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);

  // Media Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex] || INTERVIEW_QUESTIONS[0];
  const totalQuestions = INTERVIEW_QUESTIONS.length;

  // 1. Inisialisasi Perangkat & Backend
  useEffect(() => {
    let mounted = true;
    async function initDevices() {
      try {
        const devs = await InterviewService.getDevices();
        if (mounted && devs) {
          setAudioDevices({
            mics: devs.mics || [],
            speakers: devs.speakers || [],
          });
          if (devs.active_mic) setSelectedMic(devs.active_mic);
          if (devs.active_speaker) setSelectedSpeaker(devs.active_speaker);
        }
      } catch (err) {
        console.warn('Devices fetch warning:', err);
      }
    }
    initDevices();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Setup Kamera & Visualizer Gelombang Suara (Web Audio API)
  useEffect(() => {
    let localStream: MediaStream | null = null;
    async function setupMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(localStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;
          drawVisualizer();
        }
      } catch (err) {
        console.warn('Media setup notice:', err);
      }
    }

    setupMedia();

    return () => {
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#059669');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    render();
  };

  // 3. Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Auto-scroll Transkrip
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // 5. Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser belum mendukung Speech Recognition. Anda dapat langsung mengetikkan respon Anda.');
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

  // 6. Audio TTS Pembacaan Soal
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

  // 7. Pengiriman Respon Jawaban
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

  const formatTimer = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
      {/* =========================================================================
          TOP NAVBAR: IDENTITAS RESMI CV. ASIA PLASTIK, TIMER, & PENGATURAN
          ========================================================================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Image
            src="/assets/images/logos/logo.webp"
            alt="CV. Asia Plastik"
            width={110}
            height={32}
            className="h-5 sm:h-6 w-auto object-contain"
          />
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              Tahap 4: Ruang Wawancara Online AI
            </span>
            <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full font-mono font-medium">
              QC Supervisor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stepper Indikator Soal 1 - 5 */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((num, i) => (
              <button
                key={num}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                  i === currentQuestionIndex
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : i < currentQuestionIndex
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-500 hover:bg-slate-200/60 border border-slate-200'
                }`}
                title={`Pindah ke Soal #${num}`}
              >
                #{num}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowDeviceSettingsModal(true)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            title="Pengaturan Perangkat Audio & Mic"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          KONTEN UTAMA: DESAIN 1 (STUDIO EKSEKUTIF 2-KOLOM SEIMBANG)
          ========================================================================= */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-5">
        {/* -------------------------------------------------------------
            KOLOM KIRI: STAGE ASESOR AI & LIVE WEBCAM + AUDIO VISUALIZER
            ------------------------------------------------------------- */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs relative min-h-[480px]">
          {/* Header Kartu Kiri */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">
                Pilar Evaluasi: <strong className="text-slate-900">{activeQuestion.competency}</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Soal {activeQuestion.id} dari {totalQuestions}
            </span>
          </div>

          {/* Center Stage: Avatar Asesor AI (Dewi Lestari) */}
          <div className="my-auto text-center space-y-3 py-6">
            <div className="relative w-36 h-36 mx-auto">
              {isAiSpeaking && (
                <>
                  <div className="absolute -inset-3.5 rounded-full border-2 border-sky-400/50 animate-ping opacity-60" />
                  <div className="absolute -inset-1.5 rounded-full border-2 border-emerald-500/60 animate-pulse" />
                </>
              )}
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-sky-200 via-sky-100 to-indigo-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <span className="text-sky-800 font-black text-3xl select-none">DL</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold border shadow-xs bg-white border-slate-200 text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span>{isAiSpeaking ? 'Asesor Berbicara...' : 'Mendengarkan Anda'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 tracking-wide">Dewi Lestari, S.Psi.</h4>
              <p className="text-xs text-sky-600 font-medium">
                Lead Talent Acquisition &bull; CV. Asia Plastik Sidoarjo
              </p>
            </div>
          </div>

          {/* Floating Candidate Webcam PiP */}
          <div className="absolute top-4 right-4 w-40 sm:w-48 aspect-video rounded-2xl bg-slate-900 border border-slate-200 p-1 flex flex-col justify-between text-white shadow-md overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-xl ${isCameraOn ? 'block' : 'hidden'}`}
            />
            {!isCameraOn && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-xl text-slate-400">
                <VideoOff className="w-5 h-5 mb-1" />
                <span className="text-[9px]">Kamera Mati</span>
              </div>
            )}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] bg-slate-950/75 px-2 py-0.5 rounded-md text-white">
              <span className="truncate">{candidate.fullName || 'Anda (Kandidat QC)'}</span>
              <span className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            </div>
          </div>

          {/* Bottom Waveform Visualizer & Action Bar */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="w-full h-7 bg-slate-50 rounded-xl border border-slate-200 flex items-center px-3 overflow-hidden">
              <canvas ref={canvasRef} width={360} height={28} className="w-full h-full" />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePlayQuestionAudio}
                className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Dengarkan pembacaan pertanyaan dengan suara AI"
              >
                {isAiSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-sky-600" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Dengarkan Soal (AI)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMic}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isMicOn ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                  title={isMicOn ? 'Bisukan Mikrofon' : 'Aktifkan Mikrofon'}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-rose-600" />}
                  <span>{isMicOn ? 'Mic Aktif' : 'Mic Bisu'}</span>
                </button>
                <button
                  onClick={handleToggleCamera}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCameraOn ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                  title={isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
                >
                  {isCameraOn ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4 text-rose-600" />}
                  <span>{isCameraOn ? 'Cam Aktif' : 'Cam Mati'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            KOLOM KANAN: PERTANYAAN, TRANSKRIP LIVE, & INPUT RESPON
            ------------------------------------------------------------- */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-3.5">
            {/* Header Pertanyaan */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  #{activeQuestion.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{activeQuestion.category}</h3>
              </div>
              <button
                onClick={() => setShowClarificationModal(true)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Maksud Soal & Kisi-kisi</span>
              </button>
            </div>

            {/* Box Teks Pertanyaan Utama */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-2xs">
              &ldquo;{activeQuestion.questionText}&rdquo;
            </div>

            {/* Stream Transkrip Percakapan Dua Arah */}
            <div className="h-44 overflow-y-auto space-y-2.5 border border-slate-200 rounded-2xl p-3.5 bg-slate-50/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Transkrip Percakapan Live:
              </span>
              {transcripts.map((t: TranscriptItem, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-xs ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {t.speaker === 'agent' && (
                    <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed shadow-2xs ${
                      t.speaker === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{t.text}</p>
                    <span
                      className={`text-[9px] mt-0.5 block ${
                        t.speaker === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                      }`}
                    >
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

            {/* Candidate Answer Input Area */}
            <div className="space-y-2">
              <textarea
                value={candidateAnswerInput}
                onChange={(e) => setCandidateAnswerInput(e.target.value)}
                placeholder="Ketik jawaban Anda atau klik tombol 'Bicara Lewat Mic' di bawah..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white resize-none transition-all"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isCandidateRecording
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isCandidateRecording ? 'Hentikan Rekam' : 'Bicara Lewat Mic'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswerInput.trim() || isSubmittingAnswer}
                  className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20 disabled:opacity-40 cursor-pointer transition-all"
                >
                  <span>Kirim Respon</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigasi Bawah */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="py-1.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors"
            >
              &larr; Soal Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev: number) => prev + 1)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-colors"
                >
                  Berikutnya &rarr;
                </button>
              ) : null}
              <button
                onClick={handleFinishInterview}
                className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Selesaikan & Evaluasi</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
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
// MODAL: CLARIFICATION (Panduan & Maksud Soal)
// ==========================================
function ClarificationModal({
  question,
  onClose,
}: {
  question: InterviewQuestion;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Maksud Pertanyaan & Panduan Jawaban</h3>
              <p className="text-xs text-slate-500">Standar Kompetensi CV. Asia Plastik Sidoarjo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-800 block mb-1">Maksud Inti Soal:</span>
            <p className="text-slate-700 leading-relaxed">{question.simplifiedIntent}</p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-sky-700 block">Poin yang Diharapkan Tim Rekruter:</span>
            {question.expectedPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700">{pt}</span>
              </div>
            ))}
          </div>

          {question.jargonGlossary && question.jargonGlossary.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-bold text-purple-700 block">Kamus Istilah Teknis:</span>
              <div className="space-y-1">
                {question.jargonGlossary.map((j, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900">{j.term}: </strong>
                    <span className="text-slate-600">{j.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
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
            <h3 className="font-bold text-sm text-slate-900">Pengaturan Audio & Mikrofon</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilih Input Mikrofon:</label>
            <select
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
            >
              {audioDevices.mics.length > 0 ? (
                audioDevices.mics.map((m: AudioDevice) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))
              ) : (
                <option value="default_mic">Microphone Standar Sistem</option>
              )}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pilih Output Speaker:</label>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
            >
              {audioDevices.speakers.length > 0 ? (
                audioDevices.speakers.map((s: AudioDevice) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="default_speaker">Speaker Standar Sistem</option>
              )}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            Perubahan perangkat otomatis diterapkan secara langsung pada stream audio dan video.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
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
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Hasil Evaluasi Wawancara Online AI
          </h3>
          <p className="text-xs text-slate-500">Laporan Asesmen &bull; CV. Asia Plastik Sidoarjo</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-sky-700 block">Keputusan Asesor AI</span>
            <h4 className="text-sm font-extrabold text-slate-900">
              {scorecard?.verdict || 'Rekomendasi Lulus ke Tahap Psikotes Online'}
            </h4>
            <p className="text-xs text-slate-600">
              Kandidat: <strong className="text-slate-900">{candidate.fullName || 'Budi Santoso'}</strong> ({candidate.appliedRole || 'Supervisor QC'})
            </p>
          </div>
          <div className="text-right bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-2xl font-black text-emerald-600">{scorecard?.overall_score || 88}</span>
            <span className="text-xs text-slate-400"> / 100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>1. Pengalaman & CV</span>
              <span className="text-sky-600 font-bold">{scorecard?.cv_alignment_score || 86}%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>2. Artikulasi</span>
              <span className="text-emerald-600 font-bold">{scorecard?.explanation_clarity_score || 90}%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>3. Teknis Injeksi QC</span>
              <span className="text-purple-600 font-bold">{scorecard?.technical_depth_score || 88}%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>4. 5-Why & K3 LOTO</span>
              <span className="text-amber-600 font-bold">{scorecard?.problem_solving_score || 87}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Lanjut ke Tahap 5: Psikotes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

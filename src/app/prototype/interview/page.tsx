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
  Lock,
  Unlock,
  Send,
  Sparkles,
  Settings,
  Award,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';
import {
  InterviewService,
  InterviewScorecard,
  AudioDevice,
} from '@/services/interviewService';

// ==========================================
// MOCK DATA: PERTANYAAN WAWANCARA RESMI
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
  audioDurationSeconds: number;
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    category: 'Pengalaman & Pengawasan Mutu',
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
    keywords: ['Pengawasan Mutu', 'Mesin Cetak Injeksi', 'Defek Flash / Burrs', 'Shrinkage', 'Clamping Force'],
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
    audioDurationSeconds: 22,
  },
  {
    id: 2,
    category: 'Sistem Manajemen Mutu',
    competency: 'ISO 9001:2015 & Problem Solving',
    questionText:
      'Ketika terjadi ketidaksesuaian kritis (critical non-conformance) di mana satu lot produksi botol plastik ditemukan mengalami kebocoran mikro sebelum dikirim ke pelanggan B2B, langkah investigasi akar penyebab (metode 5-Why) dan tindakan korektif (CAPA) apa yang akan segera Anda ambil?',
    simplifiedIntent:
      'Pewawancara ingin mengetahui reaksi cepat Anda saat barang cacat lolos: bagaimana cara mengarantina barang, mencari akar masalah lewat 5-Why, dan mencegah agar tidak terulang.',
    expectedPoints: [
      'Segera beri status Karantina (Hold) pada seluruh lot barang agar tidak terkirim ke customer',
      'Cek nomor batch biji plastik, setting suhu barel heater, dan catatan log book shift terkait',
      'Gunakan metode 5-Why untuk menemukan akar masalah (contoh: sensor pemanas tidak akurat)',
      'Terbitkan laporan ketidaksesuaian resmi (NCR) dan formulir tindakan pencegahan (CAPA)',
    ],
    keywords: ['Karantina Lot (Hold)', 'Analisis 5-Why', 'CAPA (Tindakan Korektif)', 'ISO 9001'],
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
    audioDurationSeconds: 25,
  },
  {
    id: 3,
    category: 'Kepemimpinan & Koordinasi Shift',
    competency: 'Penyelesaian Konflik & Ketegasan Mutu',
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
    keywords: ['Standar Batas Toleransi', 'Komunikasi Berbasis Data', 'Integritas Mutu', 'Solusi Win-Win'],
    jargonGlossary: [
      {
        term: 'AQL (Acceptable Quality Limit)',
        explanation: 'Batas toleransi persentase cacat maksimum yang diizinkan dalam satu batch pengujian sampel.',
      },
    ],
    audioDurationSeconds: 24,
  },
  {
    id: 4,
    category: 'Keselamatan & K3 Manufaktur',
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
    keywords: ['Prosedur LOTO', 'Toolbox Meeting', 'Kepatuhan APD', 'Near-Miss K3'],
    jargonGlossary: [
      {
        term: 'LOTO (Lockout / Tagout)',
        explanation: 'Prosedur keselamatan mengunci saklar listrik dan memberi tanda bahaya saat mesin sedang dicek.',
      },
    ],
    audioDurationSeconds: 21,
  },
  {
    id: 5,
    category: 'Motivasi & Komitmen Kerja',
    competency: 'Culture Fit & Rencana Kontribusi',
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
    keywords: ['CV. Asia Plastik Sidoarjo', 'Penurunan Scrap Rate', 'Standardisasi Checklist', 'Siap Shift'],
    jargonGlossary: [
      {
        term: 'Scrap Rate',
        explanation: 'Persentase bahan plastik yang terbuang sia-sia akibat kesalahan cetak dalam satu siklus produksi.',
      },
    ],
    audioDurationSeconds: 20,
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
      <FixedAIInterviewRoom />
    </Suspense>
  );
}

function FixedAIInterviewRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreviewParam = searchParams.get('mode') === 'preview';

  const {
    candidate,
    isInterviewUnlocked,
    saveInterviewCompleted,
  } = useRecruitment();

  // Local state for testing unlock bypass
  const [devUnlocked, setDevUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUnlock = localStorage.getItem('asiaplastik_interview_dev_unlocked');
      if (storedUnlock === 'true') {
        setDevUnlocked(true);
      }
    }
  }, []);

  const isUnlocked = isPreviewParam || isInterviewUnlocked || devUnlocked;

  // Sesi & Kontrol Audio/Video
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isCandidateRecording, setIsCandidateRecording] = useState<boolean>(false);
  const [candidateAnswerInput, setCandidateAnswerInput] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showClarificationModal, setShowClarificationModal] = useState<boolean>(false);
  const [showDeviceSettingsModal, setShowDeviceSettingsModal] = useState<boolean>(false);
  const [showScorecardModal, setShowScorecardModal] = useState<boolean>(false);

  // Backend Connection & Devices
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    mode: 'rust_axum_engine' | 'nextjs_integrated_engine';
    label: string;
  }>({
    connected: false,
    mode: 'nextjs_integrated_engine',
    label: 'Menghubungkan Engine...',
  });

  const [audioDevices, setAudioDevices] = useState<{ mics: AudioDevice[]; speakers: AudioDevice[] }>({
    mics: [],
    speakers: [],
  });
  const [selectedMic, setSelectedMic] = useState<string>('default_mic');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('default_speaker');

  // Real-time Transcripts
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);

  // Refs for Media & Audio Visualizer
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex] || INTERVIEW_QUESTIONS[0];
  const totalQuestions = INTERVIEW_QUESTIONS.length;

  // 1. Initial Load & Backend Health Check
  useEffect(() => {
    let mounted = true;

    async function checkBackend() {
      try {
        const health = await InterviewService.checkHealth();
        if (mounted) {
          if (health.rust_backend_connected) {
            setBackendStatus({
              connected: true,
              mode: 'rust_axum_engine',
              label: 'Rust Backend :8787 (Live Duplex)',
            });
          } else {
            setBackendStatus({
              connected: true,
              mode: 'nextjs_integrated_engine',
              label: 'Engine Lokal AI (Terintegrasi)',
            });
          }
        }

        const devs = await InterviewService.getDevices();
        if (mounted && devs) {
          setAudioDevices({
            mics: devs.mics || [],
            speakers: devs.speakers || [],
          });
          if (devs.active_mic) setSelectedMic(devs.active_mic);
          if (devs.active_speaker) setSelectedSpeaker(devs.active_speaker);
        }
      } catch (e) {
        if (mounted) {
          setBackendStatus({
            connected: true,
            mode: 'nextjs_integrated_engine',
            label: 'Engine Lokal AI (Offline Mode)',
          });
        }
      }
    }

    checkBackend();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Start Interview Session on Load when Unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    let mounted = true;
    async function initSession() {
      try {
        const candidateName = candidate.fullName || 'Budi Santoso';
        const role = candidate.appliedRole || 'Supervisor Quality Control (QC)';

        await InterviewService.startInterview({
          candidate_name: candidateName,
          candidate_email: candidate.email,
          job_role: role,
        });

        if (mounted) {
          setTranscripts([
            {
              speaker: 'agent',
              text: `Selamat pagi ${candidateName}. Selamat datang di ruang wawancara kerja CV. Asia Plastik Sidoarjo untuk posisi ${role}. Saya Dewi Lestari selaku Asesor Rekrutmen. Mari kita mulai dengan pertanyaan pertama mengenai pengalaman Anda di bidang pengawasan mutu cetak plastik.`,
              timestamp: '00:03',
            },
          ]);
        }
      } catch (e) {
        console.warn('Init session fallback:', e);
      }
    }

    initSession();
    return () => {
      mounted = false;
    };
  }, [isUnlocked, candidate.fullName, candidate.appliedRole, candidate.email]);

  // 3. Setup Webcam & Audio Visualizer (Web Audio API)
  useEffect(() => {
    if (!isUnlocked) return;

    let localStream: MediaStream | null = null;

    async function setupMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

        // Web Audio Analyser setup
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
        console.warn('Webcam/Mic permission or device notice:', err);
      }
    }

    setupMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isUnlocked]);

  // Canvas visualizer loop
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
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient wave colors: Sky to Emerald
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#0284c7'); // sky-600
        grad.addColorStop(1, '#059669'); // emerald-600

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    render();
  };

  // Timer simulation
  useEffect(() => {
    if (!isUnlocked) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked]);

  // Auto-scroll transcripts
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  // Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung Web Speech Recognition. Anda dapat mengetik jawaban di kotak respon.');
      return;
    }

    if (isCandidateRecording) {
      setIsCandidateRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsCandidateRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcriptText = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setCandidateAnswerInput(transcriptText);
      };

      recognition.onerror = () => {
        setIsCandidateRecording(false);
      };

      recognition.onend = () => {
        setIsCandidateRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsCandidateRecording(false);
    }
  };

  // Play Question Voice (Web Speech API Synthesis)
  const handlePlayQuestionAudio = () => {
    if (typeof window === 'undefined') return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(activeQuestion.questionText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Submit Answer to Backend Chat API
  const handleSubmitAnswer = async () => {
    if (!candidateAnswerInput.trim()) return;

    const textToSend = candidateAnswerInput.trim();
    setCandidateAnswerInput('');
    setIsSubmittingAnswer(true);

    const now = new Date();
    const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Add user's transcript locally
    setTranscripts((prev) => [
      ...prev,
      {
        speaker: 'user',
        text: textToSend,
        timestamp: timeStr,
      },
    ]);

    try {
      const res = await InterviewService.sendAnswer(textToSend, currentQuestionIndex);

      if (res && res.agentResponse) {
        setTranscripts((prev) => [
          ...prev,
          {
            speaker: 'agent',
            text: res.agentResponse,
            timestamp: timeStr,
          },
        ]);

        // Speak the agent's response
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(res.agentResponse);
          u.lang = 'id-ID';
          u.rate = 0.95;
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
    } catch (e) {
      console.warn('Send answer fallback:', e);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Finish Interview & Request Scorecard
  const handleFinishInterview = async () => {
    try {
      const res = await InterviewService.stopInterview();
      if (res && res.scorecard) {
        setScorecard(res.scorecard);
      }
    } catch (e) {
      console.warn('Stop interview fallback:', e);
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

  // Toggle Mute
  const handleToggleMic = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
    InterviewService.setMute(!nextState);
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    const nextState = !isCameraOn;
    setIsCameraOn(nextState);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
  };

  // Developer Bypass Button handler
  const handleDevUnlock = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('asiaplastik_interview_dev_unlocked', 'true');
    }
    setDevUnlocked(true);
  };

  // -------------------------------------------------------------
  // RENDER: JIKA TERKUNCI (MODE TERANG)
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-sky-600 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Pelamar</span>
          </Link>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Tahap 4 Terkunci</span>
          </span>
        </header>

        <main className="max-w-lg mx-auto w-full text-center space-y-6 my-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tahap 4: Wawancara Online AI Terkunci
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Untuk alur normal pelamar, Anda perlu menyelesaikan{' '}
              <strong className="text-sky-600">Tahap 2 (Biodata Diri)</strong> dan mengunggah dokumen di{' '}
              <strong className="text-sky-600">Tahap 3 (Berkas & CV)</strong>.
            </p>
          </div>

          {/* Banner Mode Uji Coba / Developer Bypass */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-left space-y-3">
            <div className="flex items-center gap-2 text-sky-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Akses Cepat Pengujian & Evaluasi AI</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Anda dapat langsung membuka dan mencoba ruang wawancara online AI berbasis Web Audio & Backend Rust/Next.js tanpa harus mengisi tahapan sebelumnya.
            </p>
            <button
              onClick={handleDevUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Buka Akses Langsung (Mode Uji Coba)</span>
            </button>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/dashboard/profile"
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Isi Biodata Diri (Tahap 2)
            </Link>
            <Link
              href="/dashboard/screening"
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cek Berkas & CV (Tahap 3)
            </Link>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-3">
          Sistem Rekrutmen Resmi &bull; CV. Asia Plastik Sidoarjo
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: RUANG WAWANCARA ONLINE UTAMA (MODE TERANG MODERN)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
      {/* =========================================================================
          TOP NAVBAR: IDENTITAS RESMI, STATUS ENGINE, TIMER, & SETTINGS
          ========================================================================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Kembali ke Beranda"
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
              Tahap 4: AI Voice Interview Studio
            </span>
            <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-mono font-medium">
              QC Supervisor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
              backendStatus.mode === 'rust_axum_engine'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-purple-50 border-purple-200 text-purple-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                backendStatus.mode === 'rust_axum_engine' ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
            />
            <span>{backendStatus.label}</span>
          </div>

          {/* Stepper Dots (1, 2, 3, 4, 5) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((num, i) => (
              <button
                key={num}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i === currentQuestionIndex
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : i < currentQuestionIndex
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white text-slate-500 hover:bg-slate-200/70 border border-slate-200'
                }`}
                title={`Pindah ke Soal #${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Device Settings Button */}
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
          KONTEN UTAMA: RESPONSIVE 2 KOLOM (STAGE VIDEO KIRI + TRANSKRIP & RESPON KANAN)
          ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row p-3 sm:p-4 gap-4 overflow-y-auto lg:overflow-hidden">
        {/* -------------------------------------------------------------
            KOLOM KIRI: STAGE ASESOR AI & LIVE WEBCAM + AUDIO VISUALIZER
            ------------------------------------------------------------- */}
        <div className="w-full lg:flex-[52] bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs relative shrink-0 min-h-[380px] lg:min-h-0">
          {/* Header Kartu Kiri: Topik Evaluasi */}
          <div className="flex items-center justify-between z-10">
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

          {/* Center Stage: Avatar Asesor AI (Dewi Lestari) */}
          <div className="my-auto text-center space-y-4 py-4 z-10">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
              {/* Animated Speaking Rings */}
              {isAiSpeaking && (
                <>
                  <div className="absolute -inset-4 rounded-full border-2 border-sky-400/50 animate-ping opacity-60" />
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/60 animate-pulse" />
                </>
              )}

              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-sky-100 via-slate-100 to-sky-50 border-4 border-white flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/assets/images/Dewi-lestari.jpg"
                  alt="Dewi Lestari Asesor"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <User className="w-14 h-14 text-sky-400 absolute" />
              </div>

              {/* Status Pill on Avatar */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs flex items-center gap-1.5 bg-white border-slate-200 text-slate-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAiSpeaking ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                <span>
                  {isAiSpeaking ? 'Asesor Berbicara...' : 'Mendengarkan Anda'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 tracking-wide">Dewi Lestari, S.Psi.</h4>
              <p className="text-xs text-sky-600 font-medium">
                Lead Talent Acquisition & Asesor QC &bull; CV. Asia Plastik Sidoarjo
              </p>
            </div>
          </div>

          {/* Floating Candidate Webcam Box (Top-Right / PiP Style) */}
          <div className="absolute top-4 right-4 w-36 sm:w-44 aspect-video rounded-2xl bg-slate-900 border border-slate-200 p-1 flex flex-col justify-between text-white shadow-lg overflow-hidden z-10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-xl ${isCameraOn ? 'block' : 'hidden'}`}
            />

            {!isCameraOn && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-xl text-slate-400">
                <VideoOff className="w-6 h-6 mb-1" />
                <span className="text-[9px]">Kamera Mati</span>
              </div>
            )}

            {/* Candidate PiP Header Overlay */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-white">
              <span className="font-semibold truncate">
                {candidate.fullName || 'Anda (Kandidat)'}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isMicOn ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Bottom Audio Waveform Visualizer & Controls */}
          <div className="pt-3 border-t border-slate-100 space-y-3 z-10">
            {/* Real-time Web Audio Canvas Visualizer */}
            <div className="w-full h-8 bg-slate-50 rounded-xl border border-slate-200 flex items-center px-3 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={360}
                height={32}
                className="w-full h-full"
              />
            </div>

            {/* Control Bar: Replay Audio, Mic, Camera */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePlayQuestionAudio}
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Dengarkan pembacaan pertanyaan dengan suara AI"
              >
                {isAiSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-sky-600" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Dengarkan Soal (Suara AI)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMic}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicOn
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                  title={isMicOn ? 'Bisukan Mikrofon' : 'Aktifkan Mikrofon'}
                >
                  {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-600" /> : <MicOff className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{isMicOn ? 'Mic Aktif' : 'Mic Bisu'}</span>
                </button>

                <button
                  onClick={handleToggleCamera}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCameraOn
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                  title={isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
                >
                  {isCameraOn ? <Video className="w-3.5 h-3.5 text-emerald-600" /> : <VideoOff className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{isCameraOn ? 'Video Aktif' : 'Video Mati'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            KOLOM KANAN: PERTANYAAN, TRANSKRIP LIVE, & LEMBAR JAWABAN
            ------------------------------------------------------------- */}
        <div className="w-full lg:flex-[48] bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs overflow-hidden shrink-0">
          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            {/* Header Soal & Tombol Maksud Soal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  #{activeQuestion.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  {activeQuestion.category}
                </h3>
              </div>
              <button
                onClick={() => setShowClarificationModal(true)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Maksud Pertanyaan & Kisi-kisi</span>
              </button>
            </div>

            {/* Box Teks Pertanyaan Utama */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shrink-0">
              &ldquo;{activeQuestion.questionText}&rdquo;
            </div>

            {/* Live Conversation Transcript Stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[120px] max-h-[220px] lg:max-h-none border border-slate-200 rounded-2xl p-3 bg-slate-50/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Transkrip Percakapan Dua Arah:
              </span>

              {transcripts.length === 0 && (
                <p className="text-xs text-slate-400 italic">Memulai transkrip real-time...</p>
              )}

              {transcripts.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-xs ${
                    t.speaker === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {t.speaker === 'agent' && (
                    <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      t.speaker === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{t.text}</p>
                    <span
                      className={`text-[9px] mt-1 block ${
                        t.speaker === 'user' ? 'text-sky-100 text-right' : 'text-slate-400'
                      }`}
                    >
                      {t.timestamp}
                    </span>
                  </div>

                  {t.speaker === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                      Anda
                    </div>
                  )}
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Candidate Voice/Text Answer Input Area */}
            <div className="space-y-2 pt-1 shrink-0">
              <div className="relative">
                <textarea
                  value={candidateAnswerInput}
                  onChange={(e) => setCandidateAnswerInput(e.target.value)}
                  placeholder="Ketik jawaban Anda atau klik tombol 'Bicara Lewat Mic' di bawah..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all resize-none"
                />

                {isCandidateRecording && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Mendengarkan suara Anda...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Bicara Mic, Kirim Respon */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCandidateRecording
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isCandidateRecording ? 'Hentikan Rekam' : 'Bicara Lewat Mic'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!candidateAnswerInput.trim() || isSubmittingAnswer}
                  className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-sky-600/20 cursor-pointer"
                >
                  <span>Kirim Respon</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar Bawah (Previous, Next, Finish) */}
          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((prev) => prev - 1);
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
            >
              &larr; Soal Sebelumnya
            </button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Lewati ke Soal Berikutnya &rarr;
                </button>
              ) : null}

              <button
                onClick={handleFinishInterview}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Selesaikan & Evaluasi</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL DETAIL PENJELASAN SOAL (KETIKA KLIK "Maksud Pertanyaan")
          ========================================================================= */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Maksud Pertanyaan & Panduan Jawaban</h3>
                  <p className="text-xs text-slate-500">Kisi-kisi kompetensi resmi CV. Asia Plastik</p>
                </div>
              </div>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 block">Inti Soal:</span>
                <p className="text-slate-700 leading-relaxed">{activeQuestion.simplifiedIntent}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-sky-700 block">Poin yang Diharapkan Tim Rekruter:</span>
                <div className="space-y-1">
                  {activeQuestion.expectedPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-slate-700">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeQuestion.jargonGlossary.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-purple-700 block">Kamus Istilah Teknis dalam Pertanyaan:</span>
                  <div className="space-y-1">
                    {activeQuestion.jargonGlossary.map((j, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                        <strong className="text-slate-900">{j.term}:</strong> <span className="text-slate-600">{j.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowClarificationModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Kembali ke Wawancara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL PENGATURAN PERANGKAT AUDIO (WASAPI / BROWSER ENUMERATION)
          ========================================================================= */}
      {showDeviceSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Pengaturan Perangkat Audio & Mic</h3>
              </div>
              <button
                onClick={() => setShowDeviceSettingsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {audioDevices.mics.length > 0 ? (
                    audioDevices.mics.map((m) => (
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {audioDevices.speakers.length > 0 ? (
                    audioDevices.speakers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option value="default_speaker">Speaker Standar Sistem</option>
                  )}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                Engine Audio: <strong className="text-slate-900">{backendStatus.label}</strong>. Perubahan perangkat diterapkan secara langsung ke stream audio.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDeviceSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Terapkan & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL SCORECARD EVALUASI 4-PILAR (SESUAI BACKEND RUST & FRONTEND)
          ========================================================================= */}
      {showScorecardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Header Scorecard */}
            <div className="text-center space-y-2 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Hasil Evaluasi 4-Pilar Wawancara Online AI
              </h3>
              <p className="text-xs text-slate-500">
                Laporan Asesmen Kompetensi Terpadu &bull; CV. Asia Plastik Sidoarjo
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  Keputusan Asesor AI
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  {scorecard?.verdict || 'Rekomendasi Lulus ke Tahap Asesmen Psikotes'}
                </h4>
                <p className="text-xs text-slate-600">
                  Kandidat: <strong className="text-slate-900">{candidate.fullName || 'Budi Santoso'}</strong> ({candidate.appliedRole || 'Supervisor QC'})
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shrink-0 shadow-xs">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">
                    {scorecard?.overall_score || 88}
                  </span>
                  <span className="text-xs text-slate-400"> / 100</span>
                </div>
              </div>
            </div>

            {/* 4 Core Pillars Breakdown */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 block">
                Rincian Skor 4-Pilar Kompetensi:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Pilar 1: CV Alignment */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">1. Kesesuaian Pengalaman & CV</span>
                    <span className="font-bold text-sky-600">{scorecard?.cv_alignment_score || 86}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{ width: `${scorecard?.cv_alignment_score || 86}%` }}
                    />
                  </div>
                </div>

                {/* Pilar 2: Clarity */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">2. Kejelasan Komunikasi & Artikulasi</span>
                    <span className="font-bold text-emerald-600">{scorecard?.explanation_clarity_score || 90}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${scorecard?.explanation_clarity_score || 90}%` }}
                    />
                  </div>
                </div>

                {/* Pilar 3: Technical Depth */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">3. Kedalaman Teknis QC Injeksi Plastik</span>
                    <span className="font-bold text-purple-600">{scorecard?.technical_depth_score || 88}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${scorecard?.technical_depth_score || 88}%` }}
                    />
                  </div>
                </div>

                {/* Pilar 4: Problem Solving & K3 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">4. Pemecahan Masalah 5-Why & K3 LOTO</span>
                    <span className="font-bold text-amber-600">{scorecard?.problem_solving_score || 87}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${scorecard?.problem_solving_score || 87}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Evaluator Notes */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Catatan Positif Asesor:</span>
              <ul className="space-y-1 text-slate-600">
                {(scorecard?.strengths || [
                  'Kandidat memahami penyetelan clamping force dan holding pressure untuk atasi Flash & Shrinkage.',
                  'Memiliki pendekatan berbasis data saat berhadapan dengan target kuota shift supervisor produksi.',
                  'Menunjukkan kepatuhan mutlak pada prosedur LOTO (Lockout-Tagout) dan keselamatan kerja K3.',
                ]).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setShowScorecardModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Lihat Ruang Wawancara Kembali
              </button>

              <button
                onClick={handleProceedToPsychology}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Lanjut ke Tahap 5: Psikotes Online</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

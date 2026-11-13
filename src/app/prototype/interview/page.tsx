'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Clock,
  User,
  Info,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

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

// ==========================================
// ROOT COMPONENT EXPORT (WITH SUSPENSE)
// ==========================================
export default function AIInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-slate-800 font-sans">
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
  // State Sesi Wawancara
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(308); // 05:08 seperti di screenshot user
  const [showClarificationModal, setShowClarificationModal] = useState<boolean>(false);

  const activeQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const totalQuestions = INTERVIEW_QUESTIONS.length;

  // Timer simulasi
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAiSpeaking(true);
      setIsPlayingAudio(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsAiSpeaking(true);
      setIsPlayingAudio(true);
    }
  };

  const toggleReplayAudio = () => {
    setIsPlayingAudio((prev) => !prev);
    setIsAiSpeaking((prev) => !prev);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between overflow-hidden bg-[#fafafa] font-sans selection:bg-sky-500 selection:text-white">
      {/* =========================================================================
          TOP NAVBAR: IDENTITAS RESMI, STEPPER BULAT (1-5), DAN TIMER
          ========================================================================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/logos/logo.webp"
            alt="CV. Asia Plastik"
            width={110}
            height={32}
            className="h-6 w-auto object-contain"
          />
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-800">
            Tahap 4 Seleksi: Wawancara Kompetensi Kerja
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Stepper Dots (1, 2, 3, 4, 5) */}
          <div className="flex items-center gap-1.5 mr-2">
            {[1, 2, 3, 4, 5].map((num, i) => (
              <button
                key={num}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i === currentQuestionIndex
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : i < currentQuestionIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={`Pindah ke Soal #${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {formatTimer(elapsedSeconds)}
          </span>
        </div>
      </header>

      {/* =========================================================================
          KONTEN UTAMA: 2 KOLOM (STAGE VIDEO KIRI + DOKUMEN TRANSKRIP KANAN)
          ========================================================================= */}
      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* -------------------------------------------------------------
            KOLOM KIRI: STAGE VIDEO PEWAWANCARA & WEBCAM PELAMAR
            ------------------------------------------------------------- */}
        <div className="flex-[55] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs relative">
          {/* Header Kartu Kiri: Evaluasi Kompetensi */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              Evaluasi: <strong className="text-slate-900">{activeQuestion.competency}</strong>
            </span>
          </div>

          {/* Avatar Pewawancara Tengah (Dewi Lestari) */}
          <div className="my-auto text-center space-y-3">
            <div className="relative w-32 h-32 mx-auto rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
              <User className="w-14 h-14 text-slate-400" />
              {isAiSpeaking && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-pulse opacity-40" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Dewi Lestari</h4>
              <p className="text-xs text-slate-500">Asesor Rekrutmen CV. Asia Plastik</p>
            </div>
          </div>

          {/* Kotak Webcam Pelamar di Sudut Kanan Atas (Sesuai Screenshot User) */}
          <div className="absolute top-6 right-6 w-36 aspect-video rounded-xl bg-slate-900 border border-slate-200 p-2.5 flex flex-col justify-between text-white shadow-xs">
            <span className="text-[9px] text-slate-400">Webcam Pelamar</span>
            <span className="text-[10px] text-center text-slate-300 font-medium">
              {isCameraOn ? 'Aktif' : 'Mati'}
            </span>
            <span className={`w-2 h-2 rounded-full self-end ${isMicOn ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          </div>

          {/* Bilah Kontrol Bawah Video: Putar Ulang & Tombol Mic/Video */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={toggleReplayAudio}
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Jeda Suara' : 'Putar Ulang Pertanyaan'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  isMicOn
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-rose-600 text-white border-transparent'
                }`}
              >
                {isMicOn ? 'Mic Nyala' : 'Mic Bisu'}
              </button>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  isCameraOn
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-rose-600 text-white border-transparent'
                }`}
              >
                {isCameraOn ? 'Video Nyala' : 'Video Mati'}
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            KOLOM KANAN: PERSIS SEPERTI GAMBAR PERTAMA USER
            (Transkrip Soal #{id} | Lihat Maksud Soal + Teks Sans-Serif + Box Inti Soal)
            ------------------------------------------------------------- */}
        <div className="flex-[45] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Header Box: Transkrip Soal #{id} (Bold Sans-Serif) & Lihat Maksud Soal (Amber Link) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Transkrip Soal #{activeQuestion.id}
              </h3>
              <button
                onClick={() => setShowClarificationModal(true)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors cursor-pointer"
              >
                Lihat Maksud Soal
              </button>
            </div>

            {/* Teks Pertanyaan: Sans-Serif Bersih, Warna Gelap Tegas, Tanpa Italic Serif */}
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-normal">
              &ldquo;{activeQuestion.questionText}&rdquo;
            </p>

            {/* Kotak Inti Soal: Border Kuning/Amber dengan Latar Lembut (Persis Gambar Pertama) */}
            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 text-xs leading-relaxed">
              <strong className="font-bold text-slate-900">Inti Soal:</strong>{' '}
              <span className="text-slate-800">{activeQuestion.simplifiedIntent}</span>
            </div>

            {/* Checklist Poin-poin Kunci Jawaban */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 block">
                Poin-poin Kunci Jawaban:
              </span>
              <div className="space-y-1.5">
                {activeQuestion.expectedPoints.map((pt: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bilah Tombol Navigasi Bawah */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors"
            >
              ← Soal Sebelumnya
            </button>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Link
                href="/dashboard/status"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Selesaikan Wawancara</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Soal Selanjutnya →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL DETAIL PENJELASAN SOAL (KETIKA KLIK "Lihat Maksud Soal")
          ========================================================================= */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Penjelasan Maksud Pertanyaan</h3>
                  <p className="text-xs text-slate-500">Panduan bahasa sederhana jika pertanyaan kurang jelas</p>
                </div>
              </div>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 block">Inti Soal:</span>
                <p className="text-slate-800 leading-relaxed">{activeQuestion.simplifiedIntent}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Poin yang Diharapkan Tim Rekruter:</span>
                <ul className="space-y-1 pl-1">
                  {activeQuestion.expectedPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeQuestion.jargonGlossary.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">Kamus Istilah Teknis dalam Pertanyaan:</span>
                  <div className="space-y-1">
                    {activeQuestion.jargonGlossary.map((j, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
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
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Kembali ke Wawancara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

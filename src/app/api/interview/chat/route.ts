import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession } from '@/lib/interviewSession';

const ASIA_QUESTIONS = [
  {
    step: 1,
    topic: 'Pengawasan Mutu & Cacat Produk Injeksi',
    agentPrompt:
      'Selamat pagi rekan pelamar. Terima kasih telah hadir di sesi wawancara online CV. Asia Plastik. Bisakah Anda menceritakan pengalaman Anda dalam pengawasan mutu di lini produksi, serta bagaimana langkah sistematis Anda dalam mengidentifikasi dan menangani cacat produk seperti "flash" (kelebihan material) dan "shrinkage" (penyusutan) pada mesin cetak plastik?',
  },
  {
    step: 2,
    topic: 'Investigasi 5-Why & Tindakan Korektif CAPA',
    agentPrompt:
      'Baik, penjelasan yang menarik. Sekarang bayangkan terjadi kasus kritis di mana satu lot produksi botol plastik ditemukan mengalami kebocoran mikro sebelum dikirim ke pelanggan. Langkah investigasi akar masalah dengan metode 5-Why serta tindakan perbaikan (CAPA) apa yang akan segera Anda jalankan?',
  },
  {
    step: 3,
    topic: 'Kepemimpinan Shift & Ketegasan Integritas Mutu',
    agentPrompt:
      'Sebagai Supervisor QC, seringkali target mutu berhadapan dengan target kuota tim produksi. Jika Supervisor Produksi mendesak agar suatu lot yang meragukan tetap diloloskan agar kuota shift tercapai, bagaimana pendekatan komunikasi profesional dan ketegasan Anda?',
  },
  {
    step: 4,
    topic: 'Kepatuhan K3 Manufaktur & Prosedur LOTO',
    agentPrompt:
      'Di area mesin injeksi plastik bersuhu tinggi dan sistem hidrolik pabrik, keselamatan kerja adalah prioritas mutlak di CV. Asia Plastik. Bagaimana Anda memastikan tim inspeksi Anda konsisten mematuhi APD dan prosedur Lockout-Tagout (LOTO) saat memeriksa cetakan mold?',
  },
  {
    step: 5,
    topic: 'Motivasi & Komitmen Penurunan Scrap Rate',
    agentPrompt:
      'Pertanyaan terakhir dari kami: Mengapa Anda memilih berkarir di pabrik CV. Asia Plastik di Sidoarjo, dan apa target nyata yang ingin Anda capai dalam 6 bulan pertama kerja untuk menekan scrap rate produk?',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userText, currentQuestionIndex } = body;

    const session = getActiveSession();
    const now = new Date();
    const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Add candidate turn
    if (userText && userText.trim().length > 0) {
      session.transcript.push({
        speaker: 'user',
        text: userText.trim(),
        timestamp: timeStr,
      });
    }

    const nextIdx = typeof currentQuestionIndex === 'number' ? currentQuestionIndex + 1 : 1;

    let nextAgentResponse = '';
    let isFinished = false;

    if (nextIdx < ASIA_QUESTIONS.length) {
      const q = ASIA_QUESTIONS[nextIdx];
      nextAgentResponse = q.agentPrompt;
      session.transcript.push({
        speaker: 'agent',
        text: nextAgentResponse,
        timestamp: timeStr,
      });
    } else {
      isFinished = true;
      nextAgentResponse = `Terima kasih banyak ${session.candidate_name}. Seluruh rangkaian pertanyaan wawancara online AI untuk CV. Asia Plastik telah selesai. Sistem sedang menganalisis rekaman jawaban dan menyusun evaluasi 4-Pilar Kompetensi Anda.`;
      session.transcript.push({
        speaker: 'agent',
        text: nextAgentResponse,
        timestamp: timeStr,
      });
    }

    return NextResponse.json({
      ok: true,
      transcript: session.transcript,
      nextQuestionIndex: nextIdx,
      agentResponse: nextAgentResponse,
      isFinished,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

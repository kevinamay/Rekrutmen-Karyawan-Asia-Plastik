import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession } from '@/lib/interviewSession';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Check if external Rust backend is online, try forwarding
    try {
      const rustRes = await fetch('http://localhost:8787/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (rustRes.ok) {
        const rustData = await rustRes.json();
        return NextResponse.json({
          ...rustData,
          engine: 'rust_axum',
        });
      }
    } catch (e) {
      // Rust backend not reachable, proceed with local Next.js engine
    }

    // 2. Local Integrated Engine
    const session = getActiveSession();
    session.phase = 'active';
    session.application_id = `app_${Date.now()}`;
    session.job_id = body.job_id || 'job_qc_supervisor';
    session.conversation_id = `conv_${Date.now()}`;
    session.candidate_name = body.candidate_name || 'Pelamar';
    session.candidate_email = body.candidate_email || '';
    session.job_role = body.job_role || 'Supervisor Quality Control (QC)';
    session.mic = body.mic || 'default_mic';
    session.speaker = body.speaker || 'default_speaker';
    session.muted = false;
    session.started_at = new Date().toISOString();
    session.error = null;
    session.scorecard = null;

    // Initial greeting from Asesor AI CV. Asia Plastik
    session.transcript = [
      {
        speaker: 'agent',
        text: `Selamat pagi ${session.candidate_name}. Selamat datang di ruang wawancara kerja CV. Asia Plastik Sidoarjo untuk posisi ${session.job_role}. Sebelum kita mulai, bisakah Anda ceritakan secara singkat latar belakang dan pengalaman kerja Anda di bidang manufaktur plastik?`,
        timestamp: '00:05',
      },
    ];

    return NextResponse.json({
      ok: true,
      phase: 'active',
      application_id: session.application_id,
      conversation_id: session.conversation_id,
      engine: 'nextjs_integrated',
      message: 'Sesi wawancara AI berhasil dimulai.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || 'Gagal memulai wawancara' },
      { status: 500 }
    );
  }
}

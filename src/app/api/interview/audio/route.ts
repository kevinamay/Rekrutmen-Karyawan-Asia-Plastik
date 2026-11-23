import { NextRequest, NextResponse } from 'next/server';
import { getActiveSession } from '@/lib/interviewSession';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      const rustRes = await fetch('http://localhost:8787/api/interview/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (rustRes.ok) {
        return NextResponse.json({ ok: true, engine: 'rust_axum' });
      }
    } catch (e) {
      // fallback
    }

    const session = getActiveSession();
    if (body.muted !== undefined) {
      session.muted = Boolean(body.muted);
    }
    if (body.mic) {
      session.mic = body.mic;
    }
    if (body.speaker) {
      session.speaker = body.speaker;
    }

    return NextResponse.json({
      ok: true,
      muted: session.muted,
      mic: session.mic,
      speaker: session.speaker,
      engine: 'nextjs_integrated',
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

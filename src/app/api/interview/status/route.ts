import { NextResponse } from 'next/server';
import { getActiveSession } from '@/lib/interviewSession';

export async function GET() {
  // 1. Try Rust backend
  try {
    const rustRes = await fetch('http://localhost:8787/api/interview/status', { cache: 'no-store' });
    if (rustRes.ok) {
      const data = await rustRes.json();
      return NextResponse.json({
        ...data,
        engine: 'rust_axum',
      });
    }
  } catch (e) {
    // fallback
  }

  // 2. Fallback to Local Integrated Engine
  const session = getActiveSession();
  return NextResponse.json({
    ...session,
    engine: 'nextjs_integrated',
  });
}

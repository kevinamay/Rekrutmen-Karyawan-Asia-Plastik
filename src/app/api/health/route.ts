import { NextResponse } from 'next/server';

export async function GET() {
  // Check if external Rust backend on port 8787 is accessible
  let rustBackendOnline = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const res = await fetch('http://localhost:8787/api/health', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    rustBackendOnline = res.ok;
  } catch (e) {
    rustBackendOnline = false;
  }

  return NextResponse.json({
    status: 'ok',
    service: 'cv-asia-plastik-ai-interview',
    rust_backend_url: 'http://localhost:8787',
    rust_backend_connected: rustBackendOnline,
    mode: rustBackendOnline ? 'rust_axum_engine' : 'nextjs_integrated_engine',
    timestamp: new Date().toISOString(),
  });
}

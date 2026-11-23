import { NextResponse } from 'next/server';

export async function GET() {
  // If Rust backend is online, forward request
  try {
    const res = await fetch('http://localhost:8787/api/devices', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (e) {
    // fallback
  }

  return NextResponse.json({
    mics: [
      { id: 'default_mic', name: 'Microphone Default Sistem (High Definition Audio)' },
      { id: 'usb_mic', name: 'USB Headset Microphone (CV. Asia Plastik Studio)' },
    ],
    speakers: [
      { id: 'default_speaker', name: 'Speakers / Headphones Sistem' },
      { id: 'usb_speaker', name: 'Headset Earphone Stereo' },
    ],
    active_mic: 'default_mic',
    active_speaker: 'default_speaker',
  });
}

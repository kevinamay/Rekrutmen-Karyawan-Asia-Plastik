'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  /**
   * Durasi tampilan splash screen sebelum mulai fade-out (dalam milidetik).
   * Default: 1700ms
   */
  displayDuration?: number;
}

/**
 * Splash Screen Resmi CV. Asia Plastik
 * Desain: Ambient Soft Neo (Desain 5 Terpilih)
 * Menggunakan gradien latar putih ke biru muda halus, radial light beam,
 * kartu neo-glassmorphic, dan circular progress ring.
 */
export function SplashScreen({ displayDuration = 1700 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    // Kunci scroll halaman saat splash screen aktif
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Tahapan pergerakan progress bar sirkular yang halus
    const t1 = setTimeout(() => setProgress(48), 250);
    const t2 = setTimeout(() => setProgress(82), 700);
    const t3 = setTimeout(() => setProgress(100), 1150);

    // Mulai animasi fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, displayDuration);

    // Unmount dari DOM setelah transisi fade-out selesai
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = originalOverflow;
    }, displayDuration + 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [displayDuration]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Memuat Portal Rekrutmen CV. Asia Plastik"
      className={`fixed inset-0 z-[999999] select-none transition-all duration-700 ease-in-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      <div className="h-full w-full flex flex-col justify-between items-center p-6 sm:p-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-sky-50 to-sky-200/70 text-slate-800 relative overflow-hidden">
        {/* Ambient Lighting Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[360px] h-[360px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Information */}
        <div className="w-full max-w-4xl flex items-center justify-between text-[11px] font-semibold text-slate-400 tracking-widest z-10">
          <span className="text-sky-700 font-bold tracking-wider">ASIA PLASTIK</span>
          <span className="tracking-widest">KARIR 2026</span>
        </div>

        {/* Central Soft Neo Container */}
        <div className="z-10 flex flex-col items-center text-center space-y-6 my-auto animate-in fade-in zoom-in-95 duration-700">
          {/* Card Neo Glassmorphism */}
          <div className="relative p-7 sm:p-9 rounded-3xl bg-white/90 backdrop-blur-md shadow-xl shadow-sky-900/5 border border-white flex flex-col items-center transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="Logo Resmi CV. Asia Plastik"
              width={240}
              height={64}
              priority
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-xs"
            />
          </div>

          {/* Circular Smooth Progress Indicator */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-sky-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-sky-600 transition-all duration-300 ease-out"
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {progress < 100 ? 'Menyinkronkan Portal...' : 'Sistem Siap'}
            </span>
            <span className="text-xs font-mono font-bold text-sky-700">{progress}%</span>
          </div>
        </div>

        {/* Footer Minimalis */}
        <div className="z-10 flex items-center gap-2 text-[11px] text-slate-500 pb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CV. Asia Plastik • Industri Manufaktur Plastik Terpadu</span>
        </div>
      </div>
    </aside>
  );
}

export default SplashScreen;

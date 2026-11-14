'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  /**
   * Durasi tampilan splash screen sebelum mulai fade-out (dalam milidetik).
   * Default: 1600ms (1.6 detik)
   */
  displayDuration?: number;
}

export function SplashScreen({ displayDuration = 1600 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Kunci scroll halaman saat splash screen masih tampil
    document.body.style.overflow = 'hidden';

    // Tahapan animasi progress bar yang halus
    const timer1 = setTimeout(() => setProgress(45), 250);
    const timer2 = setTimeout(() => setProgress(80), 750);
    const timer3 = setTimeout(() => setProgress(100), 1200);

    // Mulai transisi fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, displayDuration);

    // Lepas elemen sepenuhnya dari DOM setelah fade-out selesai
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, displayDuration + 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, [displayDuration]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Memuat Portal Rekrutmen CV. Asia Plastik"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-10 select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 40%, #E0F2FE 80%, #BAE6FD 100%)',
      }}
    >
      {/* Decorative ambient glowing orbs (lembut biru muda di latar) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/60 rounded-full blur-2xl pointer-events-none" />

      {/* Top spacing placeholder */}
      <div className="w-full flex justify-between items-center z-10 text-[11px] font-semibold text-sky-800/70 tracking-wider uppercase">
        <span>CV. Asia Plastik</span>
        <span>Sistem Rekrutmen</span>
      </div>

      {/* Central Branding Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full mx-auto my-auto animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Card with subtle glassmorphism */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/85 backdrop-blur-md border border-white/90 shadow-2xl shadow-sky-900/10 flex flex-col items-center gap-5 transition-all">
          <div className="relative transform transition-transform duration-500 hover:scale-105">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="Logo Resmi CV. Asia Plastik"
              width={220}
              height={60}
              priority
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-xs"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-sky-100/80 w-full">
            <h1 className="text-xs font-black tracking-[0.22em] text-slate-800 uppercase">
              Portal Karir Karyawan
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Sistem Seleksi Resmi CV. Asia Plastik
            </p>
          </div>

          {/* Smooth Animated Progress Bar */}
          <div className="w-full space-y-2 pt-2">
            <div className="w-full h-1.5 bg-sky-100/90 rounded-full overflow-hidden p-0.5 border border-sky-200/50 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-sky-700 font-semibold font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Memuat modul...
              </span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accreditation Badge */}
      <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-500 font-medium tracking-wide bg-white/60 backdrop-blur-xs px-4 py-1.5 rounded-full border border-sky-100 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Standar Industri Manufaktur Plastik Terpadu</span>
      </div>
    </aside>
  );
}

export default SplashScreen;


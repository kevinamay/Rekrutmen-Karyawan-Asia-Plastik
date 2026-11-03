'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export interface VariantOption {
  id: string;
  name: string;
  desc?: string;
}

interface PrototypeSwitcherProps {
  variants: VariantOption[];
  currentVariant: string;
  onSelectVariant?: (variantId: string) => void;
}

export function PrototypeSwitcher({
  variants,
  currentVariant,
  onSelectVariant,
}: PrototypeSwitcherProps) {
  const router = useRouter();

  const currentIndex = Math.max(
    0,
    variants.findIndex((v) => v.id.toLowerCase() === currentVariant.toLowerCase())
  );

  const switchVariant = useCallback(
    (newId: string) => {
      if (onSelectVariant) {
        onSelectVariant(newId);
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', newId);
      window.history.pushState({}, '', url.toString());
      router.refresh();
    },
    [onSelectVariant, router]
  );

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length;
    switchVariant(variants[prevIndex].id);
  }, [currentIndex, variants, switchVariant]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % variants.length;
    switchVariant(variants[nextIndex].id);
  }, [currentIndex, variants, switchVariant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const active = variants[currentIndex] || variants[0];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[95vw]">
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-sky-400/30 text-white rounded-full shadow-2xl shadow-sky-950/40">
        <button
          onClick={handlePrev}
          title="Desain Sebelumnya (Panah Kiri)"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {variants.map((v) => {
            const isSelected = v.id.toLowerCase() === currentVariant.toLowerCase();
            return (
              <button
                key={v.id}
                onClick={() => switchVariant(v.id)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{v.id}</span>
                <span className="hidden sm:inline font-normal opacity-90 text-[11px]">
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          title="Desain Berikutnya (Panah Kanan)"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-[11px] font-semibold text-slate-600 bg-white/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-sky-200/60 shadow-sm flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-sky-600" />
        <span>
          Opsi {active.id}: <strong className="text-slate-900">{active.name}</strong>
          {active.desc ? ` — ${active.desc}` : ''}
        </span>
        <span className="text-slate-400 font-normal hidden md:inline">
          (Gunakan tombol panah ◄ ►)
        </span>
      </div>
    </div>
  );
}

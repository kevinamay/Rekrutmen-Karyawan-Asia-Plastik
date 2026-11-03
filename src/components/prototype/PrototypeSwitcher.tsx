'use client';

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export interface PrototypeVariantInfo {
  id: string;
  name: string;
  description: string;
}

interface PrototypeSwitcherProps {
  variants: PrototypeVariantInfo[];
  currentVariant: string;
  onSelectVariant: (variantId: string) => void;
}

export function PrototypeSwitcher({
  variants,
  currentVariant,
  onSelectVariant,
}: PrototypeSwitcherProps) {
  const currentIndex = variants.findIndex((v) => v.id === currentVariant);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const activeVariant = variants[activeIndex] || variants[0];

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + variants.length) % variants.length;
    onSelectVariant(variants[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % variants.length;
    onSelectVariant(variants[nextIdx].id);
  };

  // Keyboard navigation: Left & Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      if (isInput) return;

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
  }, [activeIndex, variants]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-auto">
      {/* High-contrast floating pill */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 text-white rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-lg">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          title="Desain Sebelumnya (Panah Kiri ←)"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Prototype Indicator & Direct Click Pills */}
        <div className="flex items-center gap-1 px-1">
          <div className="flex items-center gap-1 mr-2 text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desain:</span>
          </div>

          {variants.map((v) => {
            const isActive = v.id === currentVariant;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVariant(v.id)}
                className={`w-7 h-7 rounded-full text-xs font-black transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white scale-110 shadow-md shadow-blue-500/40 ring-2 ring-white/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
                title={`${v.id}: ${v.name}`}
              >
                {v.id}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          title="Desain Berikutnya (Panah Kanan →)"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Variant Name Badge */}
      <div className="px-3 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-slate-300 border border-slate-700/50 backdrop-blur-sm shadow-md flex items-center gap-1.5">
        <span className="font-bold text-blue-400">{activeVariant.id}</span>
        <span>—</span>
        <span className="font-medium text-slate-200">{activeVariant.name}</span>
        <span className="hidden md:inline text-slate-400">({activeVariant.description})</span>
      </div>
    </div>
  );
}

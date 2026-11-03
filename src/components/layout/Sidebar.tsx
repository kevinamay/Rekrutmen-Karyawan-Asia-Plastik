'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  User,
  FileCheck2,
  Cpu,
  Bot,
  Brain,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogIn,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const STAGE_ICONS = {
  application: LogIn,
  profile: User,
  'cv-screening': FileCheck2,
  'competency-test': Cpu,
  'ai-interview': Bot,
  'psychology-test': Brain,
  'practical-final': Award,
};

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { stages, candidate } = useRecruitment();

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col bg-white border-r border-corporate-200/80 h-full overflow-y-auto p-4 space-y-6">
      {/* Candidate Snapshot Card */}
      <div className="rounded-2xl bg-gradient-to-br from-pastel-blush via-white to-pastel-lavender/40 p-4 border border-blush-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blush-300 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-200" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-corporate-900 truncate">
              {candidate.fullName}
            </h4>
            <p className="text-xs text-corporate-500 truncate">{candidate.appliedRole}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="blush" className="text-[10px] py-0 px-2">
                Overall: {candidate.overallScore}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Mini progress tracker */}
        <div className="mt-4 pt-3 border-t border-blush-100/80 flex items-center justify-between text-xs text-corporate-600 font-medium">
          <span className="flex items-center gap-1 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-blush-500" />
            Recruitment Flow
          </span>
          <span className="text-blush-600 font-bold text-xs">Stage 7 of 7</span>
        </div>
      </div>

      {/* 7-Stage Stepper Navigation */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-400">
            Hiring Workflow
          </span>
          <Badge variant="outline" className="text-[10px] font-medium text-corporate-500">
            7 Stages
          </Badge>
        </div>

        <nav className="space-y-1">
          {stages.map((stage, index) => {
            const Icon = STAGE_ICONS[stage.id] || Layers;
            const isActive = pathname === stage.route || (stage.route.startsWith('/dashboard') && pathname === stage.route);

            return (
              <Link
                key={stage.id}
                href={stage.route}
                onClick={onClose}
                className={cn(
                  'group flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 relative',
                  isActive
                    ? 'bg-blush-50/90 text-blush-900 font-semibold shadow-sm border border-blush-200/80'
                    : 'text-corporate-700 hover:bg-corporate-50 hover:text-corporate-900'
                )}
              >
                {/* Stage number badge */}
                <div
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-blush-500 text-white shadow-sm'
                      : stage.status === 'completed' || stage.status === 'passed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stage.status === 'disqualified'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-corporate-100 text-corporate-500 group-hover:bg-corporate-200'
                  )}
                >
                  {stage.status === 'completed' || stage.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : stage.status === 'disqualified' ? (
                    <AlertCircle className="w-4 h-4 text-rose-700" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Stage text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold truncate leading-tight">
                      {stage.shortTitle}
                    </span>
                    {stage.score && (
                      <span className="text-[10px] font-bold text-blush-600 shrink-0">
                        {stage.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-corporate-400 truncate mt-0.5">
                    {stage.description}
                  </p>
                </div>

                {isActive && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <ChevronRight className="w-4 h-4 text-blush-500" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick links & help */}
      <div className="pt-4 border-t border-corporate-200/60 mt-auto">
        <div className="rounded-xl bg-corporate-50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-corporate-800">
            <Layers className="w-4 h-4 text-blush-500" />
            <span>Auth & Onboarding</span>
          </div>
          <p className="text-[11px] text-corporate-500 leading-normal">
            Need to view the public onboarding screens?
          </p>
          <div className="flex gap-2 pt-1">
            <Link
              href="/login"
              onClick={onClose}
              className="text-[11px] font-semibold text-blush-600 hover:text-blush-700 hover:underline"
            >
              Sign In View →
            </Link>
            <span className="text-corporate-300">•</span>
            <Link
              href="/register"
              onClick={onClose}
              className="text-[11px] font-semibold text-blush-600 hover:text-blush-700 hover:underline"
            >
              Register View →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}


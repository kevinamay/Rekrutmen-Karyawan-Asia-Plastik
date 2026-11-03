'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Bell,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  RotateCcw,
  UserCheck,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const { candidate, resetAllDemoData, setFinalDecision, setCVOutcome } = useRecruitment();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-corporate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left: Mobile trigger & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-corporate-600 hover:text-corporate-900 rounded-lg hover:bg-corporate-100"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/dashboard/status" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blush-500 to-blush-400 text-white shadow-sm shadow-blush-200 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-corporate-900 text-base leading-tight flex items-center gap-1.5">
                NexaRecruit <span className="text-blush-500 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-corporate-400 tracking-wider">
                Enterprise Talent Engine
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-corporate-200">
            <Badge variant="blush" className="text-[11px] font-medium py-0.5">
              <Briefcase className="w-3 h-3 text-blush-500 mr-1" />
              Req #842: {candidate.appliedRole}
            </Badge>
            <span className="text-xs text-corporate-400">•</span>
            <span className="text-xs text-corporate-500 font-medium">Department: {candidate.appliedDepartment}</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo state switcher */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="text-xs font-semibold gap-1.5 border-blush-200 text-blush-700 bg-blush-50/50 hover:bg-blush-100/70"
            >
              <Sparkles className="w-3.5 h-3.5 text-blush-500" />
              <span className="hidden sm:inline">Scenario Switcher</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-3 shadow-xl border border-corporate-200 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold uppercase tracking-wider text-corporate-400 px-2 py-1">
                  Preview Final Scenarios
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      setFinalDecision('hired');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-emerald-800 flex items-center justify-between"
                  >
                    <span>Status: Hired / Offer</span>
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  </button>
                  <button
                    onClick={() => {
                      setFinalDecision('practical_required');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-amber-50 text-amber-800 flex items-center justify-between"
                  >
                    <span>Status: Practical Test Needed</span>
                    <Badge variant="warning" className="text-[10px]">Action</Badge>
                  </button>
                  <button
                    onClick={() => {
                      setFinalDecision('rejected');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-rose-50 text-rose-800 flex items-center justify-between"
                  >
                    <span>Status: Disqualified</span>
                    <Badge variant="danger" className="text-[10px]">Feedback</Badge>
                  </button>
                  <div className="border-t border-corporate-100 my-1 pt-1">
                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setShowDemoMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-corporate-100 text-corporate-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-corporate-500 hover:text-corporate-900 rounded-xl hover:bg-corporate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blush-500 ring-2 ring-white animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl border border-corporate-200 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-corporate-100">
                  <span className="text-xs font-bold text-corporate-900">Application Updates</span>
                  <Badge variant="blush" className="text-[10px]">2 New</Badge>
                </div>
                <div className="divide-y divide-corporate-100 mt-1 max-h-64 overflow-y-auto">
                  <div className="p-2.5 text-xs hover:bg-blush-50/50 rounded-lg">
                    <p className="font-semibold text-corporate-800">AI CV Screening Finished</p>
                    <p className="text-[11px] text-corporate-500 mt-0.5">Scored 94% Skills Fit. Invited to Competency Assessment.</p>
                    <span className="text-[10px] text-corporate-400 mt-1 block">15 mins ago</span>
                  </div>
                  <div className="p-2.5 text-xs hover:bg-blush-50/50 rounded-lg">
                    <p className="font-semibold text-corporate-800">AI Recruiter Feedback</p>
                    <p className="text-[11px] text-corporate-500 mt-0.5">High proficiency in Next.js Server Components verified.</p>
                    <span className="text-[10px] text-corporate-400 mt-1 block">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Candidate avatar & profile */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 pl-2 hover:opacity-85 transition-opacity"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-blush-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-corporate-900 leading-tight">
                {candidate.fullName}
              </span>
              <span className="text-[10px] text-corporate-500 font-medium">Candidate</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}


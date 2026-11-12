'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardCheck,
  Briefcase,
  Clock,
  LogOut,
  X,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({ mobileOpen, onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    isProfileCompleted,
    isDocsCompleted,
    isDocsUnlocked,
    isPsychologyUnlocked,
    isPsychologyCompleted,
    psychologyPassed,
    isSkillTestUnlocked,
    isSkillTestCompleted,
    competencyPassed,
  } = useRecruitment();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateEmail, setCandidateEmail] = useState(candidate.email || '');

  useEffect(() => {
    if (candidate.fullName) setCandidateName(candidate.fullName);
    if (candidate.email) setCandidateEmail(candidate.email);
  }, [candidate.fullName, candidate.email]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.displayName) setCandidateName(user.displayName);
        if (user.email) setCandidateEmail(user.email);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const realName = data.fullName || user.displayName || 'Pelamar';
            const realEmail = data.email || user.email || '';
            setCandidateName(realName);
            setCandidateEmail(realEmail);
            updateCandidate({
              fullName: realName,
              email: realEmail,
              phone: data.phone || candidate.phone || '',
            });
          }
        } catch (err) {
          console.error('Error fetching candidate in sidebar:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [candidate.phone, updateCandidate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    router.push('/login');
  };

  const navLinks = [
    {
      name: 'Beranda Pelamar',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
      locked: false,
      completed: Boolean(candidate.appliedRole),
      badge: null,
    },
    {
      name: 'Biodata Diri',
      href: '/dashboard/profile',
      icon: User,
      active: pathname === '/dashboard/profile',
      locked: false,
      completed: isProfileCompleted,
      badge: isProfileCompleted ? 'Selesai' : 'Tahap 2',
    },
    {
      name: 'Berkas & CV',
      href: '/dashboard/screening',
      icon: FileText,
      active: pathname === '/dashboard/screening',
      locked: !isDocsUnlocked,
      completed: isDocsCompleted,
      badge: !isDocsUnlocked ? 'Terkunci' : isDocsCompleted ? 'Lengkap' : 'Tahap 3',
    },
    {
      name: 'Psikotes Online',
      href: '/dashboard/competency-test',
      icon: ClipboardCheck,
      active: pathname === '/dashboard/competency-test',
      locked: !isPsychologyUnlocked,
      completed: isPsychologyCompleted && Boolean(psychologyPassed),
      badge: !isPsychologyUnlocked ? 'Terkunci' : (isPsychologyCompleted && Boolean(psychologyPassed)) ? 'Lulus' : 'Tahap 4',
    },
    {
      name: 'Tes Keahlian Teknis',
      href: '/dashboard/skill-test',
      icon: Briefcase,
      active: pathname === '/dashboard/skill-test',
      locked: !isSkillTestUnlocked,
      completed: isSkillTestCompleted && Boolean(competencyPassed),
      badge: !isSkillTestUnlocked ? 'Terkunci' : (isSkillTestCompleted && Boolean(competencyPassed)) ? 'Lulus' : 'Tahap 5',
    },
    {
      name: 'Status Lamaran',
      href: '/dashboard/status',
      icon: Clock,
      active: pathname === '/dashboard/status',
      locked: false,
      completed: false,
      badge: 'Live',
    },
  ];

  const initialLetter = candidateName && candidateName !== 'Pelamar'
    ? candidateName.charAt(0).toUpperCase()
    : 'P';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sleek Dark Navy Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/images/logos/logo.webp"
                  alt="CV. Asia Plastik"
                  width={130}
                  height={42}
                  priority
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase mt-2">
                Portal Karir Karyawan
              </p>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    link.active
                      ? 'font-bold bg-sky-600 text-white shadow-sm'
                      : link.locked
                      ? 'font-medium text-slate-500 hover:text-slate-400 hover:bg-slate-850/40 opacity-80'
                      : 'font-medium text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      link.active
                        ? 'text-sky-200'
                        : link.locked
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{link.name}</span>

                  {/* Stage Status / Locked Badges */}
                  {link.locked ? (
                    <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-amber-400/90 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Kunci</span>
                    </span>
                  ) : link.completed ? (
                    <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : link.badge ? (
                    <span className="ml-auto text-[9px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded shrink-0">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initialLetter}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">{candidateName}</span>
              <span className="text-[10px] text-slate-400 block truncate">{candidateEmail || 'Kandidat Pelamar'}</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}

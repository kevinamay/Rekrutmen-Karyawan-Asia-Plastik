'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardCheck,
  Clock,
  LogOut,
  Phone,
  Menu,
  X,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  Mail,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Sparkles,
  Download,
  Lock,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';
import { buildDynamicStages, CANDIDATE_METRICS } from './mockStatusData';

export default function StatusDecisionDashboardPage() {
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    profileCompleted,
    uploadedDocs,
    psychologyScore,
    psychologyPassed,
    psychologyCompletedAt,
    competencyScore,
    competencyPassed,
    competencyCompletedAt,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateEmail, setCandidateEmail] = useState(candidate.email || '');
  const [candidatePhone, setCandidatePhone] = useState(candidate.phone || '');
  const [expandedStage, setExpandedStage] = useState<number>(1);

  // Sync candidate details
  useEffect(() => {
    if (candidate.fullName) setCandidateName(candidate.fullName);
    if (candidate.email) setCandidateEmail(candidate.email);
    if (candidate.phone) setCandidatePhone(candidate.phone);
  }, [candidate.fullName, candidate.email, candidate.phone]);

  // Sync Auth and Firestore Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.displayName) setCandidateName(user.displayName);
        if (user.email) setCandidateEmail(user.email);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.fullName) setCandidateName(data.fullName);
            if (data.email) setCandidateEmail(data.email);
            if (data.phone) setCandidatePhone(data.phone);
            updateCandidate({
              fullName: data.fullName || user.displayName || 'Pelamar',
              email: data.email || user.email || '',
              phone: data.phone || '',
            });
          }
        } catch (err) {
          console.error('Error fetching candidate data in status:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [updateCandidate]);

  const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
  const uploadedCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;

  const stages = buildDynamicStages({
    candidateName,
    candidateEmail,
    profileCompleted,
    uploadedCount,
    requiredDocsCount: requiredDocs.length,
    psychologyScore,
    psychologyPassed,
    psychologyCompletedAt,
    competencyScore,
    competencyPassed,
    competencyCompletedAt,
    appliedRole: candidate.appliedRole,
  });

  // Calculate dynamic progress
  const completedStagesCount = stages.filter((s) => s.status === 'completed').length;
  const currentActiveStage = stages.find((s) => s.status === 'in_progress') || stages[0];
  const progressPercent = Math.round((completedStagesCount / stages.length) * 100);

  // Default expand active stage
  useEffect(() => {
    if (currentActiveStage) {
      setExpandedStage(currentActiveStage.stageNumber);
    }
  }, [currentActiveStage]);

  const toggleExpand = (stageNum: number) => {
    setExpandedStage((prev) => (prev === stageNum ? 0 : stageNum));
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={openMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-sky-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 hidden sm:inline">Portal Rekrutmen</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900">Status & Perjalanan Seleksi</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Tahap Aktif: {currentActiveStage.title}</span>
          </span>
          <a
            href="https://wa.me/6282244109503"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bantuan HRD</span>
            <span className="sm:hidden">HRD</span>
          </a>
        </div>
      </header>

      {/* Viewport Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Status Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    Tahap {currentActiveStage.stageNumber} Aktif • {currentActiveStage.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">CV. Asia Plastik</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Supervisor Quality Control (QC)
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {competencyPassed
                    ? `Selamat ${candidateName}, berkas lamaran dan lembar ujian kompetensi teknis QC Anda telah dinyatakan LOLOS dengan skor ${competencyScore}%. Tahap seleksi berikutnya adalah wawancara langsung bersama Tim Manajemen Pabrik.`
                    : `Halo ${candidateName}, proses seleksi Anda saat ini berada pada tahap ${currentActiveStage.stageNumber}: ${currentActiveStage.title}. Pantau dan lengkapi tahapan seleksi secara berkala.`}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3 shrink-0 lg:w-72">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-slate-300">Progres Seleksi:</span>
                  <span className="font-bold text-sky-400">
                    {progressPercent}% ({completedStagesCount} dari {stages.length} Tahap)
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="pt-1 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Status Terkini:</span>
                  <span className="text-emerald-400 font-semibold">{currentActiveStage.subtitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Vertical Timeline (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Perjalanan Seleksi & Milestone Tahapan
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rekapitulasi riwayat evaluasi dan jadwal tahap rekrutmen CV. Asia Plastik.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    Pabrik Sidoarjo
                  </span>
                </div>

                {/* Vertical Stepper List */}
                <div className="relative pl-6 space-y-8 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {stages.map((stage) => {
                    const isCompleted = stage.status === 'completed';
                    const isInProgress = stage.status === 'in_progress';
                    const isUpcoming = stage.status === 'upcoming';
                    const isExpanded = expandedStage === stage.stageNumber;

                    return (
                      <div key={stage.id} className="relative group">
                        {/* Stepper Dot */}
                        <div
                          className={`absolute -left-6 top-1.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                              : isInProgress
                              ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                              : 'bg-slate-100 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isInProgress ? (
                            <span>{stage.stageNumber}</span>
                          ) : (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>

                        {/* Stage Card Content */}
                        <div
                          className={`ml-5 rounded-2xl border transition-all ${
                            isInProgress
                              ? 'bg-sky-50/50 border-sky-300 shadow-sm'
                              : isCompleted
                              ? 'bg-white border-slate-200 hover:border-slate-300'
                              : 'bg-slate-50/60 border-slate-200/80 opacity-75'
                          }`}
                        >
                          {/* Card Header */}
                          <div
                            onClick={() => toggleExpand(stage.stageNumber)}
                            className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded text-slate-500 bg-slate-100 border border-slate-200">
                                  Tahap {stage.stageNumber}
                                </span>
                                {isCompleted && (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Selesai / Lolos
                                  </span>
                                )}
                                {isInProgress && (
                                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-ping inline-block" />
                                    Sedang Berjalan
                                  </span>
                                )}
                                {isUpcoming && (
                                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    Tahap Berikutnya
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                {stage.title}
                              </h3>
                              <p className="text-xs text-slate-500">{stage.subtitle}</p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {stage.score !== undefined && (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                                  Skor: {stage.score}%
                                </span>
                              )}
                              <button
                                type="button"
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details Body */}
                          {isExpanded && (
                            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 space-y-3 text-xs animate-in fade-in duration-150">
                              <p className="text-slate-600 leading-relaxed">{stage.summary}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-600">
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                                    Tanggal / Jadwal
                                  </span>
                                  <span className="font-semibold text-slate-800">{stage.date}</span>
                                </div>

                                {stage.evaluator && (
                                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                                      Tim Penguji / Verifikator
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                      {stage.evaluator}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {stage.notes && (
                                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                                  <strong>Catatan:</strong> {stage.notes}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Jadwal Wawancara & HR PIC (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Interview Schedule Box */}
              {competencyPassed ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Jadwal Wawancara Tatap Muka
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
                    <span className="text-[10px] font-bold text-sky-700 uppercase block">
                      Hari & Waktu Pelaksanaan
                    </span>
                    <strong className="text-slate-900 text-sm block">
                      {CANDIDATE_METRICS.interviewSchedule.date}
                    </strong>
                    <span className="text-xs text-slate-600 font-mono">
                      {CANDIDATE_METRICS.interviewSchedule.time}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 text-[10px] block">Lokasi Pelaksanaan:</span>
                    <strong className="text-slate-800 block leading-snug">
                      {CANDIDATE_METRICS.interviewSchedule.location}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {CANDIDATE_METRICS.interviewSchedule.room}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs pt-1">
                    <span className="text-slate-400 text-[10px] block">Dokumen Fisik Wajib Dibawa:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                      {CANDIDATE_METRICS.interviewSchedule.bringItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="https://wa.me/6282244109503?text=Halo%20HRD%20CV.%20Asia%20Plastik,%20saya%20konfirmasi%20kehadiran%20wawancara%20tatap%20muka"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center block"
                  >
                    Konfirmasi Kehadiran Wawancara
                  </a>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Jadwal Wawancara Tatap Muka
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Jadwal wawancara akan diterbitkan secara otomatis setelah Anda menyelesaikan pengisian
                    biodata, verifikasi berkas, dan dinyatakan lulus ujian kompetensi teknis QC.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={!profileCompleted ? '/dashboard/profile' : uploadedCount < requiredDocs.length ? '/dashboard/screening' : '/dashboard/competency-test'}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center block"
                    >
                      <span>Lanjutkan Tahap Seleksi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* PIC Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-800">PIC Seleksi & HR Rekrutmen</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    RD
                  </div>
                  <div>
                    <strong className="text-xs text-slate-900 block">
                      {CANDIDATE_METRICS.interviewSchedule.contactPIC.name}
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      {CANDIDATE_METRICS.interviewSchedule.contactPIC.role}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">WhatsApp:</span>
                    <a
                      href="https://wa.me/6282244109503"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sky-600 hover:underline"
                    >
                      {CANDIDATE_METRICS.interviewSchedule.contactPIC.whatsapp}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-[11px] text-slate-700">
                      {CANDIDATE_METRICS.interviewSchedule.contactPIC.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

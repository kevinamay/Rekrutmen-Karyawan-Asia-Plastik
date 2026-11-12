'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Building2,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Phone,
  Menu,
  X,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';
import { JobOpening, JOB_VACANCIES } from '@/data/jobVacancies';

export default function DashboardPage() {
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    profileCompleted,
    uploadedDocs,
    competencyScore,
    competencyPassed,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJobModal, setActiveJobModal] = useState<JobOpening | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Candidate Data State
  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateEmail, setCandidateEmail] = useState(candidate.email || '');
  const [candidatePhone, setCandidatePhone] = useState(candidate.phone || '');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);
  const [currentAppliedRole, setCurrentAppliedRole] = useState<string>(candidate.appliedRole || '');

  // Sync with context
  useEffect(() => {
    if (candidate.fullName) setCandidateName(candidate.fullName);
    if (candidate.email) setCandidateEmail(candidate.email);
    if (candidate.phone) setCandidatePhone(candidate.phone);
    if (candidate.appliedRole) setCurrentAppliedRole(candidate.appliedRole);
  }, [candidate.fullName, candidate.email, candidate.phone, candidate.appliedRole]);

  // Sync with Firebase Auth and Firestore document
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) setCandidateName(user.displayName);
        if (user.email) setCandidateEmail(user.email);

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const realName = data.fullName || user.displayName || 'Pelamar';
            const realEmail = data.email || user.email || '';
            const realPhone = data.phone || '';
            const role = data.appliedRole || '';

            setCandidateName(realName);
            setCandidateEmail(realEmail);
            setCandidatePhone(realPhone);
            if (role) setCurrentAppliedRole(role);

            updateCandidate({
              fullName: realName,
              email: realEmail,
              phone: realPhone,
              appliedRole: role || candidate.appliedRole,
            });
          }
        } catch (err) {
          console.error('Error fetching candidate profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [updateCandidate, candidate.appliedRole]);

  const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
  const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;
  const docsDone = requiredDocs.length > 0 && uploadedRequiredCount >= requiredDocs.length;
  const examDone = competencyScore !== null;

  // Categories list
  const categories = [
    'Semua',
    'Quality & Teknik',
    'Operasional & Sales',
    'Finance & Pajak',
    'Legal & K3',
    'Magang',
  ];

  // Filter jobs based on category and search query
  const filteredJobs = useMemo(() => {
    return JOB_VACANCIES.filter((job) => {
      const matchesCategory =
        selectedCategory === 'Semua' || job.category === selectedCategory;
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle applying for a job
  const handleApplyJob = async (job: JobOpening) => {
    setApplyingJobId(job.id);
    const appliedDateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Update Context
    updateCandidate({
      appliedRole: job.title,
      appliedDepartment: job.department,
      appliedDate: appliedDateStr,
    });
    setCurrentAppliedRole(job.title);

    // Persist to Firestore if user is authenticated
    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            appliedRole: job.title,
            appliedDepartment: job.department,
            appliedDate: appliedDateStr,
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving applied role to Firestore:', err);
      }
    }

    setApplyingJobId(null);
    setActiveJobModal(null);
    setAppliedNotice(`Anda telah memilih posisi "${job.title}". Melanjutkan ke pengisian berkas & biodata...`);

    setTimeout(() => {
      if (!profileCompleted) {
        router.push('/dashboard/profile');
      } else if (!docsDone) {
        router.push('/dashboard/screening');
      } else {
        router.push('/dashboard/competency-test');
      }
    }, 1200);
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
            <span className="text-slate-400 hidden sm:inline">Portal Rekrutmen</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900">Dashboard Utama Pelamar</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Akun Aktif</span>
          </span>
          <a
            href="https://wa.me/6282244109503"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shadow-sky-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bantuan HRD</span>
            <span className="sm:hidden">HRD</span>
          </a>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Applied Role Notification */}
        {appliedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Priority Task Alert Banner (If already selected a position) */}
        {currentAppliedRole && (
          <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-sky-600/15">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Lamaran Terpilih: {currentAppliedRole}
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                {!profileCompleted
                  ? 'Lengkapi Biodata Diri Resmi Anda'
                  : !docsDone
                  ? 'Unggah Berkas Persyaratan Pelamar'
                  : !examDone
                  ? 'Kerjakan Ujian Kompetensi Teknis'
                  : 'Pantau Jadwal Wawancara Tatap Muka'}
              </h2>
              <p className="text-xs text-sky-100 max-w-xl">
                {!profileCompleted
                  ? 'Pemeriksaan berkas tahap berikutnya akan dimulai setelah formulir biodata diri terisi lengkap.'
                  : !docsDone
                  ? `Tersimpan ${uploadedRequiredCount} dari ${requiredDocs.length} berkas wajib. Lengkapi berkas untuk melanjutkan ke ujian teknis.`
                  : !examDone
                  ? 'Ujian teknis online berdurasi 30 menit mengenai parameter kompetensi industri plastik.'
                  : 'Undangan resmi wawancara tatap muka telah diterbitkan bersama Tim Manajemen Pabrik.'}
              </p>
            </div>
            <Link
              href={
                !profileCompleted
                  ? '/dashboard/profile'
                  : !docsDone
                  ? '/dashboard/screening'
                  : !examDone
                  ? '/dashboard/competency-test'
                  : '/dashboard/status'
              }
              className="px-4 py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs hover:bg-sky-50 shrink-0 self-start sm:self-center transition-all hover:scale-[1.02] shadow-sm flex items-center gap-1.5"
            >
              <span>Lanjutkan Tahapan Seleksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ========================================================
            OPEN VACANCIES SECTION (Pengganti Tab Dummy Sesuai Gambar 2)
            ======================================================== */}
        <div className="space-y-6">
          {/* Filter & Search Bar Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama lowongan, keahlian, atau departemen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Counter Indicator */}
              <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-semibold text-slate-600 shrink-0">
                <span>
                  Menampilkan{' '}
                  <strong className="text-slate-900">{filteredJobs.length}</strong> dari{' '}
                  {JOB_VACANCIES.length} lowongan
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sky-600 hover:text-sky-700 underline text-xs"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> KATEGORI:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/80 hover:border-sky-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Grid of Job Cards */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const isSelected = currentAppliedRole === job.title;

                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
                      isSelected ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          {job.department}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          {job.type}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Posisi Terpilih</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
                        {job.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {/* Key Job Meta */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="truncate">{job.education}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Batas Lamar: {job.deadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveJobModal(job)}
                        className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        Lihat Detail
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyJob(job)}
                        disabled={applyingJobId === job.id}
                        className={`flex-1 text-center py-2 px-3 rounded-xl text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-sky-600 hover:bg-sky-700'
                        }`}
                      >
                        {applyingJobId === job.id ? (
                          <span>Memproses...</span>
                        ) : isSelected ? (
                          <>
                            <span>Lanjutkan</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Apply Now</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tidak ada lowongan yang sesuai</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian Anda atau pilih kategori lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-sky-600 hover:underline pt-2 inline-block"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          JOB DETAIL MODAL
          ======================================================== */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60">
                    {activeJobModal.department}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeJobModal.type}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activeJobModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveJobModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400">Penempatan:</span>
                  <strong className="text-slate-800">{activeJobModal.location}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400">Pendidikan:</span>
                  <strong className="text-slate-800">{activeJobModal.education}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400">Batas Lamar:</span>
                  <strong className="text-slate-800">{activeJobModal.deadline}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Deskripsi Pekerjaan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeJobModal.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Persyaratan Kualifikasi</h4>
              <ul className="space-y-2">
                {activeJobModal.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveJobModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleApplyJob(activeJobModal)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Lamar Posisi Ini</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

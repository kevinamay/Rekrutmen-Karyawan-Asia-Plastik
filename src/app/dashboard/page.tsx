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
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  Phone,
  Menu,
  X,
  ExternalLink,
  Calendar,
  AlertCircle,
  Building2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';

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

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'tugas' | 'jadwal'>('ringkasan');

  // Candidate Data State: clean without hardcoded dummy defaults
  const [candidateName, setCandidateName] = useState(candidate.fullName || 'Pelamar');
  const [candidateEmail, setCandidateEmail] = useState(candidate.email || '');
  const [candidatePhone, setCandidatePhone] = useState(candidate.phone || '');
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  // Sync with context
  useEffect(() => {
    if (candidate.fullName) setCandidateName(candidate.fullName);
    if (candidate.email) setCandidateEmail(candidate.email);
    if (candidate.phone) setCandidatePhone(candidate.phone);
  }, [candidate.fullName, candidate.email, candidate.phone]);

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

            setCandidateName(realName);
            setCandidateEmail(realEmail);
            setCandidatePhone(realPhone);

            updateCandidate({
              fullName: realName,
              email: realEmail,
              phone: realPhone,
            });
          }
        } catch (err) {
          console.error('Error fetching candidate profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [updateCandidate]);

  const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
  const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;
  const docsDone = requiredDocs.length > 0 && uploadedRequiredCount >= requiredDocs.length;
  const examDone = competencyScore !== null;

  // Real progress calculation
  let progressPct = 15; // registered
  let activeStageTitle = 'Tahap 2: Pengisian Biodata Diri';

  if (profileCompleted) {
    progressPct = 35;
    activeStageTitle = 'Tahap 3: Unggah Berkas & CV';
  }
  if (profileCompleted && docsDone) {
    progressPct = 60;
    activeStageTitle = 'Tahap 4: Ujian Kompetensi Teknis';
  }
  if (profileCompleted && docsDone && examDone) {
    if (competencyPassed) {
      progressPct = 75;
      activeStageTitle = 'Tahap 5: Wawancara Tatap Muka Terjadwal';
    } else {
      progressPct = 60;
      activeStageTitle = 'Tahap 4: Ujian Selesai Dievaluasi';
    }
  }

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
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Priority Task Alert Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-sky-600/15">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Tindakan Diperlukan
            </span>
            <h2 className="text-base sm:text-lg font-bold">
              {!profileCompleted
                ? 'Lengkapi Biodata Diri Resmi Anda'
                : !docsDone
                ? 'Unggah Berkas Persyaratan Pelamar'
                : !examDone
                ? 'Kerjakan Ujian Kompetensi Teknis QC'
                : 'Pantau Jadwal Wawancara Tatap Muka'}
            </h2>
            <p className="text-xs text-sky-100 max-w-xl">
              {!profileCompleted
                ? 'Pemeriksaan berkas tahap berikutnya akan dimulai setelah formulir biodata diri terisi lengkap.'
                : !docsDone
                ? `Tersimpan ${uploadedRequiredCount} dari ${requiredDocs.length} berkas wajib. Lengkapi berkas untuk melanjutkan ke ujian teknis.`
                : !examDone
                ? 'Ujian teknis online berdurasi 30 menit mengenai parameter kendali mutu injeksi plastik.'
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
            <span>Buka Halaman</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'ringkasan'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Ringkasan Lamaran
          </button>
          <button
            onClick={() => setActiveTab('tugas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'tugas'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Daftar Tugas Pelamar
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'jadwal'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Jadwal Seleksi Pabrik
          </button>
        </div>

        {/* Tab 1: Ringkasan */}
        {activeTab === 'ringkasan' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Posisi Dilamar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    Posisi Lowongan Kerja
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                    CV. Asia Plastik
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Supervisor Quality Control (QC)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bertanggung jawab memimpin pengujian bahan biji plastik, pengawasan mutu proses injeksi & ekstrusi, serta memastikan standar ISO 9001:2015 di Pabrik Utama Sidoarjo.
                </p>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Departemen:</span>
                    <strong className="text-slate-800">Quality Assurance & Control</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lokasi Penempatan:</span>
                    <strong className="text-slate-800">Pabrik Sidoarjo / Surabaya</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tipe Pekerjaan:</span>
                    <strong className="text-slate-800">Karyawan Tetap (Full Time)</strong>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Progres Seleksi Terkini</h4>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    {activeStageTitle}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. Pendaftaran</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${profileCompleted ? 'text-emerald-600 font-semibold' : 'text-sky-700 font-bold'}`}>
                    {profileCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>2. Biodata</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${docsDone ? 'text-emerald-600 font-semibold' : profileCompleted ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                    {docsDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>3. Berkas</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${examDone ? (competencyPassed ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold') : docsDone ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                    {examDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>4. Ujian Teknis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Info Pelamar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Informasi Akun Pelamar
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Lengkap</span>
                    <strong className="text-slate-800 text-sm font-semibold">{candidateName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Terdaftar</span>
                    <strong className="text-slate-800 break-all">{candidateEmail || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. WhatsApp</span>
                    <strong className="text-slate-800">{candidatePhone || '-'}</strong>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors block text-center mt-3"
                >
                  <span>Perbarui Data Akun</span>
                </Link>
              </div>

              {/* Perusahaan Info Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CV. Asia Plastik Sidoarjo</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Industri manufaktur plastik bersertifikasi ISO 9001:2015. Seluruh tahapan seleksi rekrutmen ini bersifat gratis dan transparan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tugas Pelamar */}
        {activeTab === 'tugas' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Checklist Tugas Seleksi Anda</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Registrasi Akun Resmi Pelamar</h5>
                    <p className="text-[11px] text-slate-500">Terverifikasi pada sistem rekrutmen CV. Asia Plastik</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 shrink-0">Selesai</span>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${profileCompleted ? 'border-emerald-200 bg-emerald-50/40' : 'border-sky-300 bg-sky-50/40'}`}>
                <div className="flex items-center gap-3">
                  {profileCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-sky-600 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Pengisian Formulir Riwayat Kerja & Pendidikan</h5>
                    <p className="text-[11px] text-slate-500">Wajib diisi sesuai KTP & ijazah asli</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 ${profileCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-600 text-white shadow-sm hover:bg-sky-700'}`}
                >
                  {profileCompleted ? 'Tersimpan (Ubah)' : 'Buka Formulir'}
                </Link>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${docsDone ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  {docsDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Unggah Dokumen Berkas (CV, KTP, Ijazah, SKCK, Foto)</h5>
                    <p className="text-[11px] text-slate-500">
                      {uploadedRequiredCount} dari {requiredDocs.length} berkas wajib terunggah
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/screening"
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0"
                >
                  {docsDone ? 'Kelola Berkas' : 'Unggah'}
                </Link>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${examDone ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  {examDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <ClipboardCheck className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Ujian Kompetensi Teknis QC Manufaktur</h5>
                    <p className="text-[11px] text-slate-500">
                      {examDone ? `Nilai: ${competencyScore}% (Selesai)` : 'Ujian online 5 butir soal waktu 30 menit'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/competency-test"
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0"
                >
                  {examDone ? 'Tinjau Hasil' : 'Mulai Ujian'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Jadwal */}
        {activeTab === 'jadwal' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Agenda Jadwal Rekrutmen Pabrik</h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-sm">Seleksi Administrasi & Verifikasi Dokumen</strong>
                  <span className="text-slate-500">12 Februari — 28 Februari 2027</span>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
                  Sedang Berlangsung
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between opacity-80">
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-sm">Tes Kemampuan Teknis & Pengetahuan Mutu Plastik</strong>
                  <span className="text-slate-500">01 Maret — 03 Maret 2027</span>
                </div>
                <span className="text-xs text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md">
                  Mendatang
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between opacity-75">
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-sm">Wawancara User & HRD Onsite di Pabrik Sidoarjo</strong>
                  <span className="text-slate-500">05 Maret — 08 Maret 2027</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  Mendatang
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  ShieldCheck,
  Save,
  Sparkles,
  Lock,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  useRecruitment,
  UploadedDocItem,
  DEFAULT_REQUIRED_DOCS,
  isCandidateProfileComplete,
} from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';

const DOCS_STORAGE_KEY = 'asiaplastik_uploaded_docs';

export default function CVScreeningPage() {
  const router = useRouter();
  const {
    candidate,
    updateCandidate,
    uploadedDocs,
    setUploadedDocs,
    isProfileCompleted,
    isDocsCompleted,
    isDocsUnlocked,
  } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [dragActive, setDragActive] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [candidateUid, setCandidateUid] = useState<string | null>(null);
  const globalFileInputRef = useRef<HTMLInputElement | null>(null);

  const [docList, setDocList] = useState<UploadedDocItem[]>(uploadedDocs || DEFAULT_REQUIRED_DOCS);

  // Sync with localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DOCS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocList(parsed);
          setUploadedDocs(parsed);
        }
      }
    } catch (e) {}
  }, [setUploadedDocs]);

  // Sync with Firebase Auth and Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.uploadedDocs && Array.isArray(data.uploadedDocs)) {
              setDocList(data.uploadedDocs);
              setUploadedDocs(data.uploadedDocs);
              try {
                localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(data.uploadedDocs));
              } catch (e) {}
            }
          }
        } catch (err) {
          console.error('Error fetching candidate doc in screening:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [setUploadedDocs]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const updateAndPersistDocs = async (newList: UploadedDocItem[]) => {
    setDocList(newList);
    setUploadedDocs(newList);
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {}

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          { uploadedDocs: newList, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('Error syncing uploaded docs to Firestore:', err);
      }
    }
  };

  const processFile = async (file: File, targetId?: string) => {
    setErrorMessage(null);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`Ukuran file "${file.name}" melebihi batas 10 MB.`);
      return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let assignedId = targetId;

    // If no target ID provided (from global dropzone), smartly match by file name or first empty slot
    if (!assignedId) {
      const lower = file.name.toLowerCase();
      if (lower.includes('cv') || lower.includes('resume')) {
        assignedId = 'cv';
      } else if (lower.includes('ktp')) {
        assignedId = 'ktp';
      } else if (lower.includes('ijazah') || lower.includes('transkrip')) {
        assignedId = 'ijazah';
      } else if (lower.includes('foto') || lower.includes('pasfoto')) {
        assignedId = 'foto';
      } else if (lower.includes('skck')) {
        assignedId = 'skck';
      } else if (lower.includes('k3') || lower.includes('sertifikat')) {
        assignedId = 'k3';
      } else {
        const firstEmpty = docList.find((d) => !d.fileName);
        assignedId = firstEmpty ? firstEmpty.id : 'cv';
      }
    }

    const updated = docList.map((d) => {
      if (d.id === assignedId) {
        return {
          ...d,
          fileName: file.name,
          size: formatFileSize(file.size),
          verified: true,
          updatedAt: todayStr,
        };
      }
      return d;
    });

    await updateAndPersistDocs(updated);
    setSubmittedNotice(`File "${file.name}" berhasil diunggah.`);
    setTimeout(() => setSubmittedNotice(null), 4000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      for (const file of files) {
        await processFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, id);
    }
    // reset input so uploading same file again still fires change
    e.target.value = '';
  };

  const handleGlobalFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => processFile(file));
    }
    e.target.value = '';
  };

  const handleRowDelete = async (id: string) => {
    const updated = docList.map((d) =>
      d.id === id
        ? {
            ...d,
            fileName: null,
            size: null,
            verified: false,
            updatedAt: '-',
          }
        : d
    );
    await updateAndPersistDocs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const requiredDocs = docList.filter((d) => d.type === 'Wajib');
    const missingDocs = requiredDocs.filter((d) => !d.fileName);

    if (missingDocs.length > 0) {
      setErrorMessage(
        `Masih ada ${missingDocs.length} berkas wajib yang belum diunggah: ${missingDocs
          .map((m) => m.name)
          .join(', ')}.`
      );
      return;
    }

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            uploadedDocs: docList,
            docsSubmittedToHRD: true,
            docsSubmittedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error submitting docs to HRD in Firestore:', err);
      }
    }

    setSubmittedNotice(
      'Seluruh dokumen berkas wajib berhasil diserahkan ke Tim HRD CV. Asia Plastik. Tahap verifikasi berkas telah diselesaikan!'
    );
    setTimeout(() => setSubmittedNotice(null), 6000);
  };

  const uploadedCount = docList.filter((d) => Boolean(d.fileName)).length;

  let actuallyCompletedProfile = Boolean(isProfileCompleted);
  if (typeof window !== 'undefined') {
    const savedProf = localStorage.getItem('asiaplastik_profile_data');
    const savedDone = localStorage.getItem('asiaplastik_profile_completed');
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        actuallyCompletedProfile = Boolean(savedDone === 'true' && isCandidateProfileComplete(parsed));
      } catch (e) {
        actuallyCompletedProfile = false;
      }
    } else {
      actuallyCompletedProfile = false;
    }
  }

  const isUnlocked = actuallyCompletedProfile;

  if (!isUnlocked) {
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
              <Link href="/dashboard" className="text-slate-400 hover:text-sky-600 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 hidden sm:inline">Portal Rekrutmen</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900">Unggah Berkas & CV</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Tahap 3 Terkunci</span>
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

        {/* Locked Hero View */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                Tahap 3 Terkunci: Prasyarat Belum Terpenuhi
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Lengkapi Formulir Biodata Diri Terlebih Dahulu
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sesuai dengan ketentuan seleksi rekrutmen terpadu CV. Asia Plastik, Anda wajib menyelesaikan pengisian <strong>Biodata Diri</strong> (Identitas KTP, Kontak & Domisili, Riwayat Pendidikan) pada <strong>Tahap 2</strong> sebelum dapat mengakses lembar verifikasi berkas dan mengunggah dokumen CV.
              </p>
            </div>

            {/* Stepper Status Visual */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Alur Tahapan Rekrutmen:
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  ✓
                </span>
                <span className="text-slate-700 font-semibold">Tahap 1: Registrasi & Pilihan Posisi Lowongan</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <span className="text-slate-900 font-bold">Tahap 2: Pengisian Biodata Diri (Perlu Dilengkapi)</span>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-60">
                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                  <Lock className="w-3 h-3" />
                </span>
                <span className="text-slate-500 font-medium">Tahap 3: Unggah Berkas & CV (Terkunci)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/profile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Isi Formulir Biodata Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
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
            <Link href="/dashboard" className="text-slate-400 hover:text-sky-600 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 hidden sm:inline">Portal Rekrutmen</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900">Unggah Berkas & CV</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-1 rounded-full border border-sky-200 hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
            <span>Tahap 3: Verifikasi Berkas Lamaran</span>
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

      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Industrial Document Vault
              </span>
              <span className="text-xs text-slate-400 font-medium">• Pusat Arsip Berkas CV. Asia Plastik</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Pusat Pengunggahan & Verifikasi Berkas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan periksa seluruh status dokumen pendaftaran karyawan dalam satu tabel operasional.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all shrink-0 self-start sm:self-center"
          >
            <Save className="w-4 h-4" />
            <span>Kirim Berkas ke HRD</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {submittedNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedNotice}</span>
          </div>
        )}

        {/* Central Unified Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-sky-400 bg-white shadow-sm'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Tarik & Lepaskan File Berkas Anda di Sini
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Mendukung format PDF, JPG, PNG, atau DOCX (Maksimal 10 MB per berkas). Sistem akan otomatis memetakan ke dokumen terkait.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => globalFileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              Pilih File Dari Komputer
            </button>
            <input
              ref={globalFileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              className="hidden"
              onChange={handleGlobalFileInput}
            />
          </div>
        </div>

        {/* Operational Document Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Daftar Dokumen Persyaratan Pelamar</h3>
            <span className="text-xs text-slate-500">
              Terisi: <strong className="text-slate-900">{uploadedCount} dari {docList.length} Dokumen</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Nama Dokumen</th>
                  <th className="py-3 px-4 font-bold">Sifat</th>
                  <th className="py-3 px-4 font-bold">File Terunggah</th>
                  <th className="py-3 px-4 font-bold">Ukuran</th>
                  <th className="py-3 px-4 font-bold">Status Verifikasi</th>
                  <th className="py-3 px-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docList.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{docItem.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          docItem.type === 'Wajib'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {docItem.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 max-w-[200px] truncate">
                      {docItem.fileName || <span className="text-slate-400 italic">Belum ada file</span>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {docItem.size || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {docItem.fileName ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terunggah ({docItem.updatedAt})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Upload</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <label className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold cursor-pointer border border-sky-200 transition-colors">
                          <span>{docItem.fileName ? 'Ganti' : 'Unggah'}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.docx"
                            className="hidden"
                            onChange={(e) => handleFileInput(e, docItem.id)}
                          />
                        </label>
                        {docItem.fileName && (
                          <button
                            onClick={() => handleRowDelete(docItem.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Stage Navigation Banner */}
        {isDocsCompleted && (
          <div className="bg-gradient-to-r from-sky-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dokumen Persyaratan Wajib Lengkap</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Tahap 4 Telah Terbuka: Sesi Wawancara Online AI
              </h4>
              <p className="text-xs text-slate-300">
                Berkas Anda telah siap. Lanjutkan ke sesi wawancara berbasis AI untuk verifikasi kompetensi dan pengalaman kerja Anda.
              </p>
            </div>
            <Link
              href="/dashboard/interview"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all shrink-0 self-start sm:self-center"
            >
              <span>Lanjut ke Tahap 4: Wawancara Online AI</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

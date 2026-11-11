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
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  ShieldCheck,
  Save,
  Sparkles,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';

export default function CVScreeningPage() {
  const router = useRouter();
  const { candidate, updateCandidate } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [dragActive, setDragActive] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  const [candidateName, setCandidateName] = useState(
    candidate.fullName || 'Kevina Maydiva Heriansaputri'
  );
  const [candidateEmail, setCandidateEmail] = useState(
    candidate.email || 'kevinamay23@gmail.com'
  );

  const [docList, setDocList] = useState([
    {
      id: 'cv',
      name: 'Curriculum Vitae (CV) Pelamar',
      type: 'Wajib',
      fileName: 'CV_Kevina_Maydiva_QC_Supervisor.pdf',
      size: '1.24 MB',
      verified: true,
      updatedAt: '11 Feb 2027',
    },
    {
      id: 'ktp',
      name: 'Scan e-KTP Asli',
      type: 'Wajib',
      fileName: 'KTP_Kevina_Maydiva.jpg',
      size: '840 KB',
      verified: true,
      updatedAt: '11 Feb 2027',
    },
    {
      id: 'ijazah',
      name: 'Scan Ijazah & Transkrip S1 ITS',
      type: 'Wajib',
      fileName: 'Ijazah_S1_ITS_Kevina.pdf',
      size: '2.40 MB',
      verified: true,
      updatedAt: '11 Feb 2027',
    },
    {
      id: 'foto',
      name: 'Pas Foto Formal 4x6 (Latar Merah)',
      type: 'Wajib',
      fileName: 'Pas_Foto_4x6_Kevina.png',
      size: '650 KB',
      verified: true,
      updatedAt: '11 Feb 2027',
    },
    {
      id: 'skck',
      name: 'Surat Catatan Kepolisian (SKCK)',
      type: 'Wajib',
      fileName: null,
      size: null,
      verified: false,
      updatedAt: '-',
    },
    {
      id: 'k3',
      name: 'Sertifikat K3 Umum Kemnaker',
      type: 'Opsional',
      fileName: 'Sertifikat_K3_Umum_Kemnaker.pdf',
      size: '1.80 MB',
      verified: true,
      updatedAt: '11 Feb 2027',
    },
  ]);

  // Sync with Firebase Auth and Firestore
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
            if (data.fullName) setCandidateName(data.fullName);
            if (data.email) setCandidateEmail(data.email);
            if (data.uploadedDocs) {
              setDocList(data.uploadedDocs);
            }
            updateCandidate({
              fullName: data.fullName || user.displayName || candidateName,
              email: data.email || user.email || candidateEmail,
            });
          }
        } catch (err) {
          console.error('Error fetching candidate doc in screening:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [candidateEmail, candidateName, updateCandidate]);

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

    const updated = docList.map((d) =>
      d.id === 'skck'
        ? {
            ...d,
            fileName: 'SKCK_Polres_Sidoarjo_Kevina.pdf',
            size: '1.15 MB',
            verified: true,
            updatedAt: 'Baru saja',
          }
        : d
    );
    setDocList(updated);

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          { uploadedDocs: updated, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('Error updating docs to Firestore:', err);
      }
    }
  };

  const handleRowUpload = async (id: string) => {
    const updated = docList.map((d) =>
      d.id === id
        ? {
            ...d,
            fileName: `${d.id.toUpperCase()}_Pelamar_Terverifikasi.pdf`,
            size: '1.20 MB',
            verified: true,
            updatedAt: 'Baru saja',
          }
        : d
    );
    setDocList(updated);

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          { uploadedDocs: updated, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('Error updating docs to Firestore:', err);
      }
    }
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
    setDocList(updated);

    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          { uploadedDocs: updated, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error('Error deleting doc in Firestore:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateUid) {
      try {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            uploadedDocs: docList,
            docsSubmittedToHRD: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error submitting docs to HRD in Firestore:', err);
      }
    }
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 5000);
  };

  const uploadedCount = docList.filter((d) => d.verified).length;

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

          {/* Success Notification */}
          {submittedNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dokumen berkas berhasil tersimpan dan siap diproses oleh Departemen HRD Pabrik Sidoarjo.</span>
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
              <label className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-sky-600/20 transition-all">
                <span>Pilih File Dari Komputer</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={() => handleRowUpload('skck')}
                />
              </label>
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
                  {docList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.type === 'Wajib'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 max-w-[200px] truncate">
                        {doc.fileName || <span className="text-slate-400 italic">Belum ada file</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {doc.size || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        {doc.verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terverifikasi</span>
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
                            <span>{doc.fileName ? 'Ganti' : 'Unggah'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={() => handleRowUpload(doc.id)}
                            />
                          </label>
                          {doc.fileName && (
                            <button
                              onClick={() => handleRowDelete(doc.id)}
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
        </main>
    </>
  );
}

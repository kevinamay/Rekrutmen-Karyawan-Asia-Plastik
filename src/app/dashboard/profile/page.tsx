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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Save,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRecruitment, isCandidateProfileComplete } from '@/context/RecruitmentContext';
import { useDashboardLayout } from '@/components/layout/DashboardLayoutContext';

const PROFILE_STORAGE_KEY = 'asiaplastik_profile_data';

export default function ProfilePage() {
  const router = useRouter();
  const { candidate, updateCandidate, saveProfileData } = useRecruitment();
  const { openMobileSidebar } = useDashboardLayout();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  // Form State initialized clean without hardcoded dummy data
  const [formData, setFormData] = useState({
    nik: '',
    fullName: candidate.fullName || '',
    pob: '',
    dob: '',
    gender: 'Laki-laki',
    religion: 'Islam',
    maritalStatus: 'Belum Menikah',
    bloodType: 'A',
    ktpAddress: '',
    currentAddress: '',
    phone: candidate.phone || '',
    email: candidate.email || '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    educationLevel: 'S1',
    schoolName: '',
    major: '',
    gradYear: '',
    gpa: '',
    lastCompany: '',
    lastPosition: '',
    jobDesc: '',
    expectedSalary: '',
    certifications: '',
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  // Sync with Firebase Auth and Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) {
          setFormData((prev) => ({ ...prev, fullName: prev.fullName || user.displayName || '' }));
        }
        if (user.email) {
          setFormData((prev) => ({ ...prev, email: prev.email || user.email || '' }));
        }

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData((prev) => ({
              ...prev,
              nik: data.nik || prev.nik,
              fullName: data.fullName || user.displayName || prev.fullName,
              phone: data.phone || prev.phone,
              email: data.email || user.email || prev.email,
              pob: data.pob || prev.pob,
              dob: data.dob || prev.dob,
              gender: data.gender || prev.gender,
              maritalStatus: data.maritalStatus || prev.maritalStatus,
              religion: data.religion || prev.religion,
              bloodType: data.bloodType || prev.bloodType,
              ktpAddress: data.ktpAddress || prev.ktpAddress,
              currentAddress: data.currentAddress || prev.currentAddress,
              emergencyName: data.emergencyName || prev.emergencyName,
              emergencyRelation: data.emergencyRelation || prev.emergencyRelation,
              emergencyPhone: data.emergencyPhone || prev.emergencyPhone,
              educationLevel: data.educationLevel || prev.educationLevel,
              schoolName: data.schoolName || prev.schoolName,
              major: data.major || prev.major,
              gradYear: data.gradYear || prev.gradYear,
              gpa: data.gpa || prev.gpa,
              lastCompany: data.lastCompany || prev.lastCompany,
              lastPosition: data.lastPosition || prev.lastPosition,
              jobDesc: data.jobDesc || prev.jobDesc,
              expectedSalary: data.expectedSalary || prev.expectedSalary,
              certifications: data.certifications || prev.certifications,
            }));

            updateCandidate({
              fullName: data.fullName || user.displayName || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
            });
          }
        } catch (err) {
          console.error('Error fetching candidate doc in profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [updateCandidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    setSaveNotice(null);
    setErrorMessage(null);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const validateStep = (step: number): string | null => {
    if (step === 1) {
      if (!formData.nik || formData.nik.trim().length < 16) {
        return 'Nomor Induk Kependudukan (NIK) wajib 16 digit angka sesuai e-KTP.';
      }
      if (!formData.fullName || formData.fullName.trim().length === 0) {
        return 'Nama lengkap sesuai KTP wajib diisi.';
      }
      if (!formData.dob || formData.dob.trim().length === 0) {
        return 'Tanggal lahir wajib diisi.';
      }
      if (!formData.pob || formData.pob.trim().length === 0) {
        return 'Tempat / kota kelahiran wajib diisi.';
      }
    } else if (step === 2) {
      if (!formData.phone || formData.phone.trim().length < 9) {
        return 'Nomor WhatsApp aktif wajib diisi.';
      }
      if (!formData.ktpAddress || formData.ktpAddress.trim().length < 5) {
        return 'Alamat KTP lengkap wajib diisi (Jalan, RT/RW, Kelurahan, Kecamatan, Kota).';
      }
      if (!formData.emergencyName || formData.emergencyName.trim().length === 0) {
        return 'Nama kontak darurat keluarga wajib diisi.';
      }
      if (!formData.emergencyPhone || formData.emergencyPhone.trim().length < 8) {
        return 'Nomor telepon kontak darurat wajib diisi.';
      }
    } else if (step === 3) {
      if (!formData.schoolName || formData.schoolName.trim().length === 0) {
        return 'Nama universitas / institusi pendidikan terakhir wajib diisi.';
      }
      if (!formData.major || formData.major.trim().length === 0) {
        return 'Program studi / jurusan wajib diisi.';
      }
      if (!formData.gradYear || formData.gradYear.trim().length === 0) {
        return 'Tahun kelulusan wajib diisi.';
      }
    } else if (step === 4) {
      if (!formData.expectedSalary || formData.expectedSalary.trim().length === 0) {
        return 'Ekspektasi gaji bulanan wajib diisi.';
      }
    }
    return null;
  };

  const persistDraft = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
      saveProfileData(formData, false);

      if (candidateUid) {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            ...formData,
            profileCompleted: false,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      updateCandidate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nik: formData.nik,
      });
    } catch (err) {
      console.error('Error saving profile draft:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const persistCompleted = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem('asiaplastik_profile_completed', 'true');
      saveProfileData(formData, true);

      if (candidateUid) {
        await setDoc(
          doc(db, 'candidates', candidateUid),
          {
            ...formData,
            profileCompleted: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      updateCandidate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nik: formData.nik,
      });
    } catch (err) {
      console.error('Error saving completed profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const error = validateStep(currentStep);
    if (error) {
      setErrorMessage(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrorMessage(null);
    await persistDraft();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let s = 1; s <= 4; s++) {
      const err = validateStep(s);
      if (err) {
        setErrorMessage(err);
        setCurrentStep(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setErrorMessage(null);
    await persistCompleted();
    setSaveNotice('Seluruh formulir biodata Anda berhasil diverifikasi & disimpan lengkap! Tahap 3 (Berkas & CV) kini telah dibuka.');
  };

  const stepTitles = [
    { num: 1, title: 'Identitas KTP', desc: 'NIK & Data Diri' },
    { num: 2, title: 'Kontak & Domisili', desc: 'No. WhatsApp & Alamat' },
    { num: 3, title: 'Riwayat Pendidikan', desc: 'Ijazah & Jurusan' },
    { num: 4, title: 'Pengalaman & K3', desc: 'Pekerjaan & Sertifikasi' },
  ];

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
            <span className="font-bold text-slate-900">Formulir Biodata Diri</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-1 rounded-full border border-sky-200 hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
            <span>Tahap 2: Pengisian Biodata</span>
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
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Header Card with Progress Stepper */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Alur Terpandu (Wizard)
                </span>
                <span className="text-xs text-slate-400 font-medium">• Seleksi CV. Asia Plastik</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Pengisian Biodata Langkah Demi Langkah
              </h1>
            </div>
            <div className="text-right sm:self-center">
              <span className="text-xs font-bold text-sky-700 block">Langkah {currentStep} dari 4</span>
              <span className="text-[11px] text-slate-400">Progres Kelengkapan: {currentStep * 25}%</span>
            </div>
          </div>

          {/* Horizontal Visual Stepper */}
          <div className="relative pt-2">
            <div className="absolute top-6 left-6 right-6 h-1 bg-slate-100 -z-0">
              <div
                className="h-full bg-sky-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>

            <div className="relative z-10 flex justify-between">
              {stepTitles.map((s) => (
                <button
                  key={s.num}
                  onClick={() => {
                    if (s.num < currentStep) {
                      setErrorMessage(null);
                      setCurrentStep(s.num);
                    } else if (s.num > currentStep) {
                      const err = validateStep(currentStep);
                      if (err) {
                        setErrorMessage(err);
                        return;
                      }
                      setErrorMessage(null);
                      setCurrentStep(s.num);
                    }
                  }}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      currentStep === s.num
                        ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-105'
                        : currentStep > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300'
                    }`}
                  >
                    {currentStep > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-bold mt-2 hidden sm:block ${
                      currentStep === s.num ? 'text-sky-700' : 'text-slate-600'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification with CTA to Stage 3 */}
        {saveNotice && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveNotice}</span>
            </div>
            <Link
              href="/dashboard/screening"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02] shrink-0 self-start sm:self-center"
            >
              <span>Lanjut ke Tahap 3 (Berkas & CV)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Step 1: Identitas KTP */}
        {currentStep === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 1: Data Identitas Resmi Sesuai KTP</h3>
              <p className="text-xs text-slate-500">Pastikan NIK dan nama lengkap sesuai dengan yang tertera di e-KTP fisik Anda.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="3515xxxxxxxxxxxx"
                  maxLength={16}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  name="pob"
                  value={formData.pob}
                  onChange={handleChange}
                  placeholder="Kota / Kabupaten Kelahiran"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Pernikahan</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Cerai">Cerai</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>{isSaving ? 'Menyimpan...' : 'Lanjut: Kontak & Domisili'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Kontak & Domisili */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 2: Nomor Kontak Aktif & Alamat Domisili</h3>
              <p className="text-xs text-slate-500">Nomor WhatsApp akan digunakan tim rekrutmen pabrik untuk mengirim jadwal wawancara.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat KTP Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="ktpAddress"
                  rows={2}
                  value={formData.ktpAddress}
                  onChange={handleChange}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kontak Darurat (Keluarga) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Nama orang tua / pasangan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Telepon Darurat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>{isSaving ? 'Menyimpan...' : 'Lanjut: Riwayat Pendidikan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Riwayat Pendidikan */}
        {currentStep === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 3: Riwayat Pendidikan & Akademik</h3>
              <p className="text-xs text-slate-500">Kualifikasi ijazah terakhir yang relevan dengan posisi yang dilamar.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Pendidikan Terakhir</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="SMK">SMK / SMA Sederajat</option>
                  <option value="D3">Diploma 3 (D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="S2">Magister (S2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Institusi / Universitas</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Nama universitas / politeknik / sekolah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Misal: Teknik Kimia, Teknik Mesin, Teknik Industri"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IPK / Nilai Rata-rata Ijazah</label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="Misal: 3.50 atau 85.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>{isSaving ? 'Menyimpan...' : 'Lanjut: Pengalaman & K3'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Pengalaman & K3 */}
        {currentStep === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 4: Pengalaman Kerja & Sertifikasi K3</h3>
              <p className="text-xs text-slate-500">Langkah terakhir sebelum pengajuan berkas biodata resmi ke HRD.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perusahaan / Pabrik Terakhir</label>
                <input
                  type="text"
                  name="lastCompany"
                  value={formData.lastCompany}
                  onChange={handleChange}
                  placeholder="Nama perusahaan (kosongkan jika fresh graduate)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan & Posisi Terakhir</label>
                <input
                  type="text"
                  name="lastPosition"
                  value={formData.lastPosition}
                  onChange={handleChange}
                  placeholder="Misal: QC Inspector / Staff Produksi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Sertifikasi yang Dimiliki</label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="Misal: Sertifikat K3 Umum, ISO 9001, QC Plastik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ekspektasi Gaji Bulanan (Rp)</label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="Misal: 5.000.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan ke Database...' : 'Simpan & Selesaikan Biodata'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

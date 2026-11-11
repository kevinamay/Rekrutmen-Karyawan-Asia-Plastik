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
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRecruitment } from '@/context/RecruitmentContext';

export default function ProfilePage() {
  const router = useRouter();
  const { candidate, updateCandidate } = useRecruitment();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [candidateUid, setCandidateUid] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nik: '3515082405990002',
    fullName: candidate.fullName || 'Kevina Maydiva Heriansaputri',
    pob: 'Sidoarjo',
    dob: '1999-05-24',
    gender: 'Perempuan',
    religion: 'Islam',
    maritalStatus: 'Belum Menikah',
    bloodType: 'O',
    ktpAddress: 'Jl. Raya Industri Buduran No. 45, RT 03 / RW 02, Sidoarjo',
    currentAddress: 'Jl. Raya Industri Buduran No. 45, RT 03 / RW 02, Sidoarjo',
    phone: candidate.phone || '082244109503',
    email: candidate.email || 'kevinamay23@gmail.com',
    emergencyName: 'Herian Saputra',
    emergencyRelation: 'Orang Tua (Ayah)',
    emergencyPhone: '081234567890',
    educationLevel: 'S1',
    schoolName: 'Institut Teknologi Sepuluh Nopember (ITS)',
    major: 'Teknik Material & Manufaktur',
    gradYear: '2023',
    gpa: '3.65',
    lastCompany: 'PT. Multi Fabrindo Plastik',
    lastPosition: 'QC Quality Inspector Intern',
    jobDesc: 'Inspeksi mutu biji plastik & cetakan molding injeksi sesuai ISO 9001.',
    expectedSalary: '5.500.000',
    certifications: 'Sertifikat K3 Umum Kemnaker, Internal Auditor ISO 9001:2015',
  });

  // Sync with Firebase Auth and Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCandidateUid(user.uid);
        if (user.displayName) {
          setFormData((prev) => ({ ...prev, fullName: user.displayName || prev.fullName }));
        }
        if (user.email) {
          setFormData((prev) => ({ ...prev, email: user.email || prev.email }));
        }

        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData((prev) => ({
              ...prev,
              nik: data.nik || prev.nik,
              fullName: data.fullName || prev.fullName,
              phone: data.phone || prev.phone,
              email: data.email || prev.email,
              pob: data.pob || prev.pob,
              dob: data.dob || prev.dob,
              gender: data.gender || prev.gender,
              maritalStatus: data.maritalStatus || prev.maritalStatus,
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
              fullName: data.fullName || formData.fullName,
              email: data.email || formData.email,
              phone: data.phone || formData.phone,
            });
          }
        } catch (err) {
          console.error('Error fetching candidate doc in profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [formData.email, formData.fullName, formData.phone, updateCandidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveNotice(null);
  };

  const persistToFirestore = async () => {
    if (!candidateUid) return;
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, 'candidates', candidateUid),
        {
          ...formData,
          profileCompleted: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      updateCandidate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
    } catch (err) {
      console.error('Error saving to Firestore:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await persistToFirestore();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistToFirestore();
    setSaveNotice('Seluruh berkas biodata Anda berhasil disimpan dan diverifikasi oleh sistem rekrutmen CV. Asia Plastik.');
    setTimeout(() => {
      setSaveNotice(null);
    }, 5000);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const stepTitles = [
    { num: 1, title: 'Identitas KTP', desc: 'NIK & Data Diri' },
    { num: 2, title: 'Kontak & Domisili', desc: 'No. WhatsApp & Alamat' },
    { num: 3, title: 'Riwayat Pendidikan', desc: 'Ijazah & Jurusan' },
    { num: 4, title: 'Pengalaman & K3', desc: 'Pekerjaan & Sertifikasi' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100/70 font-sans text-slate-800">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sleek Navy Sidebar (Consistent with Desain 2) */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
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
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Beranda Pelamar</span>
            </Link>

            <Link
              href="/dashboard/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 text-white shadow-sm"
            >
              <User className="w-4 h-4 text-sky-200" />
              <span>Biodata Diri</span>
            </Link>

            <Link
              href="/dashboard/screening"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Berkas & CV</span>
            </Link>

            <Link
              href="/dashboard/competency-test"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Tes Kompetensi</span>
            </Link>

            <Link
              href="/dashboard/status"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Status Lamaran</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'K'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">{formData.fullName}</span>
              <span className="text-[10px] text-slate-400 block truncate">{formData.email}</span>
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

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
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
                    onClick={() => setCurrentStep(s.num)}
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

          {/* Success Notification */}
          {saveNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveNotice}</span>
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
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
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
      </div>
    </div>
  );
}

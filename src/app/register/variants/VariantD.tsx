'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Factory,
  Award,
  Sparkles,
} from 'lucide-react';
import { VariantProps } from './VariantA';

export function VariantD({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  selectedRole,
  setSelectedRole,
  agreeTerms,
  setAgreeTerms,
  isLoading,
  errors,
  handleSubmit,
  availableRoles,
}: VariantProps) {
  const storyPoints = [
    {
      title: 'Lini Produksi Modern & Presisi',
      subtitle: 'Mesin ekstrusi & moulding berteknologi tinggi',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg',
      badge: 'Fasilitas Pabrik',
    },
    {
      title: 'Pengendalian Mutu & Standar K3',
      subtitle: 'Pengujian berkala bersertifikasi ISO 9001:2015',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (1).jpeg',
      badge: 'Kualitas Prima',
    },
    {
      title: 'Distribusi Logistik Terpadu',
      subtitle: 'Jaringan distribusi nasional yang terpercaya',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.55 (2).jpeg',
      badge: 'Logistik',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Top Corporate Nav */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/logos/logo-white.webp"
              alt="CV. Asia Plastik"
              width={150}
              height={50}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">Sudah terdaftar?</span>
            <Link
              href="/login"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors"
            >
              Masuk Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: Storyboard on Left, Form on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Visual Storyboard Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/70 border border-blue-800/60 px-3 py-1 rounded-full">
                Eksplorasi Lingkungan Kerja
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Kenali Fasilitas Pabrik Kami Sebelum Bergabung
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                CV. Asia Plastik berkomitmen menciptakan lingkungan kerja yang aman, modern, dan memberikan ruang bagi setiap karyawan untuk bertumbuh.
              </p>
            </div>

            {/* 3 Storyboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {storyPoints.map((sp, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/70 hover:border-blue-500/50 transition-all shadow-lg flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={sp.image}
                      alt={sp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white backdrop-blur-sm">
                      {sp.badge}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-white leading-snug">{sp.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{sp.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges Bar */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Standar Mutu ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>K3 Keselamatan Kerja Terjamin</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI Fast-Track Assessment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Glass Registration Form (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-900/60 px-2.5 py-0.5 rounded-full">
                Formulir Pendaftaran
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                Buat Akun Pelamar
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Isi data diri Anda di bawah ini untuk memulai tahapan seleksi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap sesuai KTP"
                    className="pl-10 h-11 text-xs bg-slate-900/80 border-slate-800 text-white rounded-xl focus:border-blue-500"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Aktif <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alamat.email@anda.com"
                    className="pl-10 h-11 text-xs bg-slate-900/80 border-slate-800 text-white rounded-xl focus:border-blue-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Kata Sandi <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="pl-10 h-11 text-xs bg-slate-900/80 border-slate-800 text-white rounded-xl focus:border-blue-500"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              {/* Position selector dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Posisi Yang Dipilih <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full h-11 px-3 text-xs bg-slate-900/80 border border-slate-800 text-white rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  {availableRoles.map((r) => (
                    <option key={r.title} value={r.title} className="bg-slate-900 text-white">
                      {r.title} ({r.openings} Formasi)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-700 bg-slate-900"
                  />
                  <span className="text-xs text-slate-400 leading-snug">
                    Saya menyetujui pemrosesan data pelamar oleh CV. Asia Plastik.
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <span>Menyimpan Akun...</span>
                ) : (
                  <>
                    <span>Daftar & Lanjut Seleksi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

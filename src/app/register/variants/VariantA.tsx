'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Award,
  Factory,
} from 'lucide-react';

export interface VariantProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  handleSubmit: (e: React.FormEvent) => void;
  availableRoles: { title: string; department: string; openings: number }[];
}

export function VariantA({
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
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans pb-16 lg:pb-0">
      {/* Left Column: Visual Factory Showcase */}
      <div className="w-full lg:w-5/12 bg-slate-900 relative flex flex-col justify-between p-8 sm:p-12 text-white min-h-[460px] lg:min-h-screen overflow-hidden">
        {/* Real Factory Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg"
            alt="Lini Pabrik CV Asia Plastik"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-90"
          />
          {/* Subtle dark gradient overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/70 to-slate-950/80" />
        </div>

        {/* Top Header inside Left Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/logos/logo-white.webp"
              alt="CV. Asia Plastik"
              width={160}
              height={55}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200">
            Portal Rekrutmen Resmi
          </span>
        </div>

        {/* Center Copy & Value Props */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Factory className="w-4 h-4 text-blue-400" />
            <span>Manufaktur Modern & Ramah Lingkungan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Mulai Karir Profesional Anda di{' '}
            <span className="text-blue-400">CV. Asia Plastik</span>
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed max-w-md">
            Bergabunglah bersama fasilitas produksi berstandar internasional. Sistem seleksi transparan, evaluasi objektif, dan kesempatan berkembang nyata.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Tracking status seleksi dan tes secara real-time</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <span>Sertifikasi K3 & Standar Mutu ISO 9001:2015</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Asesmen kompetensi objektif berbasis Smart AI</span>
            </div>
          </div>
        </div>

        {/* Footer info in Left Panel */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pabrik: Sidoarjo / Surabaya</span>
          <span>© 2026 CV. Asia Plastik</span>
        </div>
      </div>

      {/* Right Column: Clean Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-900/5 border border-slate-100 space-y-6">
          {/* Header on form */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Registrasi Akun Pelamar
              </span>
              <Link href="/login" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                Sudah punya akun? Masuk →
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Buat Akun Pelamar Baru
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lengkapi data singkat berikut untuk memulai proses lamaran kerja.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@email.com"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi Akun <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter aman"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Target Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Posisi Yang Dilamar <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {availableRoles.map((role) => {
                  const isSelected = selectedRole === role.title;
                  return (
                    <div
                      key={role.title}
                      onClick={() => setSelectedRole(role.title)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{role.title}</div>
                          <div className="text-[11px] text-slate-500">{role.department}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {role.openings} Formasi
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consent Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Saya menyetujui bahwa data yang diisi adalah benar dan bersedia mengikuti prosedur seleksi rekrutmen di CV. Asia Plastik.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Memproses Akun...</span>
              ) : (
                <>
                  <span>Daftar Sekarang & Lanjut Profil</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

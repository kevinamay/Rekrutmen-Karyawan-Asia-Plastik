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
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Factory,
  Award,
  Sparkles,
} from 'lucide-react';

export interface VariantProps {
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  handleSubmit: (e: React.FormEvent) => void;
}

export function VariantA({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  agreeTerms,
  setAgreeTerms,
  isLoading,
  errors,
  handleSubmit,
}: VariantProps) {
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-slate-200', width: '0%' };
    if (password.length < 6) return { label: 'Lemah', color: 'bg-red-500', width: '25%' };
    if (password.length < 8) return { label: 'Sedang', color: 'bg-amber-500', width: '60%' };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasNum && hasSpecial) return { label: 'Sangat Kuat', color: 'bg-emerald-500', width: '100%' };
    return { label: 'Kuat', color: 'bg-blue-600', width: '80%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans pb-16 lg:pb-0">
      {/* Left Column: Factory Visual Showcase & Values */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/75 to-slate-950/80" />
        </div>

        {/* Top Header */}
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
            <span>Industri Manufaktur Plastik & Kemasan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Buat Akun Pelamar & Bangun Karir di{' '}
            <span className="text-blue-400">CV. Asia Plastik</span>
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed max-w-md">
            Daftarkan diri Anda untuk mengakses seluruh formasi lowongan kerja, mengikuti tes seleksi online, dan memantau status lamaran secara transparan.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Akses ke seluruh lowongan kerja teknik, produksi & staff</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Data pribadi pelamar aman & terlindungi secara terenkripsi</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Simulasi AI Interview & evaluasi kompetensi objektif</span>
            </div>
          </div>
        </div>

        {/* Footer info in Left Panel */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pabrik: Sidoarjo / Surabaya</span>
          <span>© 2026 CV. Asia Plastik</span>
        </div>
      </div>

      {/* Right Column: Clean, Professional Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-900/5 border border-slate-100 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Registrasi Akun Baru
              </span>
              <Link href="/login" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                Sudah punya akun? Masuk →
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Pendaftaran Akun Kandidat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lengkapi formulir di bawah ini untuk membuat akun portal rekrutmen resmi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Pratama Ardiansyah"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Grid: WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp / HP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className={`pl-10 h-11 text-sm rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

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
                    placeholder="nama@email.com"
                    className={`pl-10 h-11 text-sm rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi Akun <span className="text-red-500">*</span>
                </label>
                {strength.label && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Kekuatan: <strong className="text-slate-800">{strength.label}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter aman"
                  className={`pl-10 pr-10 h-11 text-sm rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }}
                  />
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Saya menyatakan data diri yang diberikan benar dan menyetujui ketentuan privasi seleksi rekrutmen di CV. Asia Plastik.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Membuat Akun Pelamar...</span>
              ) : (
                <>
                  <span>Daftar Sekarang & Lengkapi Profil</span>
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

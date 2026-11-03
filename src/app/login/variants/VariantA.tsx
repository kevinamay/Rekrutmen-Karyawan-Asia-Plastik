'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LoginVariantProps } from './types';

export function VariantA({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  errorMessage,
  handleSubmit,
  openForgotPassword,
}: LoginVariantProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Column: Crisp White & Soft Blue Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10 bg-white">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={160}
              height={55}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full transition-all border border-sky-100"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Center: Main Login Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Portal Masuk Resmi Pelamar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Masuk ke akun kandidat Anda untuk memantau status lamaran kerja dan jadwal tes seleksi di CV. Asia Plastik.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email atau Nomor WhatsApp
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com / 08123456789"
                  className="pl-10 h-11 text-sm rounded-xl border-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 bg-sky-50/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="pl-10 pr-10 h-11 text-sm rounded-xl border-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 bg-sky-50/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs font-medium text-slate-600">Ingat perangkat saya</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi Akun...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Masuk ke Portal Karir
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Belum memiliki akun pelamar?{' '}
              <Link href="/register" className="font-bold text-sky-600 hover:text-sky-800">
                Daftar Akun Baru Sekarang →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Enkripsi SSL 256-bit Terproteksi</span>
          </div>
          <span>© 2026 CV. Asia Plastik</span>
        </div>
      </div>

      {/* Right Column: Company Building Image Showcase */}
      <div className="w-full lg:w-1/2 relative min-h-[380px] lg:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gedung-asia-plastik.jpg"
            alt="Gedung Kantor Pusat CV. Asia Plastik"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-95"
          />
          {/* Light-blue & corporate dark gradient tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-sky-950/50 to-sky-900/30 backdrop-blur-[1px]" />
        </div>

        {/* Top building tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <Building2 className="w-4 h-4 text-sky-300" />
            <span>Kantor Pusat & Pabrik Manufaktur</span>
          </div>
          <span className="text-[11px] font-bold text-sky-200 bg-sky-900/60 px-3 py-1 rounded-full border border-sky-400/30">
            Sidoarjo, Jawa Timur
          </span>
        </div>

        {/* Bottom card content */}
        <div className="relative z-10 space-y-4 max-w-lg mt-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Membangun Masa Depan Industri Manufaktur Bersama Talenta Terbaik.
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Fasilitas modern CV. Asia Plastik dirancang untuk keunggulan operasional, keselamatan kerja berstandar tinggi, dan pengembangan kompetensi berkelanjutan.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transparansi 100%</span>
              </div>
              <p className="text-[11px] text-slate-200">Tahapan seleksi terukur dan terpantau secara real-time</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standar Mutu ISO</span>
              </div>
              <p className="text-[11px] text-slate-200">Lingkungan kerja manufaktur bersertifikasi resmi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

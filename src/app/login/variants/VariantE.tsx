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
  Building,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LoginVariantProps } from './types';

export function VariantE({
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
    <div className="min-h-screen relative flex items-center justify-start p-4 sm:p-8 lg:p-16 font-sans overflow-hidden">
      {/* Fullscreen Architectural Photo Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gedung-asia-plastik-front.jpg"
          alt="Gedung Utama CV. Asia Plastik"
          fill
          priority
          className="object-cover object-center scale-100 filter brightness-95"
        />
        {/* Soft Daylight Gradient Overlay that fades into white/light-blue on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-900/60 to-transparent backdrop-blur-[1px]" />
      </div>

      {/* Floating Daylight Glass Card Docked on the Left */}
      <div className="relative z-10 max-w-lg w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-sky-950/40 border border-white/80 border-t-sky-200 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={150}
              height={50}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Kandidat</span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Login Akun Rekrutmen
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Akses portal terpusat pelamar CV. Asia Plastik untuk melengkapi berkas, konfirmasi jadwal tes, dan informasi seleksi.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Pelamar atau No. WhatsApp
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
                placeholder="Masukkan password"
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Masuk ke Portal Karir
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Register CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600">Belum punya akun?</span>
          <Link href="/register" className="font-bold text-sky-600 hover:text-sky-800">
            Daftar Akun Baru →
          </Link>
        </div>

        {/* Security / Quality Assurance */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Server Resmi CV. Asia Plastik</span>
          </div>
          <span>Sidoarjo, Jawa Timur</span>
        </div>
      </div>

      {/* Floating Badge in Daylight Room on the Right (hidden on mobile) */}
      <div className="hidden lg:flex flex-col gap-3 absolute bottom-12 right-12 z-10 max-w-sm">
        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
            <Building className="w-4 h-4 text-sky-400" />
            <span>Gedung Kantor Pusat & Manufaktur</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Lini produksi botol & kemasan plastik industri berskala nasional dengan sistem kontrol mutu terstandar.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 text-[11px] text-sky-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terbuka Untuk Profesional & Talenta Baru</span>
          </div>
        </div>
      </div>
    </div>
  );
}

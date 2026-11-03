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
  CheckCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { LoginVariantProps } from './types';

export function VariantB({
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-blue-100/60 flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Decorative background light blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Elevated Glass Card */}
      <div className="relative z-10 max-w-4xl w-full bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-sky-900/10 border border-sky-100 overflow-hidden flex flex-col md:flex-row my-8">
        {/* Left Side: Building Photo Frame with Daylight Overlay */}
        <div className="w-full md:w-5/12 relative min-h-[260px] md:min-h-auto flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/gedung-asia-plastik-front.jpg"
              alt="Gedung CV. Asia Plastik Fasad Depan"
              fill
              priority
              className="object-cover object-center scale-105 filter brightness-95"
            />
            {/* Soft Light-Blue Glass Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/95 via-sky-900/60 to-blue-900/30" />
          </div>

          {/* Top Info on Photo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-bold text-sky-100">
              <Building className="w-3.5 h-3.5 text-sky-300" />
              <span>Gedung Pusat</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-sky-200 font-medium bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>Jawa Timur</span>
            </div>
          </div>

          {/* Bottom Info on Photo */}
          <div className="relative z-10 mt-auto pt-12 space-y-3">
            <div className="h-10 w-fit flex items-center mb-1">
              <Image
                src="/assets/images/logos/logo-white.webp"
                alt="CV. Asia Plastik"
                width={140}
                height={48}
                priority
                className="h-8 w-auto object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Pusat Inovasi & Produksi Kemasan Plastik Nasional
            </h3>
            <p className="text-xs text-sky-200/90 leading-relaxed">
              Bergabunglah bersama ratusan tenaga ahli dan staf operasional dalam ekosistem industri modern.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-sky-100 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sistem Asesmen Cepat & Terintegrasi</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White & Sky Blue Login Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="md:hidden inline-block">
                <Image
                  src="/assets/images/logos/logo.webp"
                  alt="CV. Asia Plastik"
                  width={130}
                  height={45}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Portal Rekrutmen Kandidat</span>
              </div>
              <Link
                href="/register"
                className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
              >
                Belum ada akun? <span className="underline">Daftar</span>
              </Link>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Masuk ke Akun Pelamar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              Silakan masukkan email dan password yang terdaftar untuk mengakses dashboard pelamar.
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email / Nomor Handphone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com / 08123456789"
                    className="pl-10 h-11 text-sm rounded-xl border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-slate-50/50"
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
                    className="pl-10 pr-10 h-11 text-sm rounded-xl border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-slate-50/50"
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
                  <span className="text-xs font-medium text-slate-600">Simpan sesi login</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all mt-3"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk ke Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Koneksi Aman CV. Asia Plastik</span>
            </div>
            <Link href="/" className="hover:text-slate-600">
              Beranda Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

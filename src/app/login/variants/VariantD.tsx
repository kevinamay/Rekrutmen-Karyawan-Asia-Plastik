'use client';

import React, { useState } from 'react';
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
  UserCheck,
  Building,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { LoginVariantProps } from './types';

export function VariantD({
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
  const [activeTab, setActiveTab] = useState<'candidate' | 'hr'>('candidate');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Left Column: Portal Selector & Login Form */}
      <div className="w-full lg:w-5/12 bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-r border-sky-100 z-10">
        <div>
          {/* Logo & Portal Status */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/logos/logo.webp"
                alt="CV. Asia Plastik"
                width={150}
                height={52}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              Sistem Terpadu
            </span>
          </div>

          {/* Dual Portal Switcher Tabs */}
          <div className="p-1 bg-slate-100 rounded-2xl flex items-center mb-8 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('candidate')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'candidate'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Akun Pelamar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hr')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'hr'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Staff & Penguji</span>
            </button>
          </div>

          {activeTab === 'hr' ? (
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-slate-700 space-y-3 mb-6">
              <h3 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                Akses Khusus Tim Rekruter Internal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Silakan gunakan email korporat internal <code>@asiaplastik.com</code> Anda atau masuk melalui Single Sign-On (SSO) perusahaan.
              </p>
            </div>
          ) : null}

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'candidate' ? 'Masuk Portal Kandidat' : 'Masuk Panel Penilai HR'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {activeTab === 'candidate'
                ? 'Pantau perkembangan aplikasi kerja, ujian online, dan hasil wawancara.'
                : 'Kelola verifikasi berkas, penilaian AI, dan penjadwalan interview pelamar.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {activeTab === 'candidate' ? 'Email / WhatsApp' : 'Corporate Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'candidate' ? 'nama@email.com' : 'recruiter@asiaplastik.com'}
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
                <span className="text-xs font-medium text-slate-600">Ingat akun saya</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengautentikasi...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {activeTab === 'candidate' ? 'Masuk ke Akun Pelamar' : 'Masuk Dashboard HR'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {activeTab === 'candidate' && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                Belum mendaftar akun pelamar?{' '}
                <Link href="/register" className="font-bold text-sky-600 hover:text-sky-800">
                  Daftar Sekarang →
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 pt-6 border-t border-slate-100 flex items-center justify-between">
          <span>Portal Rekrutmen Terpadu</span>
          <span>© 2026 CV. Asia Plastik</span>
        </div>
      </div>

      {/* Right Column: Architectural Angle Showcase with Floating Metric Cards */}
      <div className="w-full lg:w-7/12 relative min-h-[420px] lg:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gedung-asia-plastik-angle.jpg"
            alt="Fasilitas Gedung CV. Asia Plastik"
            fill
            priority
            className="object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/95 via-sky-900/40 to-slate-900/30" />
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-white">
            <Building className="w-4 h-4 text-sky-300" />
            <span>Fasilitas Manufaktur Terintegrasi</span>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-900/70 border border-sky-400/30 px-3 py-1 rounded-full">
            Krian • Sidoarjo
          </span>
        </div>

        {/* Floating Enterprise Cards */}
        <div className="relative z-10 space-y-4 max-w-lg mt-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Standar Kerja Unggul, Fasilitas Modern & Kesempatan Berkarir Luas.
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            CV. Asia Plastik terus bertumbuh dengan mengutamakan kualitas produk terbaik serta lingkungan kerja yang aman dan profesional.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
                <Award className="w-4 h-4 text-sky-300" />
                <span>K3 & Keselamatan Utama</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Penerapan SOP ketat dan jaminan perlindungan kerja komprehensif.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
                <Layers className="w-4 h-4 text-sky-300" />
                <span>Teknologi Mesin Mutakhir</span>
              </div>
              <p className="text-[11px] text-slate-200">
                Lini produksi presisi tinggi dengan dukungan sistem otomatisasi digital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

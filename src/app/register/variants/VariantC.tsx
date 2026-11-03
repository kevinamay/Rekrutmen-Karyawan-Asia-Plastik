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
import { VariantProps } from './VariantA';

export function VariantC({
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
  const facilityHighlights = [
    {
      title: 'Lini Mesin Otomasi Modern',
      desc: 'Bekerja dengan teknologi manufaktur mutakhir berstandar keselamatan K3.',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg',
      badge: 'Fasilitas Pabrik',
    },
    {
      title: 'Laboratorium & QC Mutu',
      desc: 'Pengujian kualitas plastik terstandardisasi ISO 9001:2015 berakurasi tinggi.',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (1).jpeg',
      badge: 'Standar Mutu',
    },
    {
      title: 'Gudang & Logistik Terpadu',
      desc: 'Pengelolaan inventori modern dengan sistem pergudangan terintegrasi.',
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.55 (2).jpeg',
      badge: 'Operasional',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-24">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={140}
              height={45}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden sm:inline text-slate-500">Sudah punya akun?</span>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Masuk Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Factory Visual Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 border border-blue-200">
                Peluang Karir Manufaktur
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Mulai Perjalanan Karir di CV. Asia Plastik
              </h1>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                Buat satu akun untuk melamar berbagai posisi di lini teknik, quality control, operasional pabrik, administrasi, maupun magang nasional.
              </p>
            </div>

            {/* 3 Facility Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {facilityHighlights.map((fh, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={fh.image}
                      alt={fh.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                      {fh.badge}
                    </span>
                  </div>
                  <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{fh.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{fh.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Points */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tracking Lamaran Real-Time</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Standar Mutu ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Kerahasiaan Data Terjamin</span>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Account Creation Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Pendaftaran Akun
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  Formulir Kandidat
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan data diri Anda untuk mengakses portal seleksi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap (KTP) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap kandidat"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alamat@email.com"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className={`pl-9 pr-9 h-10 text-xs rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-600 leading-snug">
                      Saya menyetujui pemrosesan data pelamar oleh HRD CV. Asia Plastik.
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span>Membuat Akun...</span>
                  ) : (
                    <>
                      <span>Buat Akun & Masuk Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                Sudah memiliki akun?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:underline">
                  Login di Sini
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Star,
  Factory,
} from 'lucide-react';
import { VariantProps } from './VariantA';

export function VariantE({
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
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col justify-between pb-24">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-slate-100 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <Image
            src="/assets/images/logos/logo.webp"
            alt="CV. Asia Plastik"
            width={140}
            height={45}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">Sudah memiliki akun pelamar?</span>
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Masuk Portal →
          </Link>
        </div>
      </header>

      {/* Main 2-Column Content */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Form: Clean, Precision Focused (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Pendaftaran Kandidat Baru
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                Bangun Karir Impian Anda
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Lengkapi formulir registrasi singkat ini untuk mulai melamar di CV. Asia Plastik.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Pratama Ardiansyah"
                    className="pl-10 h-10 text-xs rounded-xl border-slate-200"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Grid: No WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="pl-10 h-10 text-xs rounded-xl border-slate-200"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="pl-10 h-10 text-xs rounded-xl border-slate-200"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Grid: Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="pl-10 pr-9 h-10 text-xs rounded-xl border-slate-200"
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
                    Konfirmasi Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi sandi"
                      className="pl-10 h-10 text-xs rounded-xl border-slate-200"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Saya menyetujui pemrosesan data pelamar oleh HRD CV. Asia Plastik secara aman.
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-xs flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <span>Menyiapkan Akun...</span>
                ) : (
                  <>
                    <span>Daftar Akun Pelamar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column: Architectural Framed Window with Factory Machinery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[480px]">
              <Image
                src="/images/WhatsApp Image 2026-10-23 at 15.47.56 (1).jpeg"
                alt="Teknisi Manufaktur CV. Asia Plastik"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm">
                  <Factory className="w-4 h-4 text-blue-600" />
                  <span>Lini Cetak Injeksi Plastik</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-sm">
                  Rekrutmen Aktif
                </div>
              </div>

              {/* Bottom Testimonial / Work Culture Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;Bekerja di CV. Asia Plastik memberikan kesempatan nyata mengoperasikan mesin modern dengan kultur kerja yang saling mendukung dan mengutamakan keselamatan.&rdquo;
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">Bambang H. — Teknisi Senior</span>
                  <span className="text-slate-500">Divisi Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-slate-100 py-3 text-center text-xs text-slate-400">
        CV. Asia Plastik © 2026. Portal Rekrutmen Terpadu & Terpercaya.
      </footer>
    </div>
  );
}

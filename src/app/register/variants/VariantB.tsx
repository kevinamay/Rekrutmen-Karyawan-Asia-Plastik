'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { VariantProps } from './VariantA';

export function VariantB({
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
  const [step, setStep] = useState<1 | 2>(1);
  const [stepError, setStepError] = useState('');

  const handleNextStep = () => {
    if (!fullName.trim()) {
      setStepError('Silakan isi nama lengkap Anda');
      return;
    }
    setStepError('');
    setStep(2);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 font-sans pb-24 overflow-hidden">
      {/* Immersive Factory Warehouse Canvas */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/WhatsApp Image 2026-10-23 at 15.47.55 (2).jpeg"
          alt="Gudang Logistik CV. Asia Plastik"
          fill
          priority
          className="object-cover object-center filter brightness-95"
        />
        {/* Soft dark slate scrim overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
      </div>

      {/* Floating Centered Modern Modal Card */}
      <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-10 my-auto">
        {/* Top Branding & Stepper Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={150}
              height={50}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* 2-Step Pill Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Posisi & Nama</span>
            </div>
            <span className="text-slate-300">→</span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === 2 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Kredensial Akun</span>
            </div>
          </div>
        </div>

        {/* Step 1: Position and Full Name */}
        {step === 1 && (
          <div className="py-6 space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Pilih Posisi Lamaran Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Langkah 1 dari 2: Pilih bidang karir dan masukkan nama lengkap Anda.
              </p>
            </div>

            {/* Target Position Selection in Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Daftar Formasi Lowongan Aktif
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableRoles.map((role) => {
                  const isSelected = selectedRole === role.title;
                  return (
                    <div
                      key={role.title}
                      onClick={() => setSelectedRole(role.title)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-xs font-bold text-slate-900">{role.title}</div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                          {role.openings} Formasi
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2">{role.department}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap Sesuai Dokumen Resmi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (stepError) setStepError('');
                  }}
                  placeholder="Nama lengkap kandidat"
                  className="pl-10 h-11 text-sm rounded-xl"
                />
              </div>
              {stepError && <p className="text-xs text-red-500 mt-1 font-medium">{stepError}</p>}
            </div>

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
            >
              <span>Lanjut ke Langkah 2: Kredensial Akun</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Email, Password, & Submit */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="py-6 space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Atur Email & Kata Sandi Akun
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Langkah 2 dari 2: Digunakan untuk masuk dan memantau perkembangan tes.
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Posisi: </span>
                <strong className="text-blue-900">{selectedRole}</strong>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-slate-500">Nama: </span>
                <strong className="text-blue-900">{fullName}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:underline font-bold text-xs"
              >
                Ubah
              </button>
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
                  placeholder="alamat.email@anda.com"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className={`pl-10 h-11 text-sm rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Saya menyetujui ketentuan pemrosesan data pelamar oleh CV. Asia Plastik secara aman dan rahasia.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="h-12 px-5 rounded-xl border-slate-200 text-slate-700 text-sm font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <span>Mendaftarkan Akun...</span>
                ) : (
                  <>
                    <span>Selesaikan Pendaftaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Footer login link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Sudah memiliki akun pelamar?</span>
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Masuk ke Portal Pelamar →
          </Link>
        </div>
      </div>
    </div>
  );
}

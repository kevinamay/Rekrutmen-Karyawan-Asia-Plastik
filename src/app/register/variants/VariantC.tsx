'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Factory,
  Sparkles,
} from 'lucide-react';
import { VariantProps } from './VariantA';

export function VariantC({
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
  // Enhanced roles with division images
  const roleCards = [
    {
      title: 'Supervisor Quality Control (QC)',
      department: 'Quality Assurance & Lab Mutu',
      openings: 2,
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (1).jpeg',
      tag: 'Teknik Kimia / MIPA',
      desc: 'Inspeksi mutu biji plastik & pengujian standar ISO.',
    },
    {
      title: 'Supervisor Teknik Mesin',
      department: 'Engineering & Maintenance',
      openings: 1,
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.55 (1).jpeg',
      tag: 'Teknik Mesin / Mekatronika',
      desc: 'Perawatan mesin injection moulding & utilitas pabrik.',
    },
    {
      title: 'Internal Auditor',
      department: 'Audit & Governance',
      openings: 1,
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.55 (2).jpeg',
      tag: 'S1 Akuntansi / Keuangan',
      desc: 'Audit operasional pergudangan & SOP keuangan.',
    },
    {
      title: 'Admin Penjualan',
      department: 'Commercial & Sales B2B',
      openings: 2,
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.57 (1).jpeg',
      tag: 'D3 / S1 Semua Jurusan',
      desc: 'Administrasi purchase order & logistik distribusi.',
    },
    {
      title: 'Lowongan Magang Nasional',
      department: 'People Development & Operasional',
      openings: 5,
      image: '/images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg',
      tag: 'Mahasiswa / Fresh Grad',
      desc: 'Pengalaman langsung lini manufaktur plastik modern.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-24">
      {/* Top Navbar Header */}
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
            <span className="hidden sm:inline text-slate-500">Sudah terdaftar sebelumnya?</span>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 border border-blue-200">
            Katalog Karir & Registrasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pilih Peran Idaman Anda, Lalu Daftarkan Diri
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Klik salah satu divisi di bawah untuk memilih lowongan yang ingin Anda lamar di CV. Asia Plastik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Role Cards Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Langkah 1: Klik Salah Satu Posisi di Bawah ({roleCards.length} Divisi Aktif)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleCards.map((rc) => {
                const isSelected = selectedRole === rc.title;
                return (
                  <div
                    key={rc.title}
                    onClick={() => setSelectedRole(rc.title)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 bg-white ${
                      isSelected
                        ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/30 -translate-y-1'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Facility Image preview */}
                    <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={rc.image}
                        alt={rc.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                          {rc.openings} Formasi
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-slate-200">
                        {rc.tag}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {rc.title}
                        </h3>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {rc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Docked Candidate Account Form (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Langkah 2: Lengkapi Akun
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  Formulir Pendaftaran
                </h2>
                <div className="mt-2 p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <div className="text-xs">
                    <span className="text-slate-500">Melamar untuk: </span>
                    <strong className="text-blue-900">{selectedRole}</strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap sesuai KTP"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email.aktif@anda.com"
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
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className={`pl-9 h-10 text-xs rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
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
                      Data yang saya masukkan akurat dan saya bersedia mengikuti proses seleksi online CV. Asia Plastik.
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
                    <span>Mendaftarkan...</span>
                  ) : (
                    <>
                      <span>Kirim Pendaftaran & Masuk Profil</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:underline">
                  Login Pelamar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

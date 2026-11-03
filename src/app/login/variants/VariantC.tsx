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
  ShieldCheck,
  Building2,
  Headphones,
} from 'lucide-react';
import { LoginVariantProps } from './types';

export function VariantC({
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Simple Bar */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="inline-block">
          <Image
            src="/assets/images/logos/logo.webp"
            alt="CV. Asia Plastik"
            width={140}
            height={50}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>
        <Link
          href="/register"
          className="text-xs font-bold text-sky-700 bg-sky-100/70 hover:bg-sky-200/70 px-4 py-2 rounded-xl transition-all"
        >
          Registrasi Akun Baru
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-sky-900/5 border border-sky-100 overflow-hidden">
          {/* Panoramic Building Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
            <Image
              src="/images/gedung-asia-plastik.jpg"
              alt="Fasilitas Kantor & Pabrik CV. Asia Plastik"
              fill
              priority
              className="object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/40 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-semibold text-sky-100 mb-1 border border-white/20">
                  <Building2 className="w-3.5 h-3.5 text-sky-300" />
                  <span>Headquarters & Production Site</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">CV. Asia Plastik</h2>
                <p className="text-xs text-sky-200">Krian, Sidoarjo, Jawa Timur</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-sm text-white">
                Sistem Online 24/7
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Login Akun Pelamar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Masukkan kredensial akun pelamar Anda untuk mengakses informasi rekrutmen.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Terdaftar / WhatsApp
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-600">Tetap masuk di perangkat ini</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk ke Portal
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Data kandidat aman & terenkripsi
              </span>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-600 hover:underline font-semibold"
              >
                <Headphones className="w-3.5 h-3.5" />
                Bantuan HR
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-2xl w-full mx-auto text-center py-4 text-xs text-slate-400">
        © 2026 CV. Asia Plastik • Portal Rekrutmen Resmi Karyawan
      </footer>
    </div>
  );
}

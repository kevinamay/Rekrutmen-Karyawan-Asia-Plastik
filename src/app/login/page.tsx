'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('pratama.ardiansyah@gmail.com');
  const [password, setPassword] = useState('AsiaPlastik2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan lengkapi email/nomor WhatsApp dan password Anda.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard/profile');
    }, 800);
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-white text-slate-800 font-sans p-6 pb-10">
      {/* Background soft sky blue ambient waves */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-sky-100/50 via-sky-50/20 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Belum punya akun?</span>
          <Link
            href="/register"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
          >
            Daftar Sekarang →
          </Link>
        </div>
      </header>

      {/* Main Form Center (Clean Borderless Minimalist) */}
      <main className="relative z-10 w-full max-w-sm mx-auto my-auto py-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105 mb-5">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={160}
              height={55}
              priority
              className="h-11 w-auto object-contain mx-auto"
            />
          </Link>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Portal Rekrutmen Karyawan CV. Asia Plastik
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email atau Nomor WhatsApp
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com / 08123456789"
                className="pl-10 h-11 text-sm rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setRecoveryEmail(email);
                  setRecoverySent(false);
                  setForgotModalOpen(true);
                }}
                className="text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors"
              >
                Lupa?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="pl-10 pr-10 h-11 text-sm rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
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

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span className="text-xs text-slate-600">Ingat saya</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Masuk...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Masuk ke Portal
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-sm w-full mx-auto flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Keamanan Terjamin SSL 256-bit</span>
        </div>
        <span>© 2026 CV. Asia Plastik</span>
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Pemulihan Kata Sandi Pelamar"
        description="Kami akan mengirimkan instruksi dan tautan verifikasi ke email atau WhatsApp Anda."
      >
        {!recoverySent ? (
          <form onSubmit={handleSendRecovery} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email atau Nomor WhatsApp
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="nama@email.com / 08123456789"
                  className="pl-10 h-11 text-sm rounded-xl border-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md shadow-sky-600/20"
              >
                Kirim Tautan Reset
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Tautan Reset Telah Dikirim</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Jika akun terdaftar dengan <strong className="text-slate-800">{recoveryEmail}</strong>, Anda akan menerima petunjuk pemulihan kata sandi dalam beberapa menit.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold"
            >
              Selesai & Tutup
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

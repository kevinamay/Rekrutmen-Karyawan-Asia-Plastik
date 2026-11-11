'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
  const router = useRouter();
  const { updateCandidate } = useRecruitment();

  // Form State (Clean without default dummy data)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-slate-200', width: '0%' };
    if (password.length < 6) return { label: 'Lemah', color: 'bg-red-500', width: '25%' };
    if (password.length < 8) return { label: 'Sedang', color: 'bg-amber-500', width: '60%' };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasNum && hasSpecial) return { label: 'Sangat Kuat', color: 'bg-emerald-500', width: '100%' };
    return { label: 'Kuat', color: 'bg-sky-600', width: '80%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi sesuai KTP';
    if (!phone.trim()) newErrors.phone = 'Nomor WhatsApp / HP aktif wajib diisi';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Alamat email aktif wajib diisi';
    if (!password || password.length < 8) newErrors.password = 'Kata sandi minimal 8 karakter';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Kata sandi dan konfirmasi tidak cocok';
    if (!agreeTerms) newErrors.terms = 'Silakan setujui ketentuan privasi rekrutmen';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Set user display name
      try {
        await updateProfile(user, { displayName: fullName.trim() });
      } catch (profileErr) {
        console.warn('Update profile error:', profileErr);
      }

      // 3. Store candidate document in Firestore database
      try {
        await setDoc(doc(db, 'candidates', user.uid), {
          uid: user.uid,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
          role: 'candidate',
          applicationStatus: 'registered',
        });
      } catch (firestoreErr) {
        console.warn('Firestore write warning:', firestoreErr);
      }

      // 4. Update in-app state context
      updateCandidate({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });

      router.push('/dashboard/profile');
    } catch (err: any) {
      console.error('Firebase registration error:', err);
      let errorMsg = 'Gagal mendaftar akun. Silakan coba lagi.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Alamat email ini sudah terdaftar di sistem. Silakan masuk via halaman Login atau gunakan email lain.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Format alamat email tidak valid.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Koneksi jaringan gagal. Periksa koneksi internet Anda.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-gradient-to-br from-sky-100/90 via-sky-50/60 to-blue-100/70 text-slate-800 font-sans p-6 pb-10 overflow-hidden">
      {/* Background ambient light blue gradient blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Center (Clean Borderless Minimalist) */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105 mb-4">
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
            Pendaftaran Akun Baru
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Portal Rekrutmen Karyawan CV. Asia Plastik
          </p>
        </div>

        {errors.general && (
          <div className="p-3 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={`pl-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className={`pl-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={`pl-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              {strength.label && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Kekuatan: <strong className="text-sky-700">{strength.label}</strong>
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className={`pl-10 pr-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
            )}
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konfirmasi Kata Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className={`pl-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Login Link placed above terms checkbox */}
          <div className="flex items-center justify-between text-xs pt-1 pb-0.5">
            <span className="text-slate-500">Sudah punya akun?</span>
            <Link
              href="/login"
              className="font-bold text-sky-600 hover:text-sky-800 transition-colors"
            >
              Masuk →
            </Link>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                Saya menyetujui ketentuan privasi seleksi rekrutmen CV. Asia Plastik.
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mendaftarkan ke Database...
              </span>
            ) : (
              <>
                <span>Daftar Sekarang & Lengkapi Profil</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-md w-full mx-auto flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Keamanan Terjamin SSL 256-bit</span>
        </div>
        <span>© 2026 CV. Asia Plastik</span>
      </footer>
    </div>
  );
}

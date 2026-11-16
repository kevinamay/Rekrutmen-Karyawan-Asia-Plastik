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
import { useRecruitment } from '@/context/RecruitmentContext';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const { updateCandidate } = useRecruitment();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        setSuccessMessage('Pendaftaran akun berhasil! Silakan masuk dengan kata sandi Anda.');
        const emailParam = params.get('email');
        if (emailParam) {
          setEmail(emailParam);
        }
      }
    }
  }, []);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan lengkapi email dan password akun Anda.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Fetch candidate details from Firestore with timeout protection
      try {
        const fetchDoc = getDoc(doc(db, 'candidates', user.uid));
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore read timeout')), 4000)
        );
        const candidateDoc = (await Promise.race([fetchDoc, timeoutPromise])) as any;
        if (candidateDoc && candidateDoc.exists()) {
          const data = candidateDoc.data();
          updateCandidate({
            fullName: data.fullName || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
          });
        } else {
          // If candidate doc doesn't exist yet, automatically persist to Firestore candidates collection
          const candidateData = {
            uid: user.uid,
            fullName: user.displayName || 'Kevina Maydiva Heriansaputri',
            email: user.email || email.trim().toLowerCase(),
            phone: '',
            role: 'candidate',
            applicationStatus: 'registered',
            createdAt: serverTimestamp(),
          };
          try {
            await setDoc(doc(db, 'candidates', user.uid), candidateData, { merge: true });
          } catch (writeErr) {
            console.warn('Could not backfill candidate doc to Firestore:', writeErr);
          }
          updateCandidate({
            fullName: candidateData.fullName,
            email: candidateData.email,
            phone: candidateData.phone,
          });
        }
      } catch (docErr) {
        console.warn('Could not retrieve candidate data from Firestore:', docErr);
        if (user.displayName || user.email) {
          updateCandidate({
            fullName: user.displayName || '',
            email: user.email || '',
          });
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Firebase login error:', err);
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Email atau kata sandi yang Anda masukkan salah.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan coba lagi beberapa saat lagi atau reset password.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Koneksi jaringan gagal. Periksa koneksi internet Anda.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      const user = result.user;

      // Fetch atau inisialisasi data kandidat di Firestore
      try {
        const candidateRef = doc(db, 'candidates', user.uid);
        const fetchDoc = getDoc(candidateRef);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore read timeout')), 4000)
        );
        const candidateDoc = (await Promise.race([fetchDoc, timeoutPromise])) as any;

        if (candidateDoc && candidateDoc.exists()) {
          const data = candidateDoc.data();
          updateCandidate({
            fullName: data.fullName || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || user.phoneNumber || '',
          });
        } else {
          // Buat record profil kandidat baru jika pertama kali masuk dengan akun Google
          const newCandidate = {
            uid: user.uid,
            fullName: user.displayName || 'Kandidat Asia Plastik',
            email: user.email || '',
            phone: user.phoneNumber || '',
            photoURL: user.photoURL || '',
            role: 'candidate',
            applicationStatus: 'registered',
            authProvider: 'google',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          };
          try {
            await setDoc(candidateRef, newCandidate, { merge: true });
          } catch (writeErr) {
            console.warn('Could not persist new Google candidate to Firestore:', writeErr);
          }
          updateCandidate({
            fullName: newCandidate.fullName,
            email: newCandidate.email,
            phone: newCandidate.phone,
          });
        }
      } catch (docErr) {
        console.warn('Firestore sync warning during Google sign-in:', docErr);
        if (user.displayName || user.email) {
          updateCandidate({
            fullName: user.displayName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
          });
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Firebase Google sign-in error:', err);
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        // Pengguna menutup jendela popup secara mandiri
        return;
      }
      let msg = 'Gagal masuk dengan Google. Silakan coba kembali.';
      if (err.code === 'auth/popup-blocked') {
        msg = 'Jendela popup Google terblokir oleh browser. Harap izinkan popup di browser Anda.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        msg = 'Akun dengan email ini sudah terdaftar dengan metode sandi. Silakan masuk menggunakan email & password.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Gagal terhubung ke jaringan. Periksa koneksi internet Anda.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Login dengan Google belum diaktifkan di Firebase Console. Harap aktifkan Google Provider.';
      }
      setErrorMessage(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setIsRecoveryLoading(true);
    try {
      await sendPasswordResetEmail(auth, recoveryEmail.trim());
      setRecoverySent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      // For security and user reassurance, mark as sent
      setRecoverySent(true);
    } finally {
      setIsRecoveryLoading(false);
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

        {successMessage && (
          <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Akun Pelamar
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="pl-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 shadow-sm transition-all"
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
              <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="pl-10 pr-10 h-11 text-sm rounded-xl border-slate-200 bg-white hover:border-sky-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 shadow-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Register Link placed above Ingat saya */}
          <div className="flex items-center justify-between text-xs pt-1 pb-0.5">
            <span className="text-slate-500">Belum punya akun?</span>
            <Link
              href="/register"
              className="font-bold text-sky-600 hover:text-sky-800 transition-colors"
            >
              Daftar Sekarang →
            </Link>
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
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memverifikasi Akun...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Masuk ke Portal
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider OR - Sesuai Referensi Gambar 1 */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-slate-200/90" />
          <span className="absolute px-3.5 py-0.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#F0F7FF] rounded-full select-none">
            OR
          </span>
        </div>

        {/* Tombol Masuk dengan Google - Sesuai Referensi Gambar 1 */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-11 sm:h-12 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50/90 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2 text-slate-500 text-xs">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-sky-600 rounded-full animate-spin" />
              Menghubungkan akun Google...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2.5">
              <GoogleIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
              <span>Masuk dengan Google</span>
            </span>
          )}
        </button>
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
        description="Kami akan mengirimkan instruksi dan tautan verifikasi ke email Anda via Firebase Auth."
      >
        {!recoverySent ? (
          <form onSubmit={handleSendRecovery} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                <Input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="nama@email.com"
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
                disabled={isRecoveryLoading}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md shadow-sky-600/20"
              >
                {isRecoveryLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
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
                Jika email <strong className="text-slate-800">{recoveryEmail}</strong> terdaftar, tautan pengaturan ulang kata sandi telah dikirim ke kotak masuk atau folder spam Anda.
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

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

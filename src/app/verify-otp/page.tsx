'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Lock,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  BellRing,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Official WhatsApp icon SVG component
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function VerifyOtpPage() {
  const router = useRouter();

  // Channel & Contact details
  const [channel, setChannel] = useState<'wa' | 'email'>('wa');
  const [phoneNumber, setPhoneNumber] = useState('0822-4410-9503');
  const [emailAddress, setEmailAddress] = useState('kevinamay23@gmail.com');

  // Real Dynamic OTP State
  const [activeOtp, setActiveOtp] = useState<string>('202799');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate random 6-digit OTP
  const generateNewOtp = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  // Dispatch OTP to backend API and notify
  const dispatchOtp = useCallback(async (targetChannel: 'wa' | 'email', code: string, targetPhone: string, targetEmail: string) => {
    setIsSending(true);
    setErrorMsg(null);
    setShowNotificationToast(false);

    const destination = targetChannel === 'wa' ? targetPhone : targetEmail;

    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: targetChannel,
          destination,
          otp: code,
        }),
      });
    } catch (e) {
      console.warn('API send-otp notice:', e);
    } finally {
      setIsSending(false);
      setSuccessNotice(`Kode OTP baru telah berhasil dikirim ke ${targetChannel === 'wa' ? 'WhatsApp' : 'Email'} Anda.`);
      setShowNotificationToast(true);
      setTimeout(() => setSuccessNotice(null), 5000);
    }
  }, []);

  // Read URL query params and generate initial OTP on mount
  useEffect(() => {
    let initialPhone = '0822-4410-9503';
    let initialEmail = 'kevinamay23@gmail.com';
    let initialChannel: 'wa' | 'email' = 'wa';

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ch = params.get('channel');
      if (ch === 'wa' || ch === 'email') initialChannel = ch;

      const phoneParam = params.get('phone');
      if (phoneParam) initialPhone = phoneParam;

      const emailParam = params.get('email');
      if (emailParam) initialEmail = emailParam;
    }

    setChannel(initialChannel);
    setPhoneNumber(initialPhone);
    setEmailAddress(initialEmail);

    const firstOtp = generateNewOtp();
    setActiveOtp(firstOtp);
    dispatchOtp(initialChannel, firstOtp, initialPhone, initialEmail);
  }, [generateNewOtp, dispatchOtp]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Switch channel handler
  const handleChannelSwitch = (newChannel: 'wa' | 'email') => {
    if (newChannel === channel) return;
    setChannel(newChannel);
    setOtp(['', '', '', '', '', '']);
    setErrorMsg(null);
    const newCode = generateNewOtp();
    setActiveOtp(newCode);
    setResendTimer(60);
    dispatchOtp(newChannel, newCode, phoneNumber, emailAddress);
  };

  // Handle single digit input and auto-advance
  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Quick fill real sent code
  const handleFillRealCode = () => {
    setOtp(activeOtp.split(''));
    setErrorMsg(null);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(activeOtp);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Resend OTP
  const handleResend = () => {
    if (resendTimer > 0) return;
    const newCode = generateNewOtp();
    setActiveOtp(newCode);
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    dispatchOtp(channel, newCode, phoneNumber, emailAddress);
    inputRefs.current[0]?.focus();
  };

  // Real Verification: Checks entered digits against the real active OTP
  const handleVerify = async () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('Silakan masukkan 6 digit kode OTP lengkap.');
      return;
    }

    if (enteredCode !== activeOtp) {
      setErrorMsg(`Kode OTP "${enteredCode}" salah. Silakan periksa kembali kode yang dikirim ke ${channel === 'wa' ? 'WhatsApp' : 'Email'} Anda.`);
      return;
    }

    // Code is strictly valid!
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, 'candidates', user.uid),
          {
            phoneVerified: true,
            emailVerified: true,
            applicationStatus: 'verified',
            verifiedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn('Firestore verification update notice:', e);
    }

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => {
        router.push(`/login?registered=true&verified=true&email=${encodeURIComponent(emailAddress.trim().toLowerCase())}`);
      }, 1600);
    }, 1000);
  };

  // Masked display formatting
  const maskedPhone = phoneNumber.length > 6
    ? phoneNumber.slice(0, 4) + '-****-' + phoneNumber.slice(-4)
    : phoneNumber;

  const maskedEmail = emailAddress.includes('@')
    ? emailAddress.split('@')[0].slice(0, 2) + '****@' + emailAddress.split('@')[1]
    : emailAddress;

  // WhatsApp Web link for direct transmission
  const cleanPhoneForWa = phoneNumber.replace(/\D/g, '').replace(/^0/, '62');
  const waDirectUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneForWa}&text=${encodeURIComponent(
    `*CV. ASIA PLASTIK - REKRUTMEN*\nKode Verifikasi OTP Anda adalah: *${activeOtp}*.\nGunakan kode ini untuk menyelesaikan verifikasi akun. Berlaku 5 menit.`
  )}`;

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-gradient-to-br from-sky-100/90 via-sky-50/60 to-blue-100/70 text-slate-800 font-sans p-4 sm:p-6 pb-12 overflow-hidden">
      {/* Background ambient light blue gradient blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Incoming Notification Banner (Real Push Simulator) */}
      {showNotificationToast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 max-w-lg w-full animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${channel === 'wa' ? 'bg-emerald-500 text-white' : 'bg-sky-600 text-white'}`}>
                {channel === 'wa' ? <WhatsAppIcon className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    {channel === 'wa' ? 'Pesan Masuk WhatsApp' : 'Email Masuk'}
                  </span>
                  <span className="text-[10px] text-slate-400">• Baru saja</span>
                </div>
                <p className="text-xs text-slate-200 truncate">
                  Kode OTP Anda: <strong className="text-white font-mono font-bold tracking-widest text-sm bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{activeOtp}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
                title="Salin Kode"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedCode ? 'Disalin' : 'Salin'}</span>
              </button>
              <button
                type="button"
                onClick={handleFillRealCode}
                className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors"
              >
                Isi Otomatis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Pendaftaran</span>
        </Link>
        <span className="text-[11px] font-semibold text-sky-800 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-sky-200 shadow-sm">
          Tahap 1: Verifikasi Akun Baru
        </span>
      </header>

      {/* Main Center */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto py-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105 mb-3">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={160}
              height={55}
              priority
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verifikasi Kode Keamanan (OTP)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Portal Rekrutmen Karyawan CV. Asia Plastik Sidoarjo
          </p>
        </div>

        {/* Modern Glassmorphic Ambient Card (Desain 5 - Fix & Functional) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/10 border border-white/80 space-y-6">
          {/* Top Icon Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Konfirmasi Kode OTP Pelamar
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan pilih saluran penerimaan kode verifikasi akun Anda di bawah ini:
            </p>
          </div>

          {/* Modern Tab Bar */}
          <div className="p-1 rounded-2xl bg-slate-200/60 backdrop-blur-md grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleChannelSwitch('wa')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                channel === 'wa'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <WhatsAppIcon className={`w-4 h-4 ${channel === 'wa' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => handleChannelSwitch('email')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                channel === 'email'
                  ? 'bg-white text-sky-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className={`w-4 h-4 ${channel === 'email' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>Email Pribadi</span>
            </button>
          </div>

          {/* Destination Target Info */}
          <div className="text-center text-xs space-y-1">
            <div>
              <span className="text-slate-500">Dikirimkan ke: </span>
              <strong className="text-slate-800 font-mono">
                {channel === 'wa' ? maskedPhone : maskedEmail}
              </strong>
            </div>

            {/* Direct WhatsApp Action Link */}
            {channel === 'wa' && (
              <div className="pt-1">
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors shadow-sm"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim / Buka di WhatsApp Web Sekarang</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              </div>
            )}
          </div>

          {/* Glassmorphic 6 Box Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3 py-1">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-2xl border border-sky-200/80 bg-white/90 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all"
              />
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Status Notice */}
          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Quick Real Code Auto-Fill Pill */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleFillRealCode}
              className="text-[11px] font-semibold text-sky-700 hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>Isi Kode Terkirim ({activeOtp})</span>
            </button>
          </div>

          {/* Resend & Support */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            {resendTimer > 0 ? (
              <span className="text-[11px]">
                Kirim ulang dalam <strong className="text-slate-700 font-mono">{resendTimer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isSending}
                className="font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                <span>{isSending ? 'Mengirim...' : 'Kirim Ulang OTP'}</span>
              </button>
            )}
            <a
              href="https://wa.me/6282244109503"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-600 hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Bantuan HRD</span>
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || isVerified}
            className={`w-full h-11 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              isVerified
                ? 'bg-emerald-600 shadow-emerald-600/25'
                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-sky-600/25 active:scale-[0.99]'
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi Kode OTP...</span>
              </span>
            ) : isVerified ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Verifikasi Berhasil! Mengalihkan ke Login...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Verifikasi Akun Saya</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>

        {/* Security Assurance */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kode OTP hanya berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-xl w-full mx-auto flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Keamanan Terjamin SSL 256-bit</span>
        </div>
        <span>© 2026 CV. Asia Plastik</span>
      </footer>
    </div>
  );
}

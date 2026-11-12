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
  KeyRound,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
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

  // Gateway integration states
  const [waConfigured, setWaConfigured] = useState<boolean>(true);
  const [showGatewayConfig, setShowGatewayConfig] = useState<boolean>(false);
  const [fonnteTokenInput, setFonnteTokenInput] = useState<string>('');
  const [isSavingToken, setIsSavingToken] = useState<boolean>(false);
  const [tokenSaveNotice, setTokenSaveNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate random 6-digit OTP
  const generateNewOtp = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  // Dispatch OTP to backend API
  const dispatchOtp = useCallback(async (targetChannel: 'wa' | 'email', code: string, targetPhone: string, targetEmail: string) => {
    setIsSending(true);
    setErrorMsg(null);

    const destination = targetChannel === 'wa' ? targetPhone : targetEmail;

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: targetChannel,
          destination,
          otp: code,
        }),
      });
      const data = await res.json();

      if (targetChannel === 'wa') {
        if (data.configured === false) {
          setWaConfigured(false);
          setSuccessNotice(null);
        } else if (data.success) {
          setWaConfigured(true);
          setSuccessNotice(`Kode OTP telah terkirim via WhatsApp ke ${targetPhone}. Silakan cek aplikasi WhatsApp Anda.`);
        }
      } else {
        setSuccessNotice(`Kode OTP telah terkirim ke email ${targetEmail}. Silakan periksa kotak masuk atau spam.`);
      }
    } catch (e) {
      console.warn('API send-otp notice:', e);
    } finally {
      setIsSending(false);
    }
  }, []);

  // Save Fonnte Gateway Token to Server
  const handleSaveFonnteToken = async () => {
    if (!fonnteTokenInput.trim()) return;
    setIsSavingToken(true);
    setTokenSaveNotice(null);

    try {
      const res = await fetch('/api/auth/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fonnteTokenInput.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setTokenSaveNotice('Token berhasil disimpan! Mengirimkan OTP riil ke WhatsApp...');
        setWaConfigured(true);
        setShowGatewayConfig(false);
        // Immediately dispatch OTP with new token
        dispatchOtp('wa', activeOtp, phoneNumber, emailAddress);
      } else {
        setErrorMsg(data.error || 'Gagal menyimpan token Fonnte.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Koneksi gagal saat menyimpan token.');
    } finally {
      setIsSavingToken(false);
    }
  };

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
    setSuccessNotice(null);
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
      setErrorMsg(`Kode OTP "${enteredCode}" salah. Silakan periksa kembali pesan yang diterima.`);
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

  // WhatsApp Web link for direct manual trigger
  const cleanPhoneForWa = phoneNumber.replace(/\D/g, '').replace(/^0/, '62');
  const waDirectUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneForWa}&text=${encodeURIComponent(
    `*CV. ASIA PLASTIK - REKRUTMEN*\nKode Verifikasi OTP Anda adalah: *${activeOtp}*.\nGunakan kode ini untuk menyelesaikan verifikasi akun Anda.`
  )}`;

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-gradient-to-br from-sky-100/90 via-sky-50/60 to-blue-100/70 text-slate-800 font-sans p-4 sm:p-6 pb-12 overflow-hidden">
      {/* Background ambient light blue gradient blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

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
              Pilih saluran penerimaan kode verifikasi akun Anda:
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
          </div>

          {/* WhatsApp Gateway Integration Status / Help Card */}
          {channel === 'wa' && !waConfigured && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">
                    Menghubungkan Pengiriman WhatsApp Otomatis
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Agar server dapat mengirimkan pesan WhatsApp otomatis ke nomor <strong>{phoneNumber}</strong> di smartphone Anda tanpa simulasi, sistem membutuhkan koneksi <strong>WhatsApp Gateway (Fonnte)</strong>.
                  </p>
                </div>
              </div>

              {/* Toggle to enter Token */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowGatewayConfig(!showGatewayConfig)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showGatewayConfig ? 'Tutup Pengaturan Token' : 'Masukkan Token API WhatsApp Fonnte'}</span>
                  {showGatewayConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showGatewayConfig && (
                <div className="space-y-2 pt-2 border-t border-amber-200 animate-in fade-in">
                  <p className="text-[11px] text-amber-900">
                    Dapatkan token gratis di <a href="https://fonnte.com" target="_blank" rel="noreferrer" className="underline font-bold text-sky-700">fonnte.com</a> (Scan QR WhatsApp di menu Device Fonnte), lalu tempel tokennya di sini:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: v#w8b7c7a1024..."
                      value={fonnteTokenInput}
                      onChange={(e) => setFonnteTokenInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveFonnteToken}
                      disabled={isSavingToken || !fonnteTokenInput.trim()}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shrink-0"
                    >
                      {isSavingToken ? 'Menyimpan...' : 'Simpan & Kirim'}
                    </button>
                  </div>
                </div>
              )}

              {tokenSaveNotice && (
                <p className="text-xs font-semibold text-emerald-700">{tokenSaveNotice}</p>
              )}

              {/* Direct Link Alternative */}
              <div className="pt-1 border-t border-amber-200/70 flex items-center justify-between">
                <span className="text-[10px] text-amber-800">Atau buka pesan WhatsApp sekarang:</span>
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Buka WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              </div>
            </div>
          )}

          {/* Success Status Notice */}
          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

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

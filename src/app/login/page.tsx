'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PrototypeSwitcher, VariantOption } from '@/components/prototype/PrototypeSwitcher';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';
import { VariantD } from './variants/VariantD';
import { VariantE } from './variants/VariantE';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail, ShieldAlert } from 'lucide-react';

const LOGIN_VARIANTS: VariantOption[] = [
  {
    id: 'A',
    name: 'Split Executive Corporate',
    desc: '50/50 split layout: form bersih putih/biru di kiri & foto gedung di kanan',
  },
  {
    id: 'B',
    name: 'Floating Glassmorphic Card',
    desc: 'Kartu floating daylight di tengah dengan bingkai arsitektur gedung',
  },
  {
    id: 'C',
    name: 'Clean Minimalist Focus',
    desc: 'Form ramping terfokus dengan banner panorama fasad gedung di atas kartu',
  },
  {
    id: 'D',
    name: 'Modern Split Dual Portal',
    desc: 'Tab pemilih Akun Pelamar vs Staff HR dengan visual sudut 3D gedung',
  },
  {
    id: 'E',
    name: 'Panoramic Daylight Canvas',
    desc: 'Gedung penuh layar dengan dock kaca daylight floating di sisi kiri',
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Variant selector (?variant=A/B/C/D/E)
  const paramVariant = searchParams.get('variant')?.toUpperCase() || 'A';
  const validVariants = ['A', 'B', 'C', 'D', 'E'];
  const [selectedVariant, setSelectedVariant] = useState(
    validVariants.includes(paramVariant) ? paramVariant : 'A'
  );

  // Sync state if URL changes
  React.useEffect(() => {
    if (paramVariant && validVariants.includes(paramVariant)) {
      setSelectedVariant(paramVariant);
    }
  }, [paramVariant]);

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
    }, 900);
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySent(true);
  };

  const sharedProps = {
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
    openForgotPassword: () => {
      setRecoveryEmail(email);
      setRecoverySent(false);
      setForgotModalOpen(true);
    },
  };

  return (
    <>
      {/* Dynamic Variant Render */}
      {selectedVariant === 'A' && <VariantA {...sharedProps} />}
      {selectedVariant === 'B' && <VariantB {...sharedProps} />}
      {selectedVariant === 'C' && <VariantC {...sharedProps} />}
      {selectedVariant === 'D' && <VariantD {...sharedProps} />}
      {selectedVariant === 'E' && <VariantE {...sharedProps} />}

      {/* Floating Interactive Prototype Switcher Bar */}
      <PrototypeSwitcher
        variants={LOGIN_VARIANTS}
        currentVariant={selectedVariant}
        onSelectVariant={(newId) => setSelectedVariant(newId)}
      />

      {/* Corporate Password Reset Modal */}
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
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
            <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <span>Memuat Portal Login...</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

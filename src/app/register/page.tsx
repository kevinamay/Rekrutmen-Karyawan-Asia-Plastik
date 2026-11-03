'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { PrototypeSwitcher, PrototypeVariantInfo } from '@/components/prototype/PrototypeSwitcher';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';
import { VariantD } from './variants/VariantD';
import { VariantE } from './variants/VariantE';

const PROTOTYPE_VARIANTS: PrototypeVariantInfo[] = [
  {
    id: 'A',
    name: 'Corporate Split Enterprise',
    description: 'Split 50/50: Foto megah lini pabrik & logo putih di kiri, formulir lengkap di kanan',
  },
  {
    id: 'B',
    name: 'Floating Glass Centered Card',
    description: 'Kanvas gudang logistik penuh dengan kartu kaca melayang elegan & pendaftaran cepat',
  },
  {
    id: 'C',
    name: 'Industrial Visual Highlights',
    description: 'Tiga kartu sorotan fasilitas pabrik berdampingan dengan formulir akun kandidat',
  },
  {
    id: 'D',
    name: 'Factory Storyboard & Editorial Dark',
    description: 'Nuansa dark executive dengan galeri fasilitas pabrik dan form berstandar presisi',
  },
  {
    id: 'E',
    name: 'Minimalist Live Facility Window',
    description: 'Formulir presisi minimalis dengan jendela arsitektur mesin & testimoni teknisi',
  },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateCandidate } = useRecruitment();

  const variantParam = searchParams.get('variant')?.toUpperCase() || 'A';
  const currentVariant = ['A', 'B', 'C', 'D', 'E'].includes(variantParam) ? variantParam : 'A';

  const [fullName, setFullName] = useState('Pratama Ardiansyah');
  const [phone, setPhone] = useState('081234567890');
  const [email, setEmail] = useState('pratama.ardiansyah@gmail.com');
  const [password, setPassword] = useState('AsiaPlastik2026!');
  const [confirmPassword, setConfirmPassword] = useState('AsiaPlastik2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectVariant = (variantId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('variant', variantId);
    router.replace(`/register?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Update candidate state in recruitment context
    updateCandidate({
      fullName,
      email,
    });

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to profile setup in candidate dashboard
      router.push('/dashboard/profile');
    }, 850);
  };

  const formProps = {
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
  };

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Prototype Variant Rendering */}
      {currentVariant === 'A' && <VariantA {...formProps} />}
      {currentVariant === 'B' && <VariantB {...formProps} />}
      {currentVariant === 'C' && <VariantC {...formProps} />}
      {currentVariant === 'D' && <VariantD {...formProps} />}
      {currentVariant === 'E' && <VariantE {...formProps} />}

      {/* Floating Bottom Prototype Switcher Bar */}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        currentVariant={currentVariant}
        onSelectVariant={handleSelectVariant}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          Memuat prototype pendaftaran...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

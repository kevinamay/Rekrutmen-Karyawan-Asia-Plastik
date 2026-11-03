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
    name: 'Corporate Split Showcase',
    description: 'Split 50/50 dengan foto megah pabrik di sisi kiri dan form modern di kanan',
  },
  {
    id: 'B',
    name: 'Floating Glass 2-Step Card',
    description: 'Latar belakang gudang logistik penuh dengan wizard kartu melayang 2-langkah',
  },
  {
    id: 'C',
    name: 'Role-Driven Catalog Grid',
    description: 'Katalog visual posisi kerja dengan form pendaftaran terintegrasi di sampingnya',
  },
  {
    id: 'D',
    name: 'Factory Storyboard & Editorial',
    description: 'Tur visual 3 fasilitas pabrik nyata berdampingan dengan form pendaftaran',
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

  const roleFromUrl = searchParams.get('role');

  const [fullName, setFullName] = useState('Pratama Ardiansyah');
  const [email, setEmail] = useState('pratama.ardiansyah@gmail.com');
  const [password, setPassword] = useState('AsiaPlastik2026!');
  const [selectedRole, setSelectedRole] = useState(
    roleFromUrl || 'Supervisor Quality Control (QC)'
  );
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableRoles = [
    { title: 'Supervisor Quality Control (QC)', department: 'Quality Assurance & Lab Mutu', openings: 2 },
    { title: 'Supervisor Teknik Mesin', department: 'Engineering & Maintenance', openings: 1 },
    { title: 'Internal Auditor', department: 'Finance & Governance', openings: 1 },
    { title: 'Admin Penjualan', department: 'Commercial & Sales B2B', openings: 2 },
    { title: 'Lowongan Magang Nasional', department: 'People Development & Operations', openings: 5 },
  ];

  const handleSelectVariant = (variantId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('variant', variantId);
    router.replace(`/register?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Alamat email aktif wajib diisi';
    if (!password || password.length < 8) newErrors.password = 'Kata sandi minimal 8 karakter';
    if (!agreeTerms) newErrors.terms = 'Silakan setujui ketentuan pendaftaran';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    updateCandidate({
      fullName,
      email,
      appliedRole: selectedRole,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard/profile');
    }, 900);
  };

  const formProps = {
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Memuat prototype pendaftaran...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Factory,
  Award,
  Users2,
  Sparkles,
  Phone,
  Mail,
  X,
} from 'lucide-react';

// ==========================================
// MOCK DATA: 10 Lowongan CV. Asia Plastik
// ==========================================
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  category: 'Quality & Teknik' | 'Operasional & Sales' | 'Finance & Pajak' | 'Legal & K3' | 'Magang';
  location: string;
  type: string;
  education: string;
  experience: string;
  deadline: string;
  description: string;
  requirements: string[];
}

const JOB_VACANCIES: JobOpening[] = [
  {
    id: 'magang-nasional',
    title: 'Lowongan Magang Nasional',
    department: 'People Development & Operations',
    category: 'Magang',
    location: 'Sidoarjo / Surabaya, Jawa Timur',
    type: 'Internship / Magang (6 Bulan)',
    education: 'D3 / S1 (Mahasiswa Tingkat Akhir / Fresh Graduate)',
    experience: 'Tanpa Pengalaman / Fresh Graduate',
    deadline: '28 Februari 2027',
    description:
      'Program magang komprehensif untuk mahasiswa dan lulusan baru guna mendapatkan pengalaman operasional langsung dalam industri manufaktur plastik modern.',
    requirements: [
      'Mahasiswa aktif semester akhir atau fresh graduate jurusan Teknik / Manajemen / Akuntansi / Psikologi.',
      'Memiliki motivasi belajar tinggi dan ketertarikan pada industri manufaktur.',
      'Mampu berkomunikasi dengan baik dan bekerja secara tim.',
      'Bersedia mengikuti program magang onsite penuh waktu.',
    ],
  },
  {
    id: 'spv-qc',
    title: 'Supervisor Quality Control (QC)',
    department: 'Quality Assurance & Control',
    category: 'Quality & Teknik',
    location: 'Pabrik Utama Sidoarjo, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Teknik Kimia / Teknik Industri / Kimia MIPA',
    experience: 'Minimal 3 tahun di industri plastik/manufaktur',
    deadline: '15 Maret 2027',
    description:
      'Bertanggung jawab memimpin tim QC dalam inspeksi bahan baku biji plastik, pengawasan parameter proses ekstrusi/injeksi, hingga pengujian standar mutu produk jadi.',
    requirements: [
      'Pendidikan S1 Teknik Kimia, Teknik Industri, atau jurusan relevan.',
      'Pengalaman min. 3 tahun sebagai QC Supervisor di manufaktur plastik/kemasan.',
      'Menguasai instrumentasi pengujian plastik (MFI, Tensile test, Density, dll).',
      'Paham implementasi ISO 9001:2015 dan sistem manajemen mutu industri.',
    ],
  },
  {
    id: 'internal-auditor',
    title: 'Internal Auditor',
    department: 'Internal Audit & Governance',
    category: 'Finance & Pajak',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Akuntansi / Keuangan',
    experience: 'Minimal 2-3 tahun sebagai Auditor',
    deadline: '20 Maret 2027',
    description:
      'Melaksanakan audit operasional dan keuangan, mengevaluasi efektivitas sistem pengendalian internal, serta memberikan rekomendasi perbaikan proses bisnis.',
    requirements: [
      'S1 Akuntansi dari universitas terakreditasi.',
      'Pengalaman kerja min. 2 tahun di Kantor Akuntan Publik (KAP) atau Internal Audit korporasi.',
      'Mampu menganalisis SOP pabrik, inventori gudang, dan mitigasi risiko operasional.',
      'Memiliki sertifikasi QIA atau CIA menjadi nilai tambah.',
    ],
  },
  {
    id: 'spv-teknik',
    title: 'Supervisor Teknik',
    department: 'Engineering & Maintenance',
    category: 'Quality & Teknik',
    location: 'Pabrik Utama Sidoarjo, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Teknik Mesin / Teknik Elektro / Mekatronika',
    experience: 'Minimal 3-4 tahun di perawatan mesin industri',
    deadline: '18 Maret 2027',
    description:
      'Mengkoordinasikan preventive dan corrective maintenance untuk seluruh lini mesin cetak plastik, utilitas kompresor/chiller, serta optimalisasi efisiensi energi pabrik.',
    requirements: [
      'S1 Teknik Mesin / Elektro / Mekatronika.',
      'Berpengalaman menangani mesin blowing, injection moulding, atau thermoforming.',
      'Memahami PLC, sistem hidrolik, pneumatik, dan kelistrikan 3-phase industri.',
      'Mampu memimpin tim teknisi maintenance dan menyusun jadwal TPM (Total Productive Maintenance).',
    ],
  },
  {
    id: 'admin-penjualan',
    title: 'Admin Penjualan',
    department: 'Commercial & Sales Operations',
    category: 'Operasional & Sales',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'D3 / S1 Semua Jurusan',
    experience: 'Minimal 1-2 tahun di bidang administrasi sales',
    deadline: '25 Maret 2027',
    description:
      'Mengelola alur administrasi penjualan mulai dari penerimaan Purchase Order (PO) pelanggan B2B, penerbitan surat jalan, hingga koordinasi pengiriman armada logistik.',
    requirements: [
      'Pendidikan D3/S1 Manajemen, Administrasi Bisnis, atau setara.',
      'Mahir mengoperasikan Microsoft Excel (VLOOKUP, Pivot Table) dan sistem ERP penjualan.',
      'Teliti, terbiasa bekerja dengan target waktu, dan memiliki komunikasi yang santun.',
      'Mampu membina hubungan baik dengan pelanggan distributor dan industri rekanan.',
    ],
  },
  {
    id: 'staff-purchasing',
    title: 'Staff Purchasing',
    department: 'Procurement & Supply Chain',
    category: 'Operasional & Sales',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Manajemen Logistik / Teknik Industri / Bisnis',
    experience: 'Minimal 1-2 tahun purchasing manufaktur',
    deadline: '22 Maret 2027',
    description:
      'Melakukan sourcing supplier bahan baku biji plastik (PP, PE, PET), masterbatch pewarna, dan sparepart mesin dengan harga bersaing serta kualitas terjamin.',
    requirements: [
      'S1 jurusan relevan dengan pengalaman procurement industri.',
      'Keahlian negosiasi harga dan pemahaman syarat kontrak dagang (Incoterms).',
      'Terbiasa memonitor lead time pengiriman bahan baku agar tidak menghambat lini produksi.',
      'Mampu berbahasa Inggris atau Mandarin menjadi nilai tambah untuk vendor impor.',
    ],
  },
  {
    id: 'staff-accounting',
    title: 'Staff Accounting',
    department: 'Finance & Accounting',
    category: 'Finance & Pajak',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Akuntansi',
    experience: 'Minimal 1-2 tahun di posisi akuntansi',
    deadline: '17 Maret 2027',
    description:
      'Mencatat transaksi harian, menyusun rekonsiliasi bank, mengelola buku besar, serta membantu penyiapan laporan keuangan periodik perusahaan.',
    requirements: [
      'Lulusan S1 Akuntansi dengan IPK minimal 3.00.',
      'Menguasai siklus akuntansi lengkap (jurnal, buku besar, neraca lajur, laporan laba rugi).',
      'Familiar dengan software akuntansi seperti SAP, Accurate, atau ERP manufaktur.',
      'Jujur, memiliki integritas tinggi, dan teliti dalam pembukuan angka.',
    ],
  },
  {
    id: 'staff-hse',
    title: 'Staff HSE (Health, Safety, Environment)',
    department: 'K3 & Lingkungan Hidup',
    category: 'Legal & K3',
    location: 'Pabrik Utama Sidoarjo, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 K3 / Teknik Lingkungan / Kesehatan Masyarakat',
    experience: 'Minimal 1-2 tahun di bidang K3 manufaktur',
    deadline: '24 Maret 2027',
    description:
      'Memastikan kepatuhan keselamatan kerja di area pabrik, melakukan inspeksi rutin potensi bahaya (HIRADC), serta mengelola pembuangan limbah B3 sesuai regulasi.',
    requirements: [
      'S1 K3, Teknik Lingkungan, atau Kesehatan Masyarakat.',
      'Wajib memiliki sertifikat Ahli K3 Umum (AK3U) yang masih berlaku dari Kemnaker.',
      'Memahami regulasi lingkungan hidup, PROPER, AMDAL/UKL-UPL, dan pengelolaan TPS Limbah B3.',
      'Tegas dalam menegakkan protokol keselamatan dan tanggap darurat bencana.',
    ],
  },
  {
    id: 'staff-legal',
    title: 'Staff Legal',
    department: 'Legal & Corporate Affairs',
    category: 'Legal & K3',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Ilmu Hukum',
    experience: 'Minimal 1-2 tahun legal korporasi',
    deadline: '27 Maret 2027',
    description:
      'Melakukan drafting dan review perjanjian kerjasama bisnis (kontrak supplier, vendor, B2B), mengurus perizinan operasional industri (OSS RBA), dan kepatuhan ketenagakerjaan.',
    requirements: [
      'S1 Ilmu Hukum dengan pemahaman hukum perdata dan hukum ketenagakerjaan.',
      'Pengalaman mereview kontrak komersial dan penanganan izin industri.',
      'Kemampuan komunikasi formal, drafting bahasa hukum yang presisi, dan negosiasi klausul.',
      'Memiliki pemahaman mengenai regulasi industri plastik dan lingkungan.',
    ],
  },
  {
    id: 'staff-pajak',
    title: 'Staff Pajak',
    department: 'Taxation & Finance',
    category: 'Finance & Pajak',
    location: 'Kantor Pusat Surabaya, Jawa Timur',
    type: 'Full Time (Tetap)',
    education: 'S1 Akuntansi / Perpajakan',
    experience: 'Minimal 1-2 tahun di bagian perpajakan',
    deadline: '19 Maret 2027',
    description:
      'Menghitung, memotong, menyetor, dan melaporkan seluruh kewajiban pajak perusahaan (PPh 21, PPh 23, PPh Final, dan PPN melalui e-Faktur) secara tepat waktu.',
    requirements: [
      'S1 Akuntansi / Manajemen Perpajakan.',
      'Memiliki sertifikat Brevet Pajak A & B.',
      'Menguasai aplikasi DJP Online, e-Faktur, e-Bupot, dan update regulasi perpajakan terbaru.',
      'Terbiasa menyiapkan dokumen pendukung untuk keperluan audit dan pemeriksaan pajak.',
    ],
  },
];

// ==========================================
// REUSABLE COMPONENT: JobCard
// ==========================================
interface JobCardProps {
  job: JobOpening;
  onSelect: (job: JobOpening) => void;
}

function JobCard({ job, onSelect }: JobCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            {job.department}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {job.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2.5">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Key Job Meta */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{job.education}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Batas Lamar: {job.deadline}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-5 mt-4 border-t border-blue-50/80 flex items-center gap-2.5">
        <button
          onClick={() => onSelect(job)}
          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-blue-200 text-xs font-semibold text-blue-900 hover:bg-blue-50/70 hover:border-blue-300 transition-colors"
        >
          Lihat Detail
        </button>
        <Link
          href={`/register?role=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}`}
          className="flex-1"
        >
          <button className="w-full text-center py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-colors flex items-center justify-center gap-1">
            <span>Apply Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

// ==========================================
// MAIN HOMEPAGE COMPONENT
// ==========================================
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJobModal, setActiveJobModal] = useState<JobOpening | null>(null);

  const categories = [
    'Semua',
    'Quality & Teknik',
    'Operasional & Sales',
    'Finance & Pajak',
    'Legal & K3',
    'Magang',
  ];

  // Filter jobs based on category and search query
  const filteredJobs = JOB_VACANCIES.filter((job) => {
    const matchesCategory =
      selectedCategory === 'Semua' || job.category === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* ==========================================
          TOP NAVIGATION HEADER
      ========================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Corporate Brand */}
          <Link href="/" className="flex items-center group py-1">
            <Image
              src="/assets/images/logos/logo.webp"
              alt="CV. Asia Plastik"
              width={160}
              height={55}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a
              href="#tentang"
              className="hover:text-blue-600 transition-colors"
            >
              Tentang Perusahaan
            </a>
            <a
              href="#lowongan"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Lowongan Kerja ({JOB_VACANCIES.length})
            </a>
            <a
              href="#tahapan"
              className="hover:text-blue-600 transition-colors"
            >
              Tahapan Seleksi
            </a>
            <a
              href="#kontak"
              className="hover:text-blue-600 transition-colors"
            >
              Kontak Kami
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-900 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                Masuk
              </button>
            </Link>
            <Link href="/register">
              <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5">
                <span>Daftar Akun</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ==========================================
          1. HERO SECTION (Top)
          Background image: /images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg
          Dark blue/gradient overlay: bg-blue-900/60
      ========================================== */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Factory/Warehouse Interior Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/WhatsApp Image 2026-10-23 at 15.47.56 (3).jpeg"
            alt="Pabrik CV Asia Plastik"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-transform duration-700 scale-105"
          />
        </div>

        {/* Natural dark vignette overlay (tanpa filter biru pekat agar foto pabrik & warnanya tetap terlihat jelas) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/35 to-slate-950/75" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16 sm:py-24 space-y-6">
          {/* Corporate Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Industri Manufaktur Plastik & Kemasan Berkualitas Tinggi</span>
          </div>

          {/* Bold, Professional Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            Bergabunglah Bersama Tim Kami{' '}
            <span className="block text-blue-400 font-extrabold mt-1 text-3xl sm:text-5xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Bangun Karir di CV. Asia Plastik
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Kami mengundang para profesional berpengalaman dan talenta muda berbakat
            untuk berinovasi bersama lini manufaktur modern, berintegritas, serta
            berorientasi pada keunggulan mutu nasional.
          </p>

          {/* CTA Button "Lihat Lowongan" with smooth scroll */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#lowongan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-black/40 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Briefcase className="w-5 h-5" />
              <span>Lihat Lowongan</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white font-semibold text-base border border-white/25 backdrop-blur-sm transition-all shadow-md shadow-black/20"
            >
              <span>Portal Masuk Pelamar</span>
            </Link>
          </div>

          {/* Industrial Trust Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-black text-white">10+</div>
              <div className="text-xs font-semibold text-blue-300">Posisi Dibuka</div>
              <div className="text-[11px] text-slate-300">Teknik hingga Magang</div>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs font-semibold text-blue-300">Transparan</div>
              <div className="text-[11px] text-slate-300">Tracking status seleksi</div>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-black text-white">ISO</div>
              <div className="text-xs font-semibold text-blue-300">Standar Mutu</div>
              <div className="text-[11px] text-slate-300">Manufaktur terstandarisasi</div>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-black text-white">AI</div>
              <div className="text-xs font-semibold text-blue-300">Smart Assessment</div>
              <div className="text-[11px] text-slate-300">Evaluasi objektif & cepat</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. OPEN VACANCIES SECTION (Job Board)
          Section background: bg-blue-50/50
          Grid: 1 col mobile, 2 col tablet, 3 col desktop
      ========================================== */}
      <section
        id="lowongan"
        className="py-16 sm:py-24 bg-blue-50/50 border-y border-blue-100/80 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 border border-blue-200">
              Peluang Karir Terbuka
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
              Lowongan Pekerjaan Terbaru
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Jelajahi daftar kesempatan berkarir di CV. Asia Plastik. Temukan peran
              yang selaras dengan keahlian serta aspirasi masa depan Anda.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama lowongan, keahlian, atau departemen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Counter Indicator */}
              <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-semibold text-slate-600 shrink-0">
                <span>
                  Menampilkan{' '}
                  <strong className="text-blue-900">{filteredJobs.length}</strong> dari{' '}
                  {JOB_VACANCIES.length} lowongan
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-700 underline text-xs"
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Kategori:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200/80 hover:border-blue-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive CSS Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={(selected) => setActiveJobModal(selected)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-blue-100 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">
                Tidak ada lowongan yang sesuai
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau pilih kategori lain untuk melihat lowongan yang tersedia.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                Tampilkan Semua Lowongan
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          COMPANY VALUE & WORKFLOW OVERVIEW
      ========================================== */}
      <section id="tentang" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
                Tentang CV. Asia Plastik
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight leading-snug">
                Pionir Manufaktur Plastik Berkualitas Tinggi di Indonesia
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Didirikan dengan komitmen tinggi terhadap kepuasan pelanggan industri,
                CV. Asia Plastik terus bertumbuh sebagai produsen plastik terpercaya
                dengan teknologi mesin presisi dan tenaga kerja yang profesional.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">
                      Standar Kualitas Ketat (Zero Defect Commitment)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Proses quality control berlapis dari seleksi biji plastik murni hingga pengujian beban mekanik.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">
                      Lingkungan Kerja Aman & Bersertifikasi K3
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Menjunjung tinggi standar keselamatan kerja (HSE) dan pengelolaan ramah lingkungan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">
                      Pengembangan Karir & Jenjang Profesional Jelas
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pelatihan berkesinambungan dan apresiasi performa bagi talenta internal perusahaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card / Highlights */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-base">
                    Mengapa Memilih Berkarir Bersama Kami?
                  </h3>
                  <p className="text-xs text-slate-500">Nilai-nilai unggul perusahaan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-sm">
                  <Users2 className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-blue-900">Budaya Kekeluargaan</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Kolaborasi tim suportif dan kepemimpinan yang terbuka.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-blue-900">Kompensasi Kompetitif</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Gaji pokok, tunjangan kesehatan (BPJS), dan bonus kinerja.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-sm">
                  <Factory className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-blue-900">Teknologi Terkini</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Bekerja langsung dengan mesin otomasi manufaktur modern.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-sm">
                  <Sparkles className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-blue-900">Pelatihan Reguler</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Upskilling teknis dan soft-skills kepemimpinan terarah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TAHAPAN SELEKSI REKRUTMEN
      ========================================== */}
      <section id="tahapan" className="py-16 sm:py-20 bg-blue-50/40 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 border border-blue-200">
              Alur Rekrutmen Online
            </span>
            <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              Tahapan Seleksi Terstruktur & Cepat
            </h2>
            <p className="text-sm text-slate-600">
              Setiap langkah seleksi dapat Anda pantau statusnya secara transparan melalui portal kandidat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30 absolute right-6 top-6">01</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-base text-blue-900">Pendaftaran & CV</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buat akun dan unggah berkas (CV, Ijazah, KTP). Sistem kami langsung memvalidasi profil awal Anda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30 absolute right-6 top-6">02</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-base text-blue-900">Tes Kompetensi Online</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uji pengetahuan teknis sesuai posisi yang dilamar dengan timer otomatis dan penilaian objektif.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30 absolute right-6 top-6">03</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-base text-blue-900">Asesmen Psikologi & AI</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asesmen profil psikologi dan simulasi wawancara interaktif untuk mengevaluasi keselarasan budaya kerja.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30 absolute right-6 top-6">04</span>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-base text-blue-900">Offering & Onboarding</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kandidat yang lolos akan menerima surat penawaran kerja (Offering Letter) resmi dan panduan onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          JOB DETAIL MODAL
      ========================================== */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                  {activeJobModal.department}
                </span>
                <h3 className="text-2xl font-black text-blue-900">
                  {activeJobModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {activeJobModal.location} • {activeJobModal.type}
                </p>
              </div>
              <button
                onClick={() => setActiveJobModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-blue-950 mb-1.5">
                  Deskripsi Pekerjaan:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeJobModal.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-blue-950 mb-2">
                  Kualifikasi & Persyaratan:
                </h4>
                <ul className="space-y-2">
                  {activeJobModal.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-600 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block">Pendidikan Minimal:</span>
                  <span className="font-semibold text-blue-950">
                    {activeJobModal.education}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pengalaman Kerja:</span>
                  <span className="font-semibold text-blue-950">
                    {activeJobModal.experience}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Batas Pendaftaran:</span>
                  <span className="font-semibold text-blue-950">
                    {activeJobModal.deadline}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status Lowongan:</span>
                  <span className="font-semibold text-emerald-600">
                    Aktif / Terbuka
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setActiveJobModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <Link
                href={`/register?role=${encodeURIComponent(activeJobModal.title)}&dept=${encodeURIComponent(activeJobModal.department)}`}
              >
                <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-colors flex items-center gap-1.5">
                  <span>Lamar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer id="kontak" className="mt-auto bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight">
                    CV. ASIA PLASTIK
                  </span>
                  <p className="text-xs text-blue-400 font-medium">
                    Corporate Recruitment & Talent Acquisition
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Industri manufaktur plastik terkemuka berfokus pada produk berkualitas tinggi,
                keselamatan kerja teruji, dan pengembangan karir profesional berkelanjutan.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#lowongan" className="hover:text-blue-400 transition-colors">
                    Daftar Lowongan ({JOB_VACANCIES.length})
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="hover:text-blue-400 transition-colors">
                    Profil Perusahaan
                  </a>
                </li>
                <li>
                  <a href="#tahapan" className="hover:text-blue-400 transition-colors">
                    Tahapan Rekrutmen
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-blue-400 transition-colors">
                    Portal Masuk Pelamar
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Hubungi HRD
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>karir@asiaplastik.co.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>(031) 891-2345 / 891-2346</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                  <span>Kawasan Industri Sidoarjo, Jawa Timur, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} CV. Asia Plastik. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p>
              Sistem Rekrutmen Karyawan Terpadu • Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

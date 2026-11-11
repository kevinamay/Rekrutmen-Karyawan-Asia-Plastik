export interface RecruitmentMilestone {
  stageNumber: number;
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  date: string;
  score?: number;
  evaluator?: string;
  summary: string;
  notes?: string;
}

export const ASIA_PLASTIK_STAGES: RecruitmentMilestone[] = [
  {
    stageNumber: 1,
    id: 'reg',
    title: 'Pendaftaran Akun & Registrasi Lamaran',
    subtitle: 'Verifikasi Email & Pilihan Posisi Kerja',
    status: 'completed',
    date: '28 Oktober 2026',
    score: 100,
    evaluator: 'Sistem Portal Otomatis',
    summary:
      'Akun pelamar terdaftar resmi untuk posisi Supervisor Quality Control (QC). Nomor registrasi pelamar ASP-2027-0891 telah diterbitkan.',
    notes: 'Email kevinamay23@gmail.com dan No. WhatsApp 0822-4410-9503 terverifikasi.',
  },
  {
    stageNumber: 2,
    id: 'bio',
    title: 'Pengisian Formulir Biodata Diri',
    subtitle: 'e-KTP, Domisili, Riwayat Pendidikan & K3',
    status: 'completed',
    date: '29 Oktober 2026',
    score: 100,
    evaluator: 'Tim Verifikasi HRD',
    summary:
      'Seluruh kolom biodata diri, riwayat pendidikan S1 Teknik Kimia / Industri ITS, dan kontak darurat telah lengkap 100%.',
    notes: 'Domisili terdekat dengan pabrik CV. Asia Plastik di Sidoarjo.',
  },
  {
    stageNumber: 3,
    id: 'doc',
    title: 'Verifikasi Berkas & CV Screening',
    subtitle: 'Pemeriksaan Ijazah, KTP, SKCK & Portofolio Mutu',
    status: 'completed',
    date: '30 Oktober 2026',
    score: 94,
    evaluator: 'Senior Talent Acquisition & QC Lead',
    summary:
      'Kesesuaian berkas lamaran mencapai 94%. Memiliki sertifikasi ISO 9001:2015 Internal Auditor dan pengalaman pengawasan lini injeksi plastik.',
    notes: 'Seluruh berkas fisik asli wajib dibawa saat wawancara tatap muka.',
  },
  {
    stageNumber: 4,
    id: 'cbt',
    title: 'Ujian Kompetensi Teknis QC Manufaktur',
    subtitle: 'Defek Injeksi, ISO 9001 NCR, Lab MFI & Budaya 5R',
    status: 'completed',
    date: '31 Oktober 2026',
    score: 92,
    evaluator: 'Kepala Bagian Quality Assurance Pabrik',
    summary:
      'Lolos ambang batas kelulusan (Passing Grade: 80%). Menguasai penanganan cacat flash, pengujian laju alir polimer (MFI), dan isolasi produk cacat (NCR).',
    notes: 'Nilai ujian 92/100 direkomendasikan langsung oleh Manajer Mutu.',
  },
  {
    stageNumber: 5,
    id: 'interview',
    title: 'Wawancara Teknis Lapangan & Manajemen HRD',
    subtitle: 'Tatap Muka di Kantor Operasional Pabrik CV. Asia Plastik Sidoarjo',
    status: 'in_progress',
    date: '14 November 2026 • 09:30 WIB',
    evaluator: 'Bpk. Hendra Gunawan (Plant Mgr) & Ibu Ratna (HRD)',
    summary:
      'Undangan resmi wawancara tatap muka telah diterbitkan. Pelamar dijadwalkan hadir langsung di Pabrik Utama Sidoarjo untuk evaluasi kepemimpinan dan teknis lini.',
    notes: 'Wajib membawa berkas cetak dan mengenakan sepatu tertutup / safety shoes saat masuk area pabrik.',
  },
  {
    stageNumber: 6,
    id: 'mcu',
    title: 'Pemeriksaan Kesehatan Kerja (MCU Pabrik)',
    subtitle: 'Laboratorium Klinik Mitra CV. Asia Plastik',
    status: 'upcoming',
    date: 'Estimasi: 18 November 2026',
    summary:
      'Pemeriksaan fisik umum, tes fungsi paru, pendengaran, dan ketajaman mata bebas buta warna untuk memastikan kesiapan kerja di lingkungan manufaktur.',
    notes: 'Surat rujukan resmi klinik akan diberikan setelah lulus sesi wawancara.',
  },
  {
    stageNumber: 7,
    id: 'offering',
    title: 'Offering Letter & Penandatanganan Kontrak',
    subtitle: 'Penetapan Gaji, Tunjangan Produksi & Onboarding',
    status: 'upcoming',
    date: 'Estimasi: 22 November 2026',
    summary:
      'Penetapan status karyawan tetap dengan paket remunerasi kompetitif, tunjangan operasional shift, BPJS Ketenagakerjaan & Kesehatan, serta orientasi kerja.',
    notes: 'Hari pertama orientasi kerja direncanakan awal Desember 2026.',
  },
];

export const CANDIDATE_METRICS = {
  overallMatch: 93,
  rank: 'Top 3% Pelamar QC',
  competencies: [
    { label: 'Defek Injeksi & Ekstrusi Plastik', score: 95 },
    { label: 'Standar Mutu ISO 9001:2015 & NCR', score: 92 },
    { label: 'Pengujian Karakteristik Resin (MFI)', score: 90 },
    { label: 'Alat Ukur Presisi (Micrometer & Ultrasonic)', score: 96 },
    { label: 'Kepatuhan K3 & Budaya 5R Industri', score: 94 },
  ],
  interviewSchedule: {
    title: 'Wawancara Teknis Tim Pabrik & HRD',
    date: 'Kamis, 14 November 2026',
    time: '09:30 - 11:30 WIB',
    room: 'Ruang Rapat Utama Lt. 2 - Gedung Administrasi Pabrik',
    location: 'Kawasan Industri Tropodo, Jl. Industri Plastik No. 18, Waru, Sidoarjo',
    dresscode: 'Kemeja Formal Rapi, Celana Bahan, Sepatu Tertutup (Safety Shoes disukai)',
    bringItems: [
      'e-KTP Asli & 1 Lembar Fotokopi',
      'Ijazah & Transkrip Nilai Asli S1 Teknik',
      'Curriculum Vitae (CV) Cetak 1 Eksemplar',
      'Sertifikat Pelatihan ISO 9001 / K3 (Jika ada)',
      'Surat Bukti Panggilan Wawancara (Cetak / Tunjukkan dari HP)',
    ],
    contactPIC: {
      name: 'Ibu Ratna Dewi, S.Psi.',
      role: 'Head of Talent Acquisition & HRD',
      whatsapp: '0822-4410-9503',
      email: 'recruitment@asiaplastik.co.id',
    },
  },
};


import {
  Candidate,
  StageInfo,
  CVScreeningResult,
} from '@/types/recruitment';

export const INITIAL_STAGES: StageInfo[] = [
  {
    id: 'application',
    title: 'Pendaftaran Akun & Registrasi',
    shortTitle: 'Registrasi',
    description: 'Akun pelamar terverifikasi resmi di portal karir',
    route: '/login',
    status: 'completed',
    score: 100,
    completedAt: '28 Okt 2026',
  },
  {
    id: 'profile',
    title: 'Pengisian Formulir Biodata Diri',
    shortTitle: 'Biodata',
    description: 'Identitas e-KTP, kontak domisili, dan riwayat pendidikan S1',
    route: '/dashboard/profile',
    status: 'completed',
    score: 100,
    completedAt: '29 Okt 2026',
  },
  {
    id: 'cv-screening',
    title: 'Verifikasi Berkas & CV Screening',
    shortTitle: 'Berkas & CV',
    description: 'Pemeriksaan berkas lamaran, sertifikat ISO 9001, dan SKCK',
    route: '/dashboard/screening',
    status: 'passed',
    score: 94,
    completedAt: '30 Okt 2026',
  },
  {
    id: 'competency-test',
    title: 'Ujian Kompetensi Teknis QC',
    shortTitle: 'Tes Kompetensi',
    description: 'Uji kompetensi mutu manufaktur plastik, defek injeksi, MFI, dan K3',
    route: '/dashboard/competency-test',
    status: 'passed',
    score: 92,
    completedAt: '31 Okt 2026',
  },
  {
    id: 'interview',
    title: 'Wawancara Tatap Muka Pabrik',
    shortTitle: 'Wawancara',
    description: 'Evaluasi kepemimpinan & teknis operasional bersama Plant Manager',
    route: '/dashboard/status',
    status: 'in_progress',
  },
  {
    id: 'mcu',
    title: 'Pemeriksaan Kesehatan Kerja (MCU)',
    shortTitle: 'Tes MCU',
    description: 'Pemeriksaan fisik dan kesiapan kerja di lingkungan manufaktur',
    route: '/dashboard/status',
    status: 'pending',
  },
  {
    id: 'offering',
    title: 'Offering Letter & Kontrak Kerja',
    shortTitle: 'Offering',
    description: 'Penetapan status karyawan tetap, kompensasi, dan onboarding',
    route: '/dashboard/status',
    status: 'pending',
  },
];

export const INITIAL_CANDIDATE: Candidate = {
  id: 'ASP-2027-0891',
  fullName: 'Kevina Maydiva Heriansaputri',
  email: 'kevinamay23@gmail.com',
  phone: '082244109503',
  location: 'Sidoarjo, Jawa Timur (Pabrik CV. Asia Plastik)',
  headline: 'Pelamar Calon Supervisor Quality Control (QC)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary:
    'Kandidat pelamar kerja posisi Supervisor Quality Control (QC) CV. Asia Plastik di Sidoarjo. Lulusan S1 Teknik, memiliki sertifikasi ISO 9001:2015, dan pengalaman inspeksi mutu cetakan injeksi plastik.',
  appliedRole: 'Supervisor Quality Control (QC)',
  appliedDepartment: 'Quality Assurance & Control',
  appliedDate: '11 Februari 2027',
  currentStage: 'profile',
  overallScore: 93,
  finalDecision: 'pending',
};

export const MOCK_PASSED_CV_RESULT: CVScreeningResult = {
  fileName: 'CV_Kevina_Maydiva_QC_Supervisor.pdf',
  fileSize: '1.24 MB',
  uploadedAt: '30 Okt 2026 • 14:22 WIB',
  status: 'passed',
  matchScore: 94,
  verdict: 'Sangat Sesuai — Pelamar memenuhi kriteria utama kompetensi kendali mutu plastik.',
  matchingSkills: [
    { name: 'Inspeksi Mesin Injeksi & Ekstrusi Plastik', level: 'Mahir', relevance: 96 },
    { name: 'Sistem Manajemen Mutu ISO 9001:2015 & NCR', level: 'Bersertifikat', relevance: 95 },
    { name: 'Pengujian Laboratorium Melt Flow Index (MFI)', level: 'Mahir', relevance: 92 },
    { name: 'Alat Ukur Presisi (Point Micrometer & Ultrasonic)', level: 'Mahir', relevance: 95 },
    { name: 'Kesehatan & Keselamatan Kerja (K3) & Budaya 5R', level: 'Bersertifikat', relevance: 94 },
  ],
  missingSkills: ['Pengoperasian Mesin Thermoforming Kapasitas Tinggi (Non-kritis)'],
  keyStrengths: [
    'Memiliki pengalaman inspeksi mutu cetakan molding plastik dan sertifikat ISO 9001 Internal Auditor.',
    'Domisili Sidoarjo mempermudah mobilitas pengawasan shift pabrik.',
  ],
  recommendationNotes:
    'Kandidat sangat direkomendasikan untuk melanjutkan ke tahapan wawancara teknis lapangan bersama Plant Manager.',
  aiModelVersion: 'AsiaPlastik-HR-Screening-v2.1',
};

export const MOCK_DISQUALIFIED_CV_RESULT: CVScreeningResult = {
  fileName: 'CV_Pelamar_NonMatch.pdf',
  fileSize: '850 KB',
  uploadedAt: '30 Okt 2026 • 10:15 WIB',
  status: 'disqualified',
  matchScore: 42,
  verdict: 'Belum Memenuhi Syarat — Pengalaman teknis kendali mutu belum mencukupi standar minimum.',
  matchingSkills: [
    { name: 'Administrasi Umum', level: 'Dasar', relevance: 60 },
  ],
  missingSkills: [
    'Sertifikasi ISO 9001:2015',
    'Pengalaman Operasional Mesin Injeksi Plastik',
    'Pengujian Laboratorium Biji Plastik (MFI)',
  ],
  keyStrengths: ['Memiliki motivasi kerja tinggi.'],
  recommendationNotes: 'Berkas belum memenuhi kualifikasi teknis minimum Supervisor QC.',
  aiModelVersion: 'AsiaPlastik-HR-Screening-v2.1',
};

// Legacy stubs kept for type-safety
export const INITIAL_INTERVIEW_MESSAGES = [];
export const SUGGESTED_INTERVIEW_RESPONSES = [];
export const MOCK_PSYCH_QUESTIONS = [];
export const MOCK_COMPETENCY_QUESTIONS = [];
export const MOCK_PRACTICAL_TEST = {
  title: 'Ujian Teknis QC',
  description: 'Pengendalian mutu plastik',
  requirements: [],
};

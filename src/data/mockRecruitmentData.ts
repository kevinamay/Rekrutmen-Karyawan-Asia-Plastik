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
    completedAt: 'Hari Pendaftaran',
  },
  {
    id: 'profile',
    title: 'Pengisian Formulir Biodata Diri',
    shortTitle: 'Biodata',
    description: 'Identitas e-KTP, kontak domisili, dan riwayat pendidikan S1',
    route: '/dashboard/profile',
    status: 'in_progress',
  },
  {
    id: 'cv-screening',
    title: 'Verifikasi Berkas & CV Screening',
    shortTitle: 'Berkas & CV',
    description: 'Pemeriksaan berkas lamaran, scan KTP, ijazah, foto, dan SKCK',
    route: '/dashboard/screening',
    status: 'pending',
  },
  {
    id: 'competency-test',
    title: 'Ujian Kompetensi Teknis QC',
    shortTitle: 'Tes Kompetensi',
    description: 'Uji kompetensi mutu manufaktur plastik, defek injeksi, MFI, dan K3',
    route: '/dashboard/competency-test',
    status: 'pending',
  },
  {
    id: 'interview',
    title: 'Wawancara Tatap Muka Pabrik',
    shortTitle: 'Wawancara',
    description: 'Evaluasi kepemimpinan & teknis operasional bersama Plant Manager',
    route: '/dashboard/status',
    status: 'pending',
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
  id: '',
  fullName: '',
  email: '',
  phone: '',
  location: '',
  headline: '',
  avatarUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary: '',
  appliedRole: '',
  appliedDepartment: '',
  appliedDate: '',
  currentStage: 'application',
  overallScore: 0,
  finalDecision: 'pending',
};

export const MOCK_PASSED_CV_RESULT: CVScreeningResult = {
  fileName: '',
  fileSize: '',
  uploadedAt: '',
  status: 'passed',
  matchScore: 0,
  verdict: 'Berkas sedang diverifikasi oleh Tim HRD CV. Asia Plastik.',
  matchingSkills: [],
  missingSkills: [],
  keyStrengths: [],
  recommendationNotes: '',
  aiModelVersion: 'AsiaPlastik-HR-v2',
};

export const MOCK_DISQUALIFIED_CV_RESULT: CVScreeningResult = {
  fileName: '',
  fileSize: '',
  uploadedAt: '',
  status: 'disqualified',
  matchScore: 0,
  verdict: 'Berkas belum memenuhi kualifikasi minimum yang dipersyaratkan.',
  matchingSkills: [],
  missingSkills: [],
  keyStrengths: [],
  recommendationNotes: '',
  aiModelVersion: 'AsiaPlastik-HR-v2',
};

// Legacy stubs kept for backwards compatibility
export const INITIAL_INTERVIEW_MESSAGES = [];
export const SUGGESTED_INTERVIEW_RESPONSES = [];
export const MOCK_PSYCH_QUESTIONS = [];
export const MOCK_COMPETENCY_QUESTIONS = [];
export const MOCK_PRACTICAL_TEST = {
  title: 'Ujian Teknis QC',
  description: 'Pengendalian mutu plastik',
  requirements: [],
};

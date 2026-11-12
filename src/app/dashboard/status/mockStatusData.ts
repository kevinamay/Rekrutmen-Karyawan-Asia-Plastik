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

export function buildDynamicStages(params: {
  candidateName: string;
  candidateEmail: string;
  profileCompleted: boolean;
  uploadedCount: number;
  requiredDocsCount: number;
  psychologyScore: number | null;
  psychologyPassed: boolean | null;
  psychologyCompletedAt?: string | null;
  competencyScore: number | null;
  competencyPassed: boolean | null;
  competencyCompletedAt: string | null;
  appliedRole?: string;
}): RecruitmentMilestone[] {
  const {
    candidateName,
    candidateEmail,
    profileCompleted,
    uploadedCount,
    requiredDocsCount,
    psychologyScore,
    psychologyPassed,
    psychologyCompletedAt,
    competencyScore,
    competencyPassed,
    competencyCompletedAt,
    appliedRole,
  } = params;

  const docsCompleted = requiredDocsCount > 0 && uploadedCount >= requiredDocsCount;
  const psychoTaken = psychologyScore !== null;
  const psychoPassed = Boolean(psychologyPassed);
  const skillTaken = competencyScore !== null;
  const isInterviewActive = skillTaken && Boolean(competencyPassed);
  const targetRole = appliedRole || 'Supervisor Quality Control (QC)';

  return [
    {
      stageNumber: 1,
      id: 'reg',
      title: 'Pendaftaran Akun & Registrasi Lamaran',
      subtitle: 'Verifikasi Email & Pilihan Posisi Kerja',
      status: 'completed',
      date: 'Terverifikasi Resmi',
      score: 100,
      evaluator: 'Sistem Portal Otomatis',
      summary: `Akun pelamar ${candidateName || 'Kandidat'} terdaftar resmi untuk posisi ${targetRole} di portal karir CV. Asia Plastik.`,
      notes: `Email ${candidateEmail || 'pelamar'} aktif dan terverifikasi di database.`,
    },
    {
      stageNumber: 2,
      id: 'bio',
      title: 'Pengisian Formulir Biodata Diri',
      subtitle: 'e-KTP, Domisili, Riwayat Pendidikan & K3',
      status: profileCompleted ? 'completed' : 'in_progress',
      date: profileCompleted ? 'Telah Disimpan' : 'Sedang Berjalan',
      score: profileCompleted ? 100 : undefined,
      evaluator: 'Tim Verifikasi HRD',
      summary: profileCompleted
        ? 'Seluruh formulir data pribadi, kontak darurat, dan riwayat pendidikan telah tersimpan lengkap.'
        : 'Silakan isi seluruh kolom identitas KTP, nomor WhatsApp, riwayat pendidikan dan sertifikasi di menu Biodata Diri.',
      notes: profileCompleted ? 'Biodata siap diproses untuk verifikasi berkas.' : 'Data wajib dilengkapi sebelum verifikasi berkas.',
    },
    {
      stageNumber: 3,
      id: 'doc',
      title: 'Verifikasi Berkas & CV Screening',
      subtitle: 'Pemeriksaan Ijazah, KTP, SKCK & Portofolio Mutu',
      status: docsCompleted ? 'completed' : profileCompleted ? 'in_progress' : 'upcoming',
      date: docsCompleted ? 'Berkas Lengkap' : 'Menunggu Berkas',
      score: docsCompleted ? 95 : undefined,
      evaluator: 'Tim Talent Acquisition CV. Asia Plastik',
      summary: docsCompleted
        ? `Seluruh ${uploadedCount} dokumen berkas wajib telah berhasil diunggah dan terverifikasi oleh sistem.`
        : `Tersimpan ${uploadedCount} dari ${requiredDocsCount} berkas wajib. Silakan unggah dokumen yang diperlukan di menu Berkas & CV.`,
      notes: 'Seluruh berkas fisik asli wajib dibawa saat wawancara tatap muka di pabrik.',
    },
    {
      stageNumber: 4,
      id: 'psycho',
      title: 'Psikotes & Asesmen Potensi Kerja Online',
      subtitle: 'Kognitif, Kepribadian Forced-Choice, SJT, Kraepelin & Algoritma',
      status: psychoTaken ? 'completed' : docsCompleted ? 'in_progress' : 'upcoming',
      date: psychologyCompletedAt || (psychoTaken ? 'Telah Selesai' : docsCompleted ? 'Siap Dikerjakan' : 'Terkunci (Menunggu Berkas)'),
      score: psychoTaken ? (psychologyScore ?? undefined) : undefined,
      evaluator: 'Biro Psikologi & HRD Asesmen Terpadu',
      summary: psychoTaken
        ? psychoPassed
          ? `Lolos psikotes asesmen potensi kerja dengan nilai komposit ${psychologyScore}% (Passing Grade: 75%). Hasil menunjukkan ketelitian, daya tangkap, dan stabilitas emosi yang unggul.`
          : `Hasil psikotes telah dievaluasi dengan nilai ${psychologyScore}%. Passing grade kelulusan adalah 75%.`
        : 'Asesmen psikometrik online 5 subtes (Aptitude, Work Style, SJT, Kraepelin Digital, dan Flowchart Logika).',
      notes: psychoTaken
        ? (psychoPassed ? 'Akses Ujian Kompetensi Keahlian Teknis telah dibuka.' : 'Hasil psikotes tersimpan di database.')
        : 'Waktu per sub-tes kaku (rigid timer). Nilai minimal kelulusan 75%.',
    },
    {
      stageNumber: 5,
      id: 'cbt',
      title: 'Ujian Kompetensi Keahlian Teknis',
      subtitle: 'Defek Injeksi & Ekstrusi, ISO 9001 NCR, Pengujian Polimer & 5R',
      status: skillTaken ? 'completed' : psychoPassed ? 'in_progress' : 'upcoming',
      date: competencyCompletedAt || (skillTaken ? 'Telah Selesai' : psychoPassed ? 'Siap Dikerjakan' : 'Terkunci (Menunggu Lolos Psikotes)'),
      score: skillTaken ? (competencyScore ?? undefined) : undefined,
      evaluator: 'Kepala Bagian Quality Assurance & Produksi Pabrik',
      summary: skillTaken
        ? competencyPassed
          ? `Lolos ambang batas kelulusan teknis dengan skor ${competencyScore}% (Passing Grade: 80%). Menguasai defek injeksi, penanganan NCR ISO 9001, dan pengujian polimer.`
          : `Ujian kompetensi teknis telah selesai dengan nilai ${competencyScore}%. Passing grade minimum adalah 80%.`
        : 'Ujian teknis online seputar kendali mutu lini produksi manufaktur plastik CV. Asia Plastik.',
      notes: skillTaken
        ? (competencyPassed ? 'Rekomendasi wawancara tatap muka telah diterbitkan.' : 'Evaluasi teknis selesai.')
        : 'Batas waktu pengerjaan 30 menit dengan passing grade 80%.',
    },
    {
      stageNumber: 6,
      id: 'interview',
      title: 'Wawancara Teknis Lapangan & Manajemen HRD',
      subtitle: 'Tatap Muka di Kantor Operasional Pabrik CV. Asia Plastik Sidoarjo',
      status: isInterviewActive ? 'in_progress' : 'upcoming',
      date: isInterviewActive ? 'Kamis, 14 November 2026 • 09:30 WIB' : 'Tahap Berikutnya',
      evaluator: 'Bpk. Hendra Gunawan (Plant Mgr) & Ibu Ratna (HRD)',
      summary: isInterviewActive
        ? 'Undangan wawancara tatap muka telah aktif. Pelamar dijadwalkan hadir langsung di Pabrik Utama Sidoarjo untuk evaluasi lapangan.'
        : 'Wawancara langsung bersama Tim Manajemen Pabrik setelah lulus ujian kompetensi teknis.',
      notes: 'Wajib mengenakan pakaian formal dan membawa berkas ijazah serta e-KTP asli.',
    },
    {
      stageNumber: 7,
      id: 'mcu',
      title: 'Pemeriksaan Kesehatan Kerja (MCU Pabrik)',
      subtitle: 'Laboratorium Klinik Mitra CV. Asia Plastik',
      status: 'upcoming',
      date: 'Tahap Berikutnya',
      summary:
        'Pemeriksaan fisik umum, tes fungsi paru, pendengaran, dan ketajaman mata bebas buta warna untuk memastikan kesiapan kerja di lingkungan manufaktur.',
      notes: 'Surat rujukan resmi klinik akan diberikan setelah lulus sesi wawancara.',
    },
    {
      stageNumber: 8,
      id: 'offering',
      title: 'Offering Letter & Penandatanganan Kontrak',
      subtitle: 'Penetapan Gaji, Tunjangan Produksi & Onboarding',
      status: 'upcoming',
      date: 'Tahap Akhir',
      summary:
        'Penetapan status karyawan tetap dengan paket remunerasi kompetitif, tunjangan operasional shift, BPJS Ketenagakerjaan & Kesehatan, serta orientasi kerja.',
      notes: 'Hari pertama orientasi kerja dan penempatan kerja resmi.',
    },
  ];
}

export const CANDIDATE_METRICS = {
  interviewSchedule: {
    title: 'Wawancara Teknis Tim Pabrik & HRD',
    date: 'Kamis, 14 November 2026',
    time: '09:30 - 11:30 WIB',
    room: 'Ruang Rapat Utama Lt. 2 - Gedung Administrasi Pabrik',
    location: 'Kawasan Industri Tropodo, Jl. Industri Plastik No. 18, Waru, Sidoarjo',
    dresscode: 'Kemeja Formal Rapi, Celana Bahan, Sepatu Tertutup (Safety Shoes disukai)',
    bringItems: [
      'e-KTP Asli & 1 Lembar Fotokopi',
      'Ijazah & Transkrip Nilai Asli S1 / D4 Teknik',
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

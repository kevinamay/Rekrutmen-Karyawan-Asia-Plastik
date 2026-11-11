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
  competencyScore: number | null;
  competencyPassed: boolean | null;
  competencyCompletedAt: string | null;
}): RecruitmentMilestone[] {
  const {
    candidateName,
    candidateEmail,
    profileCompleted,
    uploadedCount,
    requiredDocsCount,
    competencyScore,
    competencyPassed,
    competencyCompletedAt,
  } = params;

  const docsCompleted = requiredDocsCount > 0 && uploadedCount >= requiredDocsCount;
  const examTaken = competencyScore !== null;
  const isInterviewActive = examTaken && Boolean(competencyPassed);

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
      summary: `Akun pelamar ${candidateName || 'Kandidat'} terdaftar resmi untuk posisi Supervisor Quality Control (QC) di portal rekrutmen CV. Asia Plastik.`,
      notes: `Email ${candidateEmail || 'pelamar'} aktif dan terverifikasi.`,
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
      notes: profileCompleted ? 'Biodata siap diproses untuk seleksi administrasi.' : 'Data wajib dilengkapi sebelum verifikasi berkas.',
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
      id: 'cbt',
      title: 'Ujian Kompetensi Teknis QC Manufaktur',
      subtitle: 'Defek Injeksi, ISO 9001 NCR, Lab MFI & Budaya 5R',
      status: examTaken ? 'completed' : docsCompleted ? 'in_progress' : 'upcoming',
      date: competencyCompletedAt || (docsCompleted ? 'Siap Dikerjakan' : 'Menunggu Berkas'),
      score: examTaken ? competencyScore : undefined,
      evaluator: 'Kepala Bagian Quality Assurance Pabrik',
      summary: examTaken
        ? competencyPassed
          ? `Lolos ambang batas kelulusan dengan skor ${competencyScore}% (Passing Grade: 80%). Menguasai defek injeksi, penanganan NCR ISO 9001, dan pengujian polimer.`
          : `Ujian kompetensi teknis telah selesai dengan nilai ${competencyScore}%. Passing grade minimum adalah 80%.`
        : 'Ujian kompetensi teknis 5 butir soal online seputar kendali mutu manufaktur plastik CV. Asia Plastik.',
      notes: examTaken
        ? (competencyPassed ? 'Rekomendasi lolos wawancara diterbitkan oleh Bagian Mutu.' : 'Evaluasi teknis selesai.')
        : 'Batas waktu pengerjaan 30 menit.',
    },
    {
      stageNumber: 5,
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
      stageNumber: 6,
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
      stageNumber: 7,
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

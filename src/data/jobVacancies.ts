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

export const JOB_VACANCIES: JobOpening[] = [
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


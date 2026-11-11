export interface CompetencyQuestionItem {
  id: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export const QC_COMPETENCY_QUESTIONS: CompetencyQuestionItem[] = [
  {
    id: 1,
    category: 'Defek Injeksi & Ekstrusi Plastik',
    question:
      'Pada lini mesin injection moulding produk wadah plastik, ditemukan cacat "Flash" (kelebihan material tipis di garis pemisah cetakan mold). Tindakan penyesuaian parameter mesin awal yang paling tepat adalah...',
    options: [
      {
        id: 'A',
        text: 'Menurunkan tekanan injeksi (injection pressure) atau menaikkan clamping force (gaya pencekam) pada cetakan mold.',
      },
      {
        id: 'B',
        text: 'Menaikkan suhu barel pemanas resin dan mempercepat waktu siklus pendinginan.',
      },
      {
        id: 'C',
        text: 'Menambahkan proporsi bahan daur ulang (regrind resin) hingga 50% ke dalam hopper.',
      },
      {
        id: 'D',
        text: 'Mematikan sistem pendingin air chiller pada area cetakan mold.',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Cacat flash terjadi ketika lelehan plastik keluar melalui celah parting line karena tekanan injeksi terlalu tinggi atau gaya penjepit mold (clamping force) kurang kuat.',
  },
  {
    id: 2,
    category: 'Standar Sistem Manajemen Mutu (ISO 9001:2015)',
    question:
      'Jika ditemukan ketidaksesuaian kritis (critical non-conformance) di mana 1 lot produk botol plastik tidak memenuhi standar ketebalan dinding minimum, langkah pertama seorang Supervisor QC adalah...',
    options: [
      {
        id: 'A',
        text: 'Melakukan karantina/isolasi fisik pada lot produk tersebut, menerbitkan Non-Conformance Report (NCR), dan menahan pengiriman ke gudang.',
      },
      {
        id: 'B',
        text: 'Langsung membuang seluruh lot produk ke mesin pencacah limbah tanpa dokumentasi dan persetujuan pabrik.',
      },
      {
        id: 'C',
        text: 'Mengirimkan produk ke pelanggan dengan memberikan potongan harga tanpa sepengetahuan Manajer Mutu.',
      },
      {
        id: 'D',
        text: 'Meminta operator lini untuk menyembunyikan produk cacat agar target harian pabrik tercapai.',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Sesuai ISO 9001 klausul 8.7, output yang tidak sesuai wajib diidentifikasi, dikarantina/dikendalikan agar tidak terkirim secara tidak sengaja, dan dicatat dalam laporan ketidaksesuaian (NCR).',
  },
  {
    id: 3,
    category: 'Karakteristik Bahan Baku Polimer',
    question:
      'Pengujian "Melt Flow Index" (MFI) pada bahan baku biji plastik Polypropylene (PP) dan HDPE dilakukan di laboratorium QC bertujuan untuk mengukur...',
    options: [
      {
        id: 'A',
        text: 'Laju alir lelehan polimer pada suhu dan beban standar, yang mengindikasikan berat molekul serta kemudahan pemrosesan material resin.',
      },
      {
        id: 'B',
        text: 'Ketahanan plastik terhadap paparan sinar ultraviolet matahari dan kelembapan cuaca luar ruangan.',
      },
      {
        id: 'C',
        text: 'Daya rekat cat sablon dan label stiker pada permukaan produk akhir plastik.',
      },
      {
        id: 'D',
        text: 'Suhu titik nyala api minimum saat material plastik terbakar.',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Melt Flow Index (MFI/MFR) mengukur massa polimer cair yang mengalir melalui kapiler berstandar pada suhu dan beban tertentu selama 10 menit. Nilai MFI berbanding terbalik dengan berat molekul.',
  },
  {
    id: 4,
    category: 'Alat Ukur Presisi & Kalibrasi',
    question:
      'Untuk memverifikasi ketebalan dinding produk plastik dengan toleransi presisi tinggi ±0.01 mm, instrumen ukur yang paling tepat digunakan adalah...',
    options: [
      {
        id: 'A',
        text: 'Point Micrometer sekrup digital terkalibrasi atau Ultrasonic Thickness Gauge khusus polimer.',
      },
      {
        id: 'B',
        text: 'Penggaris baja stainless (Steel Ruler) 30 cm.',
      },
      {
        id: 'C',
        text: 'Pita ukur gulung mekanik (Measuring Tape) 5 meter.',
      },
      {
        id: 'D',
        text: 'Timbangan analitik massa gramasi.',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Pengukuran ketebalan dinding produk lengkung/cekung memerlukan point micrometer atau ultrasonic gauge dengan resolusi 0.01 mm / 0.001 mm yang terkalibrasi.',
  },
  {
    id: 5,
    category: 'Keselamatan Kerja (K3) & Budaya 5R Pabrik',
    question:
      'Penerapan budaya 5R (Ringkas, Rapi, Resik, Rawat, Rajin) dan standar K3 di area produksi dan laboratorium QC CV. Asia Plastik bertujuan utama untuk...',
    options: [
      {
        id: 'A',
        text: 'Mencegah kecelakaan kerja, menghilangkan kontaminasi pada bahan baku plastik, meningkatkan efisiensi kerja, dan menjaga konsistensi mutu produk.',
      },
      {
        id: 'B',
        text: 'Sekadar formalitas kebersihan saat ada kunjungan auditor eksternal ISO atau inspeksi dinas ketenagakerjaan.',
      },
      {
        id: 'C',
        text: 'Mengurangi waktu operasional mesin pabrik demi memangkas biaya listrik perusahaan.',
      },
      {
        id: 'D',
        text: 'Menghapuskan kewajiban penggunaan Alat Pelindung Diri (APD) seperti masker dan sarung tangan tahan panas.',
      },
    ],
    correctAnswer: 'A',
    explanation:
      'Penerapan 5R dan K3 menciptakan lingkungan kerja yang aman, bersih dari kontaminasi gramat/debu plastik, serta meminimalkan risiko kecelakaan kerja bagi seluruh pekerja pabrik.',
  },
];

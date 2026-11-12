export interface CognitiveQuestion {
  id: number;
  subType: 'numerik' | 'verbal' | 'spasial';
  subTypeLabel: string;
  question: string;
  contextText?: string;
  tableData?: { headers: string[]; rows: (string | number)[][] };
  svgDiagram?: string; // Optional custom SVG visualization for spatial
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface PersonalitySet {
  id: number;
  options: {
    id: string;
    text: string;
    trait: 'Dominance' | 'Influence' | 'Steadiness' | 'Compliance';
  }[];
}

export interface SJTQuestion {
  id: number;
  scenarioTitle: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    score: number; // 4 = best, 1 = worst
    rationale: string;
  }[];
  bestAnswer: string;
}

export interface LogicAlgoritmaQuestion {
  id: number;
  title: string;
  question: string;
  pseudocodeOrFlow?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

// ========================================================
// SUBTEST 1: TES KEMAMPUAN KOGNITIF (APTITUDE TEST)
// Durasi: 12 Menit
// ========================================================
export const COGNITIVE_QUESTIONS: CognitiveQuestion[] = [
  // --- A. LOGIKA NUMERIK ---
  {
    id: 1,
    subType: 'numerik',
    subTypeLabel: 'Logika Numerik - Deret Angka',
    question: 'Tentukan angka lanjutan yang paling tepat dari deret berikut:\n3,  5,  9,  17,  33,  ...',
    options: [
      { id: 'A', text: '49' },
      { id: 'B', text: '57' },
      { id: 'C', text: '65' },
      { id: 'D', text: '73' },
      { id: 'E', text: '81' },
    ],
    correctAnswer: 'C',
    explanation: 'Pola selisih antar angka berlipat dua: +2, +4, +8, +16, maka selisih berikutnya adalah +32. (33 + 32 = 65).',
  },
  {
    id: 2,
    subType: 'numerik',
    subTypeLabel: 'Logika Numerik - Deret Kombinasi',
    question: 'Tentukan dua angka lanjutan dari deret berpola berikut:\n2,  4,  3,  9,  4,  16,  5,  25,  6,  ...',
    options: [
      { id: 'A', text: '36, 7' },
      { id: 'B', text: '30, 7' },
      { id: 'C', text: '49, 8' },
      { id: 'D', text: '36, 6' },
      { id: 'E', text: '42, 7' },
    ],
    correctAnswer: 'A',
    explanation: 'Pola berulang selang-seling antara bilangan bulat n dan kuadratnya n²: (2, 2²=4), (3, 3²=9), (4, 4²=16), (5, 5²=25), maka berikutnya adalah 6² = 36 kemudian n+1 = 7.',
  },
  {
    id: 3,
    subType: 'numerik',
    subTypeLabel: 'Logika Numerik - Aritmatika Industri',
    question: 'Sebuah mesin cetak injeksi plastik mampu memproduksi 420 unit wadah dalam waktu 35 menit. Jika pabrik mengoperasikan 4 mesin serupa secara serentak dan konstan selama 2,5 jam, berapakah total wadah plastik yang berhasil diproduksi?',
    options: [
      { id: 'A', text: '5.600 unit' },
      { id: 'B', text: '6.400 unit' },
      { id: 'C', text: '7.200 unit' },
      { id: 'D', text: '8.400 unit' },
      { id: 'E', text: '9.000 unit' },
    ],
    correctAnswer: 'C',
    explanation: 'Kapasitas per mesin = 420 / 35 = 12 unit/menit. Untuk 4 mesin = 4 × 12 = 48 unit/menit. Waktu operasi 2,5 jam = 150 menit. Total produksi = 48 × 150 = 7.200 unit.',
  },
  {
    id: 4,
    subType: 'numerik',
    subTypeLabel: 'Logika Numerik - Analisis Data Tabel',
    question: 'Berdasarkan tabel persentase cacat mutu di bawah ini, berapakah persentase penurunan tingkat cacat pada Lini B dari Triwulan I ke Triwulan II?',
    tableData: {
      headers: ['Lini Produksi', 'Triwulan I (% Cacat)', 'Triwulan II (% Cacat)'],
      rows: [
        ['Lini A (Blow Molding)', '4.8%', '3.6%'],
        ['Lini B (Injection)', '6.0%', '4.5%'],
        ['Lini C (Extrusion)', '5.2%', '4.0%'],
      ],
    },
    options: [
      { id: 'A', text: '15.0%' },
      { id: 'B', text: '20.0%' },
      { id: 'C', text: '25.0%' },
      { id: 'D', text: '30.0%' },
      { id: 'E', text: '33.3%' },
    ],
    correctAnswer: 'C',
    explanation: 'Penurunan Lini B = 6.0% - 4.5% = 1.5%. Persentase penurunan relatif = (1.5 / 6.0) × 100% = 25.0%.',
  },

  // --- B. LOGIKA VERBAL ---
  {
    id: 5,
    subType: 'verbal',
    subTypeLabel: 'Logika Verbal - Silogisme Kategoris',
    question: 'Tentukan kesimpulan yang paling sah dan logis dari dua premis berikut:\n• Premis 1: Semua teknisi yang bersertifikasi K3 berhak mengoperasikan mesin ekstrusi bertekanan tinggi.\n• Premis 2: Sebagian staf kendali mutu (QC) memiliki sertifikasi K3.',
    options: [
      { id: 'A', text: 'Semua staf kendali mutu berhak mengoperasikan mesin ekstrusi bertekanan tinggi.' },
      { id: 'B', text: 'Sebagian staf kendali mutu berhak mengoperasikan mesin ekstrusi bertekanan tinggi.' },
      { id: 'C', text: 'Hanya teknisi mesin yang boleh memiliki sertifikasi K3.' },
      { id: 'D', text: 'Staf kendali mutu yang tidak memiliki sertifikasi K3 tetap boleh mengoperasikan mesin.' },
      { id: 'E', text: 'Tidak ada hubungan antara staf kendali mutu dengan pengoperasian mesin.' },
    ],
    correctAnswer: 'B',
    explanation: 'Karena sebagian staf QC memiliki sertifikasi K3, dan semua yang bersertifikasi K3 berhak mengoperasikan mesin, maka kesimpulan logis mutlaknya adalah: sebagian staf QC berhak mengoperasikan mesin ekstrusi bertekanan tinggi.',
  },
  {
    id: 6,
    subType: 'verbal',
    subTypeLabel: 'Logika Verbal - Silogisme Kondisional',
    question: 'Tentukan kesimpulan yang valid berdasarkan prinsip Modus Tollens:\n• Premis 1: Jika suhu barel pemanas resin melebihi 245°C, maka biji plastik polimer akan mengalami degradasi termal dan berubah warna.\n• Premis 2: Biji plastik polimer pada batch #18 tidak mengalami degradasi termal dan warnanya tetap bening sempurna.',
    options: [
      { id: 'A', text: 'Suhu barel pemanas resin pada batch #18 pasti melebihi 245°C.' },
      { id: 'B', text: 'Suhu barel pemanas resin pada batch #18 tidak melebihi 245°C.' },
      { id: 'C', text: 'Mesin pendingin chiller sengaja dimatikan saat batch #18 berlangsung.' },
      { id: 'D', text: 'Biji plastik batch #18 tidak dipanaskan sama sekali.' },
      { id: 'E', text: 'Kesimpulan tidak dapat ditarik dari informasi yang ada.' },
    ],
    correctAnswer: 'B',
    explanation: 'Bentuk Modus Tollens: Jika P maka Q. Bukan Q. Maka dapat disimpulkan secara mutlak: Bukan P (Suhu barel tidak melebihi 245°C).',
  },
  {
    id: 7,
    subType: 'verbal',
    subTypeLabel: 'Logika Verbal - Analogi Kata',
    question: 'Pilihlah pasangan kata yang memiliki padanan hubungan fungsional yang paling serupa:\nMANOMETER : TEKANAN  =' ,
    options: [
      { id: 'A', text: 'KALORIMETER : CAHAYA' },
      { id: 'B', text: 'TAKOMETRE : SUHU' },
      { id: 'C', text: 'HIGROMETER : KELEMBAPAN' },
      { id: 'D', text: 'VOLTMETER : ARUS' },
      { id: 'E', text: 'SEISMOGRAF : ANGIN' },
    ],
    correctAnswer: 'C',
    explanation: 'Manometer adalah instrumen pengukur besaran tekanan, sebagaimana Higrometer adalah instrumen pengukur besaran kelembapan udara.',
  },
  {
    id: 8,
    subType: 'verbal',
    subTypeLabel: 'Logika Verbal - Pemahaman Teks Analitis',
    contextText: '"Penerapan metodologi 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) pada lini manufaktur CV. Asia Plastik berhasil menekan angka kecelakaan kerja hingga 40% dan mempercepat waktu pergantian cetakan mold (changeover time) sebesar 18 menit. Namun demikian, keberlanjutan sistem ini sangat bertumpu pada audit berkala mandiri oleh masing-masing kepala regu dan kesadaran disiplin operasional para operator lini depan."',
    question: 'Berdasarkan kutipan di atas, manakah pernyataan berikut yang PALING DIDUKUNG oleh teks?',
    options: [
      { id: 'A', text: 'Waktu pergantian cetakan mold berkurang hingga menjadi 18 menit secara total.' },
      { id: 'B', text: 'Tingkat kecelakaan kerja dapat turun secara permanen tanpa memerlukan audit berkala.' },
      { id: 'C', text: 'Efektivitas jangka panjang 5S mensyaratkan pengawasan teratur serta komitmen disiplin dari operator kerja.' },
      { id: 'D', text: 'Metodologi 5S hanya berfokus pada kecepatan teknisi dan mengabaikan keselamatan.' },
      { id: 'E', text: 'Kepala regu bertugas menggantikan operator lini depan yang tidak disiplin.' },
    ],
    correctAnswer: 'C',
    explanation: 'Teks menyatakan bahwa keberlanjutan sistem bertumpu pada audit berkala mandiri oleh kepala regu dan kesadaran disiplin operator lini depan, yang secara tepat diuraikan pada pilihan C.',
  },

  // --- C. LOGIKA SPASIAL / FIGURAL ---
  {
    id: 9,
    subType: 'spasial',
    subTypeLabel: 'Logika Spasial - Pola Rotasi Figural',
    question: 'Perhatikan urutan pola transformasi bentuk geometris berikut:\nBentuk panah berputar searah jarum jam sebesar 45° pada tiap langkah, sementara sebuah lingkaran hitam di ujung panah berpindah sisi secara bergantian (kiri - kanan - kiri - kanan). Jika pada posisi ke-3 panah mengarah ke kanan (90°) dengan lingkaran di sisi kiri, ke manakah arah panah dan posisi lingkaran pada langkah ke-5?',
    options: [
      { id: 'A', text: 'Mengarah ke bawah (180°), lingkaran di sisi kiri' },
      { id: 'B', text: 'Mengarah ke bawah (180°), lingkaran di sisi kanan' },
      { id: 'C', text: 'Mengarah ke serong kanan bawah (135°), lingkaran di sisi kanan' },
      { id: 'D', text: 'Mengarah ke serong kiri bawah (225°), lingkaran di sisi kiri' },
      { id: 'E', text: 'Mengarah ke atas (0°), lingkaran di sisi kanan' },
    ],
    correctAnswer: 'A',
    explanation: 'Langkah 3: 90° (lingkaran kiri). Langkah 4: 90°+45° = 135° (lingkaran kanan). Langkah 5: 135°+45° = 180° (mengarah tepat ke bawah) dan lingkaran kembali ke sisi kiri.',
  },
  {
    id: 10,
    subType: 'spasial',
    subTypeLabel: 'Logika Spasial - Jaring-Jaring Kubus 3D',
    question: 'Sebuah kubus memiliki simbol berbeda pada keenam sisinya: [Lingkaran], [Bintang], [Segitiga], [Kotak], [Silang], dan [Garis]. Pada jaring-jaring kubus, sisi [Lingkaran] berseberangan (berlawanan arah) langsung dengan sisi [Kotak]. Manakah pernyataan yang PASTI BENAR ketika kubus tersebut dirakit?',
    options: [
      { id: 'A', text: 'Sisi [Lingkaran] dan sisi [Kotak] akan saling bersentuhan di satu rusuk kubus.' },
      { id: 'B', text: 'Sisi [Lingkaran] dan sisi [Kotak] tidak akan pernah terlihat bersamaan dari satu sudut pandang depan yang wajar.' },
      { id: 'C', text: 'Sisi [Bintang] pasti berada di sebelah sisi [Kotak] saja dan tidak bersentuhan dengan [Lingkaran].' },
      { id: 'D', text: 'Sisi [Silang] menjadi penutup kubus di atas sisi [Garis].' },
      { id: 'E', text: 'Sisi [Segitiga] tidak memiliki hubungan geometris dengan sisi lainnya.' },
    ],
    correctAnswer: 'B',
    explanation: 'Dua sisi yang saling berhadapan/berseberangan (opposite faces) pada kubus 3D tidak akan pernah bersentuhan pada rusuk mana pun dan tidak dapat terlihat bersamaan dari sudut pandang proyeksi isometrik standar.',
  },
  {
    id: 11,
    subType: 'spasial',
    subTypeLabel: 'Logika Spasial - Matriks Pola Visual',
    question: 'Dalam sebuah matriks 3×3, baris pertama memiliki 1 garis hitam vertikal, baris kedua memiliki 2 garis hitam vertikal, dan baris ketiga memiliki 3 garis hitam vertikal. Di saat yang sama, kolom pertama berisi 1 bulatan putih, kolom kedua berisi 2 bulatan putih, dan kolom ketiga berisi 3 bulatan putih. Elemen manakah yang harus berada pada sel pojok kanan bawah (Baris 3, Kolom 3)?',
    options: [
      { id: 'A', text: '2 garis vertikal dan 3 bulatan putih' },
      { id: 'B', text: '3 garis vertikal dan 2 bulatan putih' },
      { id: 'C', text: '3 garis vertikal dan 3 bulatan putih' },
      { id: 'D', text: '1 garis vertikal dan 3 bulatan putih' },
      { id: 'E', text: '4 garis vertikal dan 4 bulatan putih' },
    ],
    correctAnswer: 'C',
    explanation: 'Sesuai aturan matriks kombinasi orthogonal: Baris 3 mensyaratkan 3 garis vertikal, dan Kolom 3 mensyaratkan 3 bulatan putih. Maka sel (3,3) berisi 3 garis vertikal dan 3 bulatan putih.',
  },
];

// ========================================================
// SUBTEST 2: TES KEPRIBADIAN (PERSONALITY INVENTORY)
// Format: Forced Choice (Most / Paling Menggambarkan & Least / Paling Tidak Menggambarkan)
// Durasi: 10 Menit
// ========================================================
export const PERSONALITY_SETS: PersonalitySet[] = [
  {
    id: 1,
    options: [
      { id: 'A', text: 'Saya berani mengambil keputusan cepat dan memimpin rekan kerja ketika situasi pabrik sedang genting.', trait: 'Dominance' },
      { id: 'B', text: 'Saya senang membangun suasana kerja yang akrab, optimis, dan mudah memotivasi rekan satu tim.', trait: 'Influence' },
      { id: 'C', text: 'Saya setia menjalankan rutinitas secara sabar, konsisten, dan mengutamakan ketenteraman bersama.', trait: 'Steadiness' },
      { id: 'D', text: 'Saya teliti memeriksa setiap rincian teknis agar hasil kerja terbebas dari kesalahan sekecil apa pun.', trait: 'Compliance' },
    ],
  },
  {
    id: 2,
    options: [
      { id: 'A', text: 'Saya berani menyuarakan ketidaksetujuan secara tegas demi mencapai target produktivitas perusahaan.', trait: 'Dominance' },
      { id: 'B', text: 'Saya mudah beradaptasi dalam menjalin komunikasi dengan berbagai pihak eksternal maupun klien.', trait: 'Influence' },
      { id: 'C', text: 'Saya dapat diandalkan untuk menyelesaikan tugas hingga tuntas tanpa mengeluh meski beban sedang meningkat.', trait: 'Steadiness' },
      { id: 'D', text: 'Saya selalu berpedoman teguh pada standar prosedur operasional (SOP) dan fakta data yang valid.', trait: 'Compliance' },
    ],
  },
  {
    id: 3,
    options: [
      { id: 'A', text: 'Saya terdorong untuk selalu menjadi yang terdepan dan menyukai tantangan target yang tinggi.', trait: 'Dominance' },
      { id: 'B', text: 'Saya pandai meyakinkan orang lain dan mencairkan suasana diskusi yang kaku di tempat kerja.', trait: 'Influence' },
      { id: 'C', text: 'Saya pendengar yang baik bagi rekan kerja dan siap membantu saat mereka membutuhkan dukungan.', trait: 'Steadiness' },
      { id: 'D', text: 'Saya terbiasa menganalisis akar penyebab masalah secara objektif sebelum menarik kesimpulan kerja.', trait: 'Compliance' },
    ],
  },
  {
    id: 4,
    options: [
      { id: 'A', text: 'Saya fokus pada hasil akhir (result-oriented) dan tidak ragu mengambil risiko yang terukur.', trait: 'Dominance' },
      { id: 'B', text: 'Saya menyukai interaksi dinamis dan senang bertukar ide kreatif dalam forum kelompok kerja.', trait: 'Influence' },
      { id: 'C', text: 'Saya menjaga ketenangan emosi dan tidak mudah panik ketika menghadapi situasi kerja yang mendadak.', trait: 'Steadiness' },
      { id: 'D', text: 'Saya menjunjung tinggi standar mutu, keteraturan dokumen kerja, dan kepatuhan terhadap regulasi.', trait: 'Compliance' },
    ],
  },
  {
    id: 5,
    options: [
      { id: 'A', text: 'Saya berorientasi pada tindakan langsung dan segera menyelesaikan masalah tanpa menunda waktu.', trait: 'Dominance' },
      { id: 'B', text: 'Saya membangun hubungan kerja yang saling percaya dengan pendekatan persuasif dan empatik.', trait: 'Influence' },
      { id: 'C', text: 'Saya menghargai stabilitas organisasi dan bersedia menjalankan instruksi manajemen dengan loyal.', trait: 'Steadiness' },
      { id: 'D', text: 'Saya sangat disiplin terhadap tenggat waktu dan memastikan hasil kerja selalu memenuhi tolok ukur.', trait: 'Compliance' },
    ],
  },
];

// ========================================================
// SUBTEST 3: SITUATIONAL JUDGMENT TEST (SJT)
// Skenario Dilema Tempat Kerja Industri
// Durasi: 10 Menit
// ========================================================
export const SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 1,
    scenarioTitle: 'Dilema Target Waktu Pengiriman vs Kualitas Mutu Produk',
    scenario: 'Menjelang batas waktu pengiriman kontainer pesanan ekspor sore ini, Anda menemukan bahwa 150 kotak produk botol plastik memiliki cacat visual berupa goresan tipis. Bagian Produksi mendesak Anda untuk meloloskan barang tersebut dengan alasan "hanya cacat kosmetik kecil dan kapal pengangkut tidak bisa menunggu lagi". Sebagai petugas yang bertanggung jawab atas proses seleksi kualitas, tindakan apakah yang PALING TEPAT Anda lakukan?',
    options: [
      {
        id: 'A',
        text: 'Menuruti desakan bagian produksi dan meloloskan seluruh barang demi menjaga hubungan baik antardepartemen dan menghindari denda kapal.',
        score: 1,
        rationale: 'Tindakan ini mengorbankan integritas standar mutu dan dapat merusak kepercayaan jangka panjang klien.',
      },
      {
        id: 'B',
        text: 'Segera melakukan karantina pada 150 kotak tersebut, menginformasikan temuan kritis ini secara transparan kepada Manajer Mutu & Kepala Pabrik, serta mengerahkan tim sortasi kilat untuk memilah produk yang masih sesuai toleransi batas kontrak.',
        score: 4,
        rationale: 'Sikap profesional berintegritas tinggi: menjaga standar mutu perusahaan sekaligus proaktif mencari solusi darurat bersama pemangku kepentingan.',
      },
      {
        id: 'C',
        text: 'Meninggalkan area pabrik dan menyerahkan tanggung jawab sepenuhnya kepada bagian produksi agar Anda tidak disalahkan jika ada klaim komplain.',
        score: 1,
        rationale: 'Menghindar dari tanggung jawab dan mencerminkan ketiadaan kepemimpinan profesional.',
      },
      {
        id: 'D',
        text: 'Menolak mentah-mentah tanpa memberikan penjelasan dan langsung membatalkan pengiriman kontainer tanpa berkoordinasi terlebih dahulu dengan manajemen.',
        score: 2,
        rationale: 'Menjaga mutu namun minim komunikasi solutif yang berpotensi menimbulkan kerugian finansial yang sebenarnya dapat dimitigasi.',
      },
    ],
    bestAnswer: 'B',
  },
  {
    id: 2,
    scenarioTitle: 'Pelanggaran SOP Keselamatan Kerja (K3) oleh Karyawan Senior',
    scenario: 'Di area mesin pemecah biji plastik daur ulang (crusher), Anda melihat seorang operator senior bekerja tanpa mengenakan kacamata pelindung (safety goggles) dan sumbat telinga (earplug). Ketika diingatkan, ia menjawab santai: "Saya sudah 10 tahun kerja di sini dan tidak pernah terjadi apa-apa, pakai alat itu bikin pengap dan tidak leluasa." Bagaimana Anda menyikapi situasi tersebut?',
    options: [
      {
        id: 'A',
        text: 'Membiarkannya karena menghormati senioritasnya dan menganggap pengalamannya sudah cukup melindungi dirinya.',
        score: 1,
        rationale: 'Membiarkan bahaya K3 berisiko fatal bagi keselamatan nyawa pekerja dan reputasi keselamatan pabrik.',
      },
      {
        id: 'B',
        text: 'Langsung memarahi operator tersebut di depan seluruh pekerja lini agar rekan-rekan kerja yang lain merasa takut melanggar aturan.',
        score: 2,
        rationale: 'Menciptakan resistensi sosial dan memperburuk iklim kerja sama tim.',
      },
      {
        id: 'C',
        text: 'Menjelaskan dengan sopan namun tegas bahwa serpihan plastik berkecepatan tinggi dapat mengenai mata dalam hitungan milidetik tanpa memandang pengalaman kerja, mendampinginya memakai APD, dan jika tetap menolak, melaporkan insiden potensi bahaya (Unsafe Act) kepada Pengawas K3/HSE.',
        score: 4,
        rationale: 'Tindakan asertif, berorientasi keselamatan absolut, dan mematuhi hierarki pelaporan standar K3 industri.',
      },
      {
        id: 'D',
        text: 'Ikut melepaskan APD Anda sendiri agar rekan senior tersebut merasa nyaman dan tidak merasa tersindir.',
        score: 1,
        rationale: 'Sangat berbahaya dan melanggar prinsip kepatuhan dasar kerja industri.',
      },
    ],
    bestAnswer: 'C',
  },
  {
    id: 3,
    scenarioTitle: 'Ketegangan Komunikasi dan Konflik Pembagian Tugas Tim',
    scenario: 'Anda tergabung dalam tim pelaksana proyek efisiensi material pabrik beranggotakan 4 orang. Salah satu rekan tim Anda berulang kali terlambat mengumpulkan data analisanya sehingga menghambat penyusunan laporan kemajuan mingguan kepada Direksi. Rekan lain mulai saling berbisik dan menyalahkan. Apa tindakan inisiatif terbaik yang akan Anda ambil?',
    options: [
      {
        id: 'A',
        text: 'Mengajak rekan tersebut berdiskusi secara empatik empat mata untuk memahami kendala spesifik yang dihadapinya, menawarkan bantuan redistribusi beban tugas jika ia mengalami hambatan, serta menyepakati ulang linimasa target kerja bersama tim.',
        score: 4,
        rationale: 'Menunjukkan kecerdasan emosional, orientasi kerja sama tim, dan kepemimpinan pemecahan masalah tanpa menghakimi.',
      },
      {
        id: 'B',
        text: 'Mengirimkan email teguran terbuka dengan memasukkan (cc) seluruh Direksi dan Manajer HRD agar rekan tersebut mendapat sanksi pemotongan insentif.',
        score: 1,
        rationale: 'Eskalasi destruktif yang merusak kohesi tim kerja.',
      },
      {
        id: 'C',
        text: 'Mengeluarkan rekan tersebut dari grup koordinasi dan mengerjakan bagiannya seorang diri sambil mengeluhkan rekan tersebut kepada rekan di divisi lain.',
        score: 1,
        rationale: 'Tidak menyelesaikan akar masalah dan memicu beban kerja sepihak.',
      },
      {
        id: 'D',
        text: 'Mengabaikan keterlambatan tersebut dan melaporkan kepada atasan bahwa proyek pasti tertunda karena kesalahan rekan tersebut semata.',
        score: 2,
        rationale: 'Pasif dan bermental cuci tangan.',
      },
    ],
    bestAnswer: 'A',
  },
  {
    id: 4,
    scenarioTitle: 'Penemuan Kesalahan Data Input Stok yang Belum Diketahui Atasan',
    scenario: 'Saat melakukan rekonsiliasi berkas operasional, Anda secara tidak sengaja menyadari bahwa Anda salah memasukkan angka stok bahan aditif pewarna resin pada sistem ERP dua hari yang lalu, sehingga data sistem tercatat 100 kg lebih banyak dari stok fisik riil di gudang. Belum ada seorang pun atasan atau rekan yang mengetahui kesalahan input ini. Apa yang akan Anda lakukan?',
    options: [
      {
        id: 'A',
        text: 'Menutup-nutupi selisih tersebut dengan harapan pemakaian bahan di hari-hari berikutnya akan menyamarkan perbedaan angka tersebut.',
        score: 1,
        rationale: 'Pelanggaran integritas berat yang dapat mengacaukan perencanaan kebutuhan material (MRP) pabrik.',
      },
      {
        id: 'B',
        text: 'Segera melapor secara jujur kepada atasan langsung mengenai letak kekeliruan input yang telah terjadi, menyampaikan bukti koreksi fisik yang tepat, dan mengajukan permohonan penyesuaian (stock adjustment) resmi sesuai prosedur otorisasi.',
        score: 4,
        rationale: 'Mencerminkan nilai kejujuran, akuntabilitas pribadi, dan tanggung jawab penuh atas pekerjaan.',
      },
      {
        id: 'C',
        text: 'Mengubah tanggal log di sistem komputer secara diam-diam dan menyalahkan operator pergudangan atas selisih tersebut.',
        score: 1,
        rationale: 'Tindakan manipulatif yang melanggar kode etik perusahaan.',
      },
      {
        id: 'D',
        text: 'Menunggu sampai ada pihak lain yang menemukan selisih tersebut saat audit akhir bulan baru kemudian mengakuinya.',
        score: 2,
        rationale: 'Pasif dan berisiko menimbulkan dampak berantai pada produksi yang telanjur dijadwalkan.',
      },
    ],
    bestAnswer: 'B',
  },
];

// ========================================================
// SUBTEST 4: TES KETELITIAN & KECEPATAN (KRAEPELIN / PAULI DIGITAL)
// Durasi: 90 Detik Sesi Interaktif
// ========================================================
export interface KraepelinPair {
  top: number;
  bottom: number;
  correctUnit: number; // (top + bottom) % 10
}

export function generateKraepelinPairs(count = 60): KraepelinPair[] {
  const pairs: KraepelinPair[] = [];
  for (let i = 0; i < count; i++) {
    const top = Math.floor(Math.random() * 9) + 1; // 1-9
    const bottom = Math.floor(Math.random() * 9) + 1; // 1-9
    pairs.push({
      top,
      bottom,
      correctUnit: (top + bottom) % 10,
    });
  }
  return pairs;
}

// ========================================================
// SUBTEST 5: LOGIKA ALGORITMA & ALUR SISTEM KERJA
// Durasi: 8 Menit
// ========================================================
export const LOGIC_ALGORITHM_QUESTIONS: LogicAlgoritmaQuestion[] = [
  {
    id: 1,
    title: 'Analisis Alur Keputusan (Flowchart Branching)',
    question: 'Perhatikan algoritma logika berikut untuk verifikasi kelayakan produk plastik:\n\n1. Masukkan nilai Suhu (T) dan Tekanan (P).\n2. JIKA (T >= 200 AND T <= 230) MAKA:\n       JIKA (P >= 80) MAKA Status = "LOLOS UTAMA"\n       SELAIN ITU Status = "LOLOS BERSYARAT"\n   SELAIN ITU:\n       JIKA (T < 200) MAKA Status = "RE-HEAT"\n       SELAIN ITU Status = "REJECT DISPOSAL"\n\nBerdasarkan aturan di atas, jika parameter mesin terukur Suhu T = 215 dan Tekanan P = 75, apakah status produk?',
    options: [
      { id: 'A', text: 'LOLOS UTAMA' },
      { id: 'B', text: 'LOLOS BERSYARAT' },
      { id: 'C', text: 'RE-HEAT' },
      { id: 'D', text: 'REJECT DISPOSAL' },
      { id: 'E', text: 'PARAMETER TIDAK VALID' },
    ],
    correctAnswer: 'B',
    explanation: 'Nilai T = 215 memenuhi syarat (T >= 200 AND T <= 230). Namun nilai P = 75 tidak memenuhi (P >= 80), sehingga masuk ke cabang "SELAIN ITU" di blok dalam, yaitu "LOLOS BERSYARAT".',
  },
  {
    id: 2,
    title: 'Optimasi Penjadwalan Kerja (Shortest Processing Time)',
    question: 'Sebuah lini produksi harus memproses 3 pesanan botol dengan durasi pengerjaan masing-masing:\n• Pesanan X: butuh waktu 3 jam\n• Pesanan Y: butuh waktu 1 jam\n• Pesanan Z: butuh waktu 2 jam\n\nUntuk meminimalkan rata-rata waktu tunggu penyelesaian (Average Flow Time) di pabrik, urutan pengerjaan pesanan yang paling optimal berdasarkan algoritma SPT (Shortest Processing Time) adalah...',
    options: [
      { id: 'A', text: 'X -> Z -> Y' },
      { id: 'B', text: 'Y -> Z -> X' },
      { id: 'C', text: 'Z -> X -> Y' },
      { id: 'D', text: 'X -> Y -> Z' },
      { id: 'E', text: 'Y -> X -> Z' },
    ],
    correctAnswer: 'B',
    explanation: 'Algoritma Shortest Processing Time (SPT) mengurutkan pekerjaan dari durasi paling singkat ke paling lama untuk meminimalkan waktu tunggu rata-rata: Y (1 jam) -> Z (2 jam) -> X (3 jam).',
  },
  {
    id: 3,
    title: 'Metode Analisis Akar Masalah (5-Why Root Cause Analysis)',
    question: 'Sebuah mesin cetak tiba-tiba berhenti beroperasi di tengah proses injeksi karena motor hidrolik terbakar akibat kepanasan (overheat). Hasil penelusuran menunjukkan filter oli pendingin tersumbat kotoran. Manakah tindakan pencegahan tingkat AKAR MASALAH (Root Cause Prevention) yang paling tepat untuk mencegah kejadian serupa terulang pada seluruh mesin pabrik?',
    options: [
      { id: 'A', text: 'Mengganti motor hidrolik yang terbakar dengan motor baru yang lebih besar tenaganya.' },
      { id: 'B', text: 'Memasang kipas angin eksternal tambahan di dekat mesin cetak tersebut.' },
      { id: 'C', text: 'Menetapkan jadwal rutin pembersihan/penggantian filter oli berbasis jam operasi mesin serta menyusun lembar ceklis harian pemeliharaan preventif (TPM) yang diaudit berkala.' },
      { id: 'D', text: 'Mengurangi kecepatan putaran mesin cetak hingga separuh kapasitas normal.' },
      { id: 'E', text: 'Memberikan surat peringatan kepada operator yang saat itu bertugas di mesin.' },
    ],
    correctAnswer: 'C',
    explanation: 'Pencegahan level akar masalah berfokus pada sistem/manajemen pemeliharaan preventif (TPM jadwal rutin dan audit), bukan hanya mengganti komponen rusak atau solusi darurat sementara.',
  },
];

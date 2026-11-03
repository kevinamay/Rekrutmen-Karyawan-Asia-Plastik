# Folder Asset Gambar (Image Assets)

Folder ini digunakan untuk menyimpan seluruh aset gambar statis untuk aplikasi web **Rekrutmen Karyawan CV. Asia Plastik**.

## Struktur Direktori

```
public/
├── images/
│   └── factory-bg.jpg            <- Asset background hero utama
└── assets/
    └── images/
        ├── heroes/               <- Gambar latar belakang hero, header, atau showcase pabrik
        │   └── factory-bg.jpg
        ├── logos/                <- Logo resmi CV. Asia Plastik, favicon, dan mitra
        ├── banners/              <- Banner promosi lowongan atau program magang
        └── placeholders/         <- Gambar cadangan / dummy avatar kandidat
```

## Cara Penggunaan di Next.js

Seluruh file di dalam folder `public/` dapat diakses langsung dari browser atau kode React/Next.js menggunakan path absolut:

### 1. Menggunakan CSS Background / Tailwind:
```tsx
<div style={{ backgroundImage: "url('/assets/images/heroes/factory-bg.jpg')" }} />
// atau
<div className="bg-[url('/assets/images/heroes/factory-bg.jpg')]" />
```

### 2. Menggunakan Tag `<img>` atau Next.js `<Image />`:
```tsx
import Image from 'next/image';

// Next.js Image Component
<Image 
  src="/assets/images/logos/logo-asia-plastik.png" 
  alt="Logo CV Asia Plastik" 
  width={180} 
  height={50} 
/>

// HTML Tag biasa
<img src="/assets/images/heroes/factory-bg.jpg" alt="Pabrik CV Asia Plastik" />
```

## Format yang Direkomendasikan
- **Foto / Background:** `.webp` atau `.jpg` (dikompresi agar loading cepat, resolusi optimal 1920x1080)
- **Logo / Icon:** `.svg` atau `.png` transparan

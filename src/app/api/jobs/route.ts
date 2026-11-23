import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:8787/api/jobs', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (e) {
    // fallback
  }

  return NextResponse.json({
    jobs: [
      {
        id: 'job_qc_supervisor',
        title: 'Supervisor Quality Control (QC) & Injeksi Plastik',
        department: 'Quality Assurance & Produksi Pabrik',
        location: 'Pabrik Sidoarjo, Jawa Timur',
        summary: 'Memimpin tim inspeksi mutu, analisis cacat cetak plastik (flash, shrinkage, bubble), dan kepatuhan ISO 9001.',
        required_skills: [
          'Pengawasan Mutu Injeksi Plastik',
          'Analisis Cacat Cetak (Flash & Shrinkage)',
          'ISO 9001:2015 & Prosedur 5-Why CAPA',
          'Keselamatan Kerja K3 & Prosedur LOTO',
          'Kepemimpinan Shift & Komunikasi Asertif',
        ],
        passing_score: 75,
        duration_minutes: 15,
        status: 'active',
      },
      {
        id: 'job_prod_operator',
        title: 'Operator Mesin Injeksi & Ekstrusi Plastik',
        department: 'Produksi',
        location: 'Pabrik Sidoarjo, Jawa Timur',
        summary: 'Mengoperasikan mesin cetak injection molding dan ekstrusi berkecepatan tinggi sesuai SOP.',
        required_skills: ['Setting Suhu Barel', 'Handling Mold', 'Pemilahan Part Reject', 'Pematuhan APD K3'],
        passing_score: 70,
        duration_minutes: 12,
        status: 'active',
      },
    ],
  });
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token tidak boleh kosong' }, { status: 400 });
    }

    const cleanToken = token.trim();
    process.env.FONNTE_TOKEN = cleanToken;

    // Persist to .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    if (envContent.includes('FONNTE_TOKEN=')) {
      envContent = envContent.replace(/FONNTE_TOKEN=.*/g, `FONNTE_TOKEN=${cleanToken}`);
    } else {
      envContent += `\nFONNTE_TOKEN=${cleanToken}\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Token WhatsApp Fonnte berhasil disimpan dan diaktifkan di server.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

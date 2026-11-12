import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { channel, destination, otp, token } = await request.json();

    if (!channel || !destination || !otp) {
      return NextResponse.json(
        { error: 'Parameter channel, destination, dan otp wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. WhatsApp Delivery
    if (channel === 'wa') {
      const fonnteToken = token || process.env.FONNTE_TOKEN;
      const cleanPhone = destination.replace(/\D/g, '').replace(/^0/, '62');

      if (fonnteToken) {
        try {
          const res = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
              Authorization: fonnteToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              target: cleanPhone,
              message: `*CV. ASIA PLASTIK - PORTAL REKRUTMEN*\n\nKode Verifikasi OTP Anda adalah: *${otp}*\n\nGunakan kode ini untuk menyelesaikan verifikasi akun. Kode hanya berlaku selama 5 menit.\n_Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda._`,
              countryCode: '62',
            }),
          });
          const fonnteData = await res.json();
          return NextResponse.json({
            success: fonnteData.status !== false,
            configured: true,
            provider: 'fonnte',
            result: fonnteData,
          });
        } catch (fonnteErr: any) {
          console.error('Fonnte send error:', fonnteErr);
          return NextResponse.json({
            success: false,
            configured: true,
            error: fonnteErr.message || 'Gagal menghubungi server WhatsApp Fonnte.',
          });
        }
      }

      // If Fonnte token is not yet configured
      return NextResponse.json({
        success: true,
        configured: false,
        provider: 'direct_whatsapp',
        phone: cleanPhone,
        otp,
      });
    }

    // 2. Email Delivery
    if (channel === 'email') {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'CV. Asia Plastik <onboarding@resend.dev>',
              to: [destination],
              subject: `[CV. Asia Plastik] Kode Verifikasi OTP Anda: ${otp}`,
              html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                  <h2 style="color: #0f172a; margin-bottom: 8px;">CV. Asia Plastik</h2>
                  <p style="color: #64748b; font-size: 14px;">Portal Rekrutmen Karyawan</p>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                  <p style="font-size: 14px; color: #334155;">Berikut adalah kode verifikasi OTP untuk menyelesaikan pendaftaran akun Anda:</p>
                  <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7; font-family: monospace;">${otp}</span>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">Kode ini hanya berlaku selama 5 menit. Jangan berikan kode ini kepada siapa pun.</p>
                </div>
              `,
            }),
          });
          const resendData = await res.json();
          return NextResponse.json({
            success: true,
            provider: 'resend',
            result: resendData,
          });
        } catch (resendErr) {
          console.error('Resend error:', resendErr);
        }
      }

      return NextResponse.json({
        success: true,
        provider: 'email_dispatch',
        email: destination,
        otp,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in send-otp route:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengirimkan OTP.' },
      { status: 500 }
    );
  }
}



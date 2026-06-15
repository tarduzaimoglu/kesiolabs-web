import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Vercel'deki SMTP ayarlarını kullanarak transporter oluşturuyoruz
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // Port 465 ise true olmalı, 587 ise false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Gönderilecek Mailin Şablonu
    const mailOptions = {
      from: process.env.MAIL_FROM, 
      to: process.env.MAIL_TO, // Maillerin düşeceği adres (senin adresin)
      replyTo: email, // Müşteriye "Yanıtla" dediğinde gidecek adres
      subject: `KesioLabs Web Formu: ${subject}`,
      html: `
        <h2 style="color: #4f46e5;">Web Sitesinden Yeni İletişim Mesajı</h2>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <hr />
        <p><strong>Mesaj:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    };

    // Maili gönder
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Mail başarıyla gönderildi." }, { status: 200 });

  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json({ success: false, message: "Mail gönderilemedi." }, { status: 500 });
  }
}
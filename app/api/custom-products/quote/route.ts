import nodemailer from "nodemailer";

export const runtime = "nodejs"; // nodemailer için şart

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "");
    const company = String(formData.get("company") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const note = String(formData.get("note") || "");
    const selectedTypes = String(formData.get("selectedTypes") || "");
    const logoFile = formData.get("logo") as File | null;

    if (!name || !company || !phone || !email || !selectedTypes) {
      return Response.json(
        { ok: false, message: "Eksik alan var." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const attachments: any[] = [];

    if (logoFile && typeof logoFile.arrayBuffer === "function") {
      const buf = Buffer.from(await logoFile.arrayBuffer());
      // Çok büyük dosya gelirse mail şişmesin diye basit limit:
      if (buf.length <= 6 * 1024 * 1024) {
        attachments.push({
          filename: logoFile.name || "logo",
          content: buf,
        });
      }
    }

    const subject = `Custom Products Teklif Talebi — ${company}`;
    const html = `
      <h2>Yeni Teklif Talebi</h2>
      <p><b>Ad Soyad:</b> ${escapeHtml(name)}</p>
      <p><b>Firma:</b> ${escapeHtml(company)}</p>
      <p><b>Telefon:</b> ${escapeHtml(phone)}</p>
      <p><b>E-posta:</b> ${escapeHtml(email)}</p>
      <p><b>Seçilen Ürün Türleri:</b> ${escapeHtml(selectedTypes)}</p>
      <p><b>Not:</b><br/>${escapeHtml(note).replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email, // kullanıcıya cevap vermeyi kolaylaştırır
      subject,
      html,
      attachments,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("quote mail error:", err);
    return Response.json(
      { ok: false, message: "Mail gönderilemedi." },
      { status: 500 }
    );
  }
}

// basit HTML escape
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

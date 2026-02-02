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

    // ✅ SMTP ENV doğrulama (localhost'a düşmesin)
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SMTP_HOST) throw new Error("SMTP_HOST missing");
    if (!SMTP_USER) throw new Error("SMTP_USER missing");
    if (!SMTP_PASS) throw new Error("SMTP_PASS missing");

    // ✅ 465 => secure true, 587 => false (istersen SMTP_SECURE ile override)
    const secureDefault = SMTP_PORT === 465;
    const SMTP_SECURE =
      process.env.SMTP_SECURE != null
        ? String(process.env.SMTP_SECURE) === "true"
        : secureDefault;

    // ✅ Gönderen/Alıcı adresleri (senin istediğin düzen)
    // MAIL_FROM: "KesioLabs Forms <kesiolabsforms@gmail.com>"
    // MAIL_TO: kesiolabs.contact@gmail.com
    const FROM =
      process.env.MAIL_FROM || process.env.SMTP_FROM || SMTP_USER;
    const TO =
      process.env.MAIL_TO || process.env.CONTACT_TO || SMTP_USER;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const attachments: any[] = [];

    // Logo dosyası ek (opsiyonel) — 6MB limit
    if (logoFile && typeof logoFile.arrayBuffer === "function") {
      const buf = Buffer.from(await logoFile.arrayBuffer());
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
      from: FROM,
      to: TO,
      replyTo: email, // kullanıcıya cevap vermeyi kolaylaştırır
      subject,
      html,
      attachments,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("quote mail error:", err);
    return Response.json(
      { ok: false, message: "Mail gönderilemedi.", debug: err?.message || String(err) },
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

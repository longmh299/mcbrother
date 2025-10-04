// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // bắt buộc cho Resend/Node API

const resend = new Resend(process.env.RESEND_API_KEY!);

// Hàm render nội dung email
function renderHtml(o: {
  name: string; email: string; phone?: string; subject?: string; message: string;
  ip?: string | null; ua?: string | null;
}) {
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
    <h2>New contact from website</h2>
    <p><b>Name:</b> ${o.name}</p>
    <p><b>Email:</b> ${o.email}</p>
    ${o.phone ? `<p><b>Phone:</b> ${o.phone}</p>` : ""}
    ${o.subject ? `<p><b>Subject:</b> ${o.subject}</p>` : ""}
    <p><b>Message:</b></p>
    <pre style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px">${o.message}</pre>
    <hr/>
    <p style="color:#64748b"><small>IP: ${o.ip ?? "-"} | UA: ${o.ua ?? "-"}</small></p>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;
    const j = await req.json().catch(() => ({} as any));

    // Honeypot chống bot
    if (j.website) return NextResponse.json({ ok: true });

    const name = String(j.name || "").trim();
    const email = String(j.email || "").trim();
    const message = String(j.message || "").trim();
    const phone = j.phone ? String(j.phone).trim() : undefined;
    const subject = j.subject ? String(j.subject).trim() : undefined;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json({ ok: false, error: "Email không hợp lệ" }, { status: 400 });
    }

    const html = renderHtml({ name, email, phone, subject, message, ip, ua });

    const { data, error } = await resend.emails.send({
      from: "MCBROTHER <onboarding@resend.dev>", // đổi lại sau khi verify domain
      to: process.env.CONTACT_TO_EMAIL!,         // địa chỉ nhận
      reply_to: email,
      subject: `📩 Liên hệ mới: ${subject || name}`,
      html,
    });

    if (error) {
      console.error("RESEND_ERROR", error);
      return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }

    console.log("RESEND_ID", data?.id);
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("CONTACT_API_ERROR", e);
    return NextResponse.json({ ok: false, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

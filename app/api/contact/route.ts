import { Resend } from "resend";
import { messageText, parseMessage } from "@/lib/contact";
import { getDict, isLocale } from "@/lib/i18n";

// Formulaire de contact → e-mail de notification au Sulky (Resend).
// Variables Vercel : RESEND_API_KEY, CONTACT_NOTIFY_EMAIL (adresse du bar), RESEND_FROM (domaine vérifié dans Resend,
// ex. « Le Sulky <contact@mondomaine.fr> » ; sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte).
// Sans ces variables, la route répond { notified: false } et le site invite le client à appeler.

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  // Champ piège invisible : un robot le remplit, un humain non
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true, notified: false });

  const lang = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const m = parseMessage(body.message);
  if (!m) return Response.json({ ok: false }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, notified: false });

  const fr = getDict("fr");
  const text = `${messageText(m, fr)}${lang !== "fr" ? `\n\n${fr.contact.mail.lang} : ${lang.toUpperCase()}` : ""}`;
  const html = `<div style="background:#F6F0E4;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#fff;border-top:4px solid #1F4D3A;padding:28px;font-family:Georgia,serif;color:#181818;font-size:15px;line-height:1.7">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.18em;color:#B3261E">LE SULKY</p>
<h1 style="margin:0 0 20px;font-weight:normal;font-size:22px">${escapeHtml(fr.contact.mail.title)}</h1>
<p style="margin:0;white-space:pre-line">${escapeHtml(text)}</p></div></div>`;

  try {
    const r = await new Resend(key).emails.send({
      from: process.env.RESEND_FROM ?? "Le Sulky <onboarding@resend.dev>",
      to,
      ...(m.email ? { replyTo: m.email } : {}),
      subject: `${fr.contact.mail.subject} · ${fr.contact.subjects[m.subject]} · ${m.name}`,
      html,
      text,
    });
    return Response.json({ ok: true, notified: !r.error });
  } catch {
    return Response.json({ ok: true, notified: false });
  }
}

import type { Dict } from "@/lib/i18n";

export const SUBJECTS = ["question", "privatisation", "colis", "autre"] as const;
export type Subject = (typeof SUBJECTS)[number];

export type ContactMessage = { name: string; phone: string; email: string; subject: Subject; message: string };

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Nettoie un message reçu côté serveur : null s'il est incomplet. Le téléphone ou l'e-mail suffit. */
export function parseMessage(v: unknown): ContactMessage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const m: ContactMessage = {
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
    subject: (SUBJECTS as readonly string[]).includes(o.subject as string) ? (o.subject as Subject) : "question",
    message: str(o.message, 3000),
  };
  if (!m.name || !m.message) return null;
  if (m.phone && !isPhone(m.phone)) return null;
  if (m.email && !isEmail(m.email)) return null;
  if (!m.phone && !m.email) return null;
  return m;
}

/** Récapitulatif texte du message (e-mail de notification). */
export function messageText(m: ContactMessage, d: Dict) {
  const t = d.contact.mail;
  return [
    `${t.name} : ${m.name}`,
    m.phone ? `${t.phone} : ${m.phone}` : "",
    m.email ? `${t.email} : ${m.email}` : "",
    `${t.subject2} : ${d.contact.subjects[m.subject]}`,
    "",
    `${t.message} :`,
    m.message,
  ]
    .filter((l, i) => l !== "" || i === 4)
    .join("\n");
}

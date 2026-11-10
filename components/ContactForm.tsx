"use client";

import { useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { PhoneIcon } from "@/components/icons";
import { SUBJECTS, isEmail, isPhone } from "@/lib/contact";

type State = "idle" | "sending" | "ok" | "okNoMail" | "error";

export function ContactForm() {
  const { lang, d } = useLocale();
  const c = d.contact;
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = Object.fromEntries(["name", "phone", "email", "subject", "message", "website"].map((k) => [k, String(f.get(k) ?? "").trim()]));
    const errs: Record<string, string> = {};
    if (!v.name) errs.name = c.required;
    if (!v.message) errs.message = c.required;
    if (v.phone && !isPhone(v.phone)) errs.phone = c.invalidPhone;
    if (v.email && !isEmail(v.email)) errs.email = c.invalidEmail;
    if (!v.phone && !v.email) errs.phone = c.required;
    setErrors(errs);
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang, website: v.website, message: v }) });
      const j = (await r.json()) as { ok: boolean; notified?: boolean };
      if (!j.ok) return setState("error");
      setState(j.notified ? "ok" : "okNoMail");
      if (j.notified) (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }

  const label = "mb-1.5 block text-sm font-medium";
  const err = (k: string) => errors[k] && <span id={`${k}-err`} className="mt-1.5 block text-sm text-red">{errors[k]}</span>;
  const aria = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="name" className={label}>
          {c.name} <span className="font-normal text-muted">({c.required})</span>
        </label>
        <input id="name" name="name" autoComplete="name" className="field" {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="phone" className={label}>
          {c.phone}
        </label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" {...aria("phone")} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="email" className={label}>
          {c.email}
        </label>
        <input id="email" name="email" type="email" autoComplete="email" spellCheck={false} className="field" {...aria("email")} />
        {err("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="subject" className={label}>
          {c.subject}
        </label>
        <select id="subject" name="subject" className="field" defaultValue="question">
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {c.subjects[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>
          {c.message} <span className="font-normal text-muted">({c.required})</span>
        </label>
        <textarea id="message" name="message" rows={5} className="field resize-y" {...aria("message")} />
        {err("message")}
      </div>
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-green" disabled={state === "sending"}>
          {state === "sending" ? c.sending : c.send}
        </button>
        <a href={`tel:${site.phoneIntl}`} className="btn btn-line text-red">
          <PhoneIcon className="size-4" />
          {c.call}
        </a>
      </div>
      <p className="text-sm text-muted sm:col-span-2" role="status" aria-live="polite">
        {state === "ok" && <span className="text-green">{c.ok}</span>}
        {state === "okNoMail" && <span className="text-ink">{c.okNoMail}</span>}
        {state === "error" && <span className="text-red">{c.error}</span>}
        {(state === "idle" || state === "sending") && c.privacy}
      </p>
    </form>
  );
}

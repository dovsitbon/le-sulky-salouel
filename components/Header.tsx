"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { Logo } from "@/components/Logo";
import { CloseIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/locales";
import { PAGE_IDS, SLUGS } from "@/lib/pages";

/** Adresse de la page courante dans une autre langue (les pages secondaires ont des adresses traduites). */
function switchPath(path: string, from: Locale, to: Locale) {
  const [, , slug, ...rest] = path.split("/");
  if (!slug) return `/${to}`;
  const id = PAGE_IDS.find((p) => SLUGS[p][from] === slug);
  return `/${to}/${id ? SLUGS[id][to] : slug}${rest.length ? `/${rest.join("/")}` : ""}`;
}

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, d } = useLocale();
  const path = usePathname() ?? `/${lang}`;
  return (
    <nav aria-label={d.a11y.lang} className={`flex items-center text-[0.8125rem] font-medium tracking-[0.12em] ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1 text-muted/60" aria-hidden="true">·</span>}
          <Link
            href={switchPath(path, lang, l)}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
            }}
            className={`grid min-h-11 min-w-8 place-items-center uppercase transition-colors ${l === lang ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export function Header() {
  const { lang, d } = useLocale();
  const [open, setOpen] = useState(false);
  const home = `/${lang}`;
  const nav = [
    { href: `${home}#services`, label: d.nav.services },
    { href: `${home}#evenements`, label: d.nav.events },
    { href: `${home}#infos`, label: d.nav.infos },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/95 backdrop-blur-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
        {d.a11y.skip}
      </a>
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[4.5rem]">
        <nav aria-label="Menu" className="hidden items-center gap-7 text-[0.9375rem] md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="py-2 text-ink/85 transition-colors hover:text-red">
              {n.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="-ms-2 grid size-11 place-items-center md:hidden" aria-expanded={open} aria-controls="menu-mobile" aria-label={d.a11y.menu} onClick={() => setOpen(true)}>
          <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
            <span className="h-px bg-ink" />
            <span className="h-px bg-ink" />
            <span className="h-px w-3 bg-ink" />
          </span>
        </button>

        <Link href={home} aria-label={d.a11y.logoHome} className="justify-self-center">
          <Logo compact />
        </Link>

        <div className="flex items-center justify-end gap-3 lg:gap-5">
          <LangSwitch className="hidden md:flex" />
          <a href={`tel:${site.phoneIntl}`} className="hidden items-center gap-2 whitespace-nowrap text-[0.9375rem] tabular-nums transition-colors hover:text-red xl:inline-flex">
            <PhoneIcon className="size-4" />
            {site.phone}
          </a>
          <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn btn-red min-h-10 px-4 text-sm md:min-h-11 md:px-5">
            <PinIcon className="size-4" />
            <span className="hidden sm:inline">{d.nav.directions}</span>
            <span className="sr-only sm:hidden">{d.nav.directions}</span>
          </a>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" role="dialog" aria-modal="true" aria-label={d.a11y.menu} className="fixed inset-0 z-50 flex flex-col bg-cream md:hidden">
          <div className="wrap flex h-16 items-center justify-between">
            <Logo compact />
            <button type="button" className="-me-2 grid size-11 place-items-center" aria-label={d.a11y.closeMenu} onClick={() => setOpen(false)}>
              <CloseIcon className="size-5" />
            </button>
          </div>
          <nav className="wrap mt-6 flex flex-col">
            {[...nav, { href: `${home}#contact`, label: d.nav.contact }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-3xl">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="wrap mt-auto flex items-center justify-between pb-28">
            <a href={`tel:${site.phoneIntl}`} className="inline-flex min-h-11 items-center gap-2 tabular-nums">
              <PhoneIcon className="size-4" />
              {site.phone}
            </a>
            <LangSwitch />
          </div>
        </div>
      )}
    </header>
  );
}

/** Sur mobile, « Itinéraire » et « Appeler » restent fixés en bas de l'écran. */
export function MobileBar() {
  const { d } = useLocale();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn btn-red">
          <PinIcon className="size-4" />
          {d.nav.directions}
        </a>
        <a href={`tel:${site.phoneIntl}`} className="btn btn-line text-green">
          <PhoneIcon className="size-4" />
          {d.nav.call}
        </a>
      </div>
    </div>
  );
}

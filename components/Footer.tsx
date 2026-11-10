import Link from "next/link";
import site from "@/data/site.json";
import type { Dict, Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";
import { Mark } from "@/components/Logo";
import { HoursTable } from "@/components/HoursTable";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-green-deep text-cream/85">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <Link href={`/${lang}`} className="inline-flex flex-col gap-3 text-cream" aria-label={d.a11y.logoHome}>
            <Mark className="h-10 w-auto self-start text-gold-soft" />
            <span className="display text-3xl tracking-[0.14em]" translate="no">
              LE SULKY
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{d.footer.tagline}</p>
          <address className="mt-6 text-sm leading-relaxed not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
            <br />
            <a href={`tel:${site.phoneIntl}`} className="mt-2 inline-block text-cream tabular-nums underline-offset-4 hover:underline">
              {site.phone}
            </a>
          </address>
        </div>
        <div>
          <h2 className="caps text-gold-soft">{d.footer.hours}</h2>
          <HoursTable lang={lang} d={d} className="mt-4 text-sm [&_div]:border-cream/15" />
        </div>
        <div>
          <h2 className="caps text-gold-soft">{d.footer.pages}</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {(["bar", "relais", "tarifs", "legal"] as const).map((id) => (
              <li key={id}>
                <Link href={pagePath(id, lang)} className="inline-block py-1.5 underline-offset-4 hover:text-cream hover:underline">
                  {d.pages[id].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="wrap py-5 text-xs text-cream/65">
          © {year} {d.footer.rights} · {site.address.city}
        </p>
      </div>
    </footer>
  );
}

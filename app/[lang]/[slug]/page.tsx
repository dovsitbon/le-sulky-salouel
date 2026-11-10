import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import tarifs from "@/data/tarifs.json";
import { getDict, isLocale, locales, ogLocale, type Dict, type Locale } from "@/lib/i18n";
import { price } from "@/lib/format";
import { pageJsonLd } from "@/lib/jsonld";
import { PAGE_IDS, SLUGS, pageOfSlug, pagePath, type PageId } from "@/lib/pages";
import { PinIcon, PhoneIcon } from "@/components/icons";
import { PhotoSlot } from "@/components/PhotoSlot";
import { HoursTable } from "@/components/HoursTable";
import { OpenStatus } from "@/components/OpenStatus";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const id = pageOfSlug(slug, lang);
  if (!id) return {};
  const p = getDict(lang).pages[id];
  return {
    title: p.metaTitle,
    description: p.description,
    alternates: { canonical: pagePath(id, lang), languages: { ...Object.fromEntries(locales.map((l) => [l, pagePath(id, l)])), "x-default": pagePath(id, "fr") } },
    openGraph: { type: "website", url: pagePath(id, lang), siteName: site.name, title: p.metaTitle, description: p.description, locale: ogLocale[lang], images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    robots: id === "legal" ? { index: false, follow: true } : undefined,
  };
}

function PageHead({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <header className="max-w-3xl">
      <p className="caps text-red">{kicker}</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">{title}</h1>
      <span className="rail mt-6" aria-hidden="true" />
      {intro && <p className="lead mt-6">{intro}</p>}
    </header>
  );
}

function Actions({ d, label }: { d: Dict; label: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn btn-red">
        <PinIcon className="size-4" />
        {label}
      </a>
      <a href={`tel:${site.phoneIntl}`} className="btn btn-line text-green">
        <PhoneIcon className="size-4" />
        {site.phone}
      </a>
    </div>
  );
}

/** Pages « Bar tabac à Salouël » et « Point relais colis à Salouël » : texte local, photo, horaires. */
function LocalPage({ id, d, lang }: { id: "bar" | "relais"; d: Dict; lang: Locale }) {
  const p = d.pages[id];
  return (
    <>
      <PageHead kicker={p.kicker} title={p.h1} intro={p.intro} />
      <div className="mt-8">
        <Actions d={d} label={p.cta} />
      </div>
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="space-y-10">
          {p.sections.map((s) => (
            <section key={s.title}>
              <h2 className="display text-[1.75rem]">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </section>
          ))}
        </div>
        <aside className="space-y-8">
          <PhotoSlot id={id === "bar" ? "comptoir" : "colis"} d={d} className="aspect-[4/3]" />
          <div className="border border-line bg-paper p-6">
            <h2 className="caps text-[0.6875rem] text-red">{d.infos.hours}</h2>
            <HoursTable lang={lang} d={d} className="mt-3" />
            <OpenStatus className="mt-4 text-sm" />
            <p className="mt-5 text-sm leading-relaxed">
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Tarifs({ d, lang }: { d: Dict; lang: Locale }) {
  const t = d.tarifs;
  return (
    <>
      <PageHead kicker={d.pages.tarifs.kicker} title={d.pages.tarifs.h1} intro={t.intro} />
      <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {tarifs.categories.map((c) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`}>
            <h2 id={`cat-${c.id}`} className="display border-b border-ink pb-3 text-[1.75rem]">
              {t.categories[c.id as keyof Dict["tarifs"]["categories"]]}
            </h2>
            <ul>
              {c.items.map((it) => {
                const item = t.items[it.id as keyof Dict["tarifs"]["items"]];
                const from = "from" in it && it.from;
                const value = it.price === null ? t.atCounter : it.price === 0 ? t.free : `${from ? `${t.from} ` : ""}${price(it.price, lang)}`;
                return (
                  <li key={it.id} className="flex items-baseline gap-3 border-b border-line py-3.5">
                    <span>
                      {item.name}
                      {item.desc && <span className="block text-sm text-muted">{item.desc}</span>}
                    </span>
                    <span className="flex-1 border-b border-dotted border-line" aria-hidden="true" />
                    <span className={`shrink-0 text-end tabular-nums ${it.price === null ? "text-sm text-muted italic" : "font-medium"}`}>{value}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted">{t.note}</p>
    </>
  );
}

function Legal({ d }: { d: Dict }) {
  const l = d.pages.legal;
  const v = (s: string) => s || <span className="text-muted italic">{l.toFill}</span>;
  return (
    <>
      <PageHead kicker={l.kicker} title={l.h1} />
      <div className="mt-12 max-w-2xl space-y-10 leading-relaxed">
        <section>
          <h2 className="display text-2xl">{l.editor}</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-muted">
            <dt>{l.company}</dt>
            <dd>{v(site.legal.company ? `${site.legal.company}${site.legal.legalForm ? `, ${site.legal.legalForm}` : ""}` : "")} (Le Sulky)</dd>
            <dt>{l.siret}</dt>
            <dd>{v(site.legal.siret)}</dd>
            <dt>{l.director}</dt>
            <dd>{v(site.legal.director)}</dd>
            <dt>{d.infos.address}</dt>
            <dd>
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </dd>
            <dt>{d.infos.phone}</dt>
            <dd>{site.phone}</dd>
          </dl>
        </section>
        <section>
          <h2 className="display text-2xl">{l.host}</h2>
          <p className="mt-3 text-muted">{site.legal.host}</p>
        </section>
        <section>
          <h2 className="display text-2xl">{l.data}</h2>
          <p className="mt-3 text-muted">{l.dataText}</p>
        </section>
        <section>
          <h2 className="display text-2xl">{l.cookies}</h2>
          <p className="mt-3 text-muted">{l.cookiesText}</p>
        </section>
        <section>
          <h2 className="display text-2xl">{l.photos}</h2>
          <p className="mt-3 text-muted">{l.photosText}</p>
        </section>
      </div>
    </>
  );
}

export default async function SubPage({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const id = pageOfSlug(slug, lang) as PageId | null;
  if (!id) notFound();
  const d = getDict(lang);
  return (
    <div className="wrap py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(lang, id)) }} />
      <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
        <Link href={`/${lang}`} className="underline-offset-4 hover:text-ink hover:underline">
          {site.name}
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page">{d.pages[id].title}</span>
      </nav>
      {(id === "bar" || id === "relais") && <LocalPage id={id} d={d} lang={lang} />}
      {id === "tarifs" && <Tarifs d={d} lang={lang} />}
      {id === "legal" && <Legal d={d} />}
    </div>
  );
}

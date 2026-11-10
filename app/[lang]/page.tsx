import Link from "next/link";
import Image from "next/image";
import site from "@/data/site.json";
import services from "@/data/services.json";
import evenements from "@/data/evenements.json";
import { fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { formatDay, isoDay } from "@/lib/format";
import { homeJsonLd } from "@/lib/jsonld";
import { pagePath } from "@/lib/pages";
import { photoOf, type PhotoSlotId } from "@/lib/photos";
import { ArrowIcon, PhoneIcon, PinIcon, PlusIcon, SERVICE_ICONS, StarIcon, type IconName } from "@/components/icons";
import { Mark } from "@/components/Logo";
import { OpenStatus } from "@/components/OpenStatus";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { HoursTable } from "@/components/HoursTable";
import { MapEmbed } from "@/components/MapEmbed";
import { ContactForm } from "@/components/ContactForm";

// Les événements passés disparaissent d'eux-mêmes : la page est régénérée chaque jour
export const revalidate = 86400;

type Ev = { id: string; kind: "course" | "match" | "soiree"; recurring?: boolean; date?: string; fr: { title: string; when: string; text: string }; en: { title: string; when: string; text: string } };

function SectionHead({ kicker, title, intro, id, light = false }: { kicker: string; title: string; intro?: string; id?: string; light?: boolean }) {
  return (
    <Reveal className="max-w-2xl">
      <p className={`caps ${light ? "text-gold-soft" : "text-red"}`}>{kicker}</p>
      <h2 id={id} className={`display mt-4 text-[clamp(2rem,4.6vw,3.25rem)] ${light ? "text-cream" : ""}`}>
        {title}
      </h2>
      <span className="rail mt-6" aria-hidden="true" />
      {intro && <p className={`lead mt-6 ${light ? "text-cream/85" : ""}`}>{intro}</p>}
    </Reveal>
  );
}

function Rating({ d, lang, light = false }: { d: Dict; lang: Locale; light?: boolean }) {
  const value = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1 }).format(site.rating.value);
  return (
    <a href={site.reviewsUrl} target="_blank" rel="noopener" className={`inline-flex items-center gap-2 underline-offset-4 hover:underline ${light ? "text-cream" : "text-ink"}`}>
      <span className="flex text-gold" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className="size-3.5" />
        ))}
      </span>
      <span>{fill(d.hero.rating, { value, count: site.rating.count })}</span>
      <span className="sr-only">{d.a11y.newTab}</span>
    </a>
  );
}

function Hero({ d, lang }: { d: Dict; lang: Locale }) {
  const photo = photoOf("hero");
  return (
    <section className="relative flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden bg-green text-cream" aria-labelledby="hero-title">
      {photo ? (
        <>
          <Image src={photo.src} alt={d.alt.hero} fill priority sizes="100vw" quality={70} className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(22_58_43/0.92),rgb(22_58_43/0.35)_55%,rgb(22_58_43/0.15))]" />
        </>
      ) : (
        // En attendant la photo de la façade : la piste de l'hippodrome et le sulky, au trait or
        <div className="absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-gold" fill="none" stroke="currentColor">
            <g strokeOpacity="0.22" strokeWidth="1">
              <ellipse cx="840" cy="420" rx="620" ry="300" />
              <ellipse cx="840" cy="420" rx="560" ry="250" />
              <ellipse cx="840" cy="420" rx="500" ry="200" strokeDasharray="2 10" />
            </g>
            <g strokeOpacity="0.16" strokeWidth="1">
              {Array.from({ length: 22 }, (_, i) => (
                <path key={i} d={`M${240 + i * 48} 700v-46`} />
              ))}
              <path d="M200 654h1100M200 668h1100" />
            </g>
          </svg>
          <Mark className="absolute end-[6%] top-[14%] hidden h-auto w-[30vw] max-w-[480px] text-gold/45 xl:block" strokeWidth={1.1} />
          <p className="caps absolute end-5 top-5 text-[0.6875rem] text-cream/55 md:end-10">{d.hero.photoPending}</p>
        </div>
      )}
      <div className="wrap relative pt-24 pb-14 md:pb-20">
        <p className="caps text-[0.6875rem] text-gold-soft md:text-xs">{d.hero.kicker}</p>
        <h1 id="hero-title" className="display mt-5 max-w-[14ch] text-[clamp(2.75rem,8.4vw,6.25rem)]">
          {d.hero.title}
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cream/90">{d.hero.sub}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn btn-red">
            <PinIcon className="size-4" />
            {d.hero.ctaDirections}
          </a>
          <a href="#services" className="btn btn-line text-cream">
            {d.hero.ctaServices}
          </a>
        </div>
        <div className="mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <Rating d={d} lang={lang} light />
          <span className="hidden h-4 w-px bg-cream/30 sm:block" aria-hidden="true" />
          <OpenStatus tone="light" />
        </div>
      </div>
    </section>
  );
}

function Tiles({ d }: { d: Dict }) {
  return (
    <section aria-labelledby="tiles-title" className="bg-cream">
      <h2 id="tiles-title" className="sr-only">
        {d.tiles.title}
      </h2>
      <ul className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 lg:grid-cols-6">
        {services.items.map((s) => {
          const Icon = SERVICE_ICONS[s.icon as IconName];
          const photo = photoOf(s.photo as PhotoSlotId);
          return (
            <li key={s.id}>
              <a href={`#service-${s.id}`} className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden bg-green text-cream lg:aspect-[3/4]">
                {photo && (
                  <>
                    <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 17vw, 50vw" quality={70} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 bg-green-deep/55" aria-hidden="true" />
                  </>
                )}
                {!photo && <Icon className="relative size-8 text-gold-soft transition-transform duration-500 group-hover:-translate-y-0.5" />}
                <span className="caps relative px-3 text-center text-[0.75rem] tracking-[0.2em]">{d.tiles.items[s.id as keyof Dict["tiles"]["items"]]}</span>
                <span className="relative h-px w-6 bg-gold/70 transition-all duration-500 group-hover:w-10" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Strip({ d }: { d: Dict }) {
  return (
    <section aria-labelledby="strip-title" className="border-b border-line bg-paper">
      <h2 id="strip-title" className="sr-only">
        {d.strip.title}
      </h2>
      <ul className="wrap grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4 md:py-14">
        {d.strip.items.map((it, i) => {
          const Icon = SERVICE_ICONS[it.icon as IconName];
          return (
            <li key={it.title} className={`flex flex-col items-center px-3 text-center md:px-6 ${i > 0 ? "md:border-s md:border-line" : ""}`}>
              <Icon className="size-9 text-green" />
              <h3 className="mt-4 font-display text-lg">{it.title}</h3>
              <p className="mt-1.5 max-w-[22ch] text-sm leading-relaxed text-muted">{it.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Services({ d, lang }: { d: Dict; lang: Locale }) {
  return (
    <section id="services" aria-labelledby="services-title" className="py-20 md:py-28">
      <div className="wrap">
        <SectionHead id="services-title" kicker={d.services.kicker} title={d.services.title} intro={d.services.intro} />
        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => {
            const t = d.services.items[s.id as keyof Dict["services"]["items"]];
            const Icon = SERVICE_ICONS[s.icon as IconName];
            return (
              <li key={s.id} id={`service-${s.id}`} className="scroll-mt-28">
                <Reveal delay={(i % 3) * 0.06}>
                  <PhotoSlot id={s.photo as PhotoSlotId} d={d} className="aspect-[3/2]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  <div className="mt-6 flex items-center gap-3">
                    <Icon className="size-6 text-red" />
                    <h3 className="display text-2xl">{t.name}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{t.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-14">
          <Link href={pagePath("tarifs", lang)} className="btn btn-line text-green">
            {d.services.pricesCta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Events({ d, lang }: { d: Dict; lang: Locale }) {
  const today = isoDay(new Date());
  const items = (evenements.items as Ev[])
    .filter((e) => e.recurring || (e.date && e.date >= today))
    .sort((a, b) => (a.recurring ? 0 : 1) - (b.recurring ? 0 : 1) || (a.date ?? "").localeCompare(b.date ?? ""));
  return (
    <section id="evenements" aria-labelledby="events-title" className="bg-green py-20 text-cream md:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead id="events-title" kicker={d.events.kicker} title={d.events.title} intro={d.events.intro} light />
        {items.length ? (
          <ol className="border-t border-cream/20">
            {items.map((e) => {
              const t = e[lang];
              return (
                <li key={e.id} className="grid grid-cols-[5.5rem_1fr] gap-5 border-b border-cream/20 py-7 md:grid-cols-[7rem_1fr] md:gap-8">
                  <div className="text-gold-soft">
                    {e.date ? (
                      <>
                        <span className="display block text-5xl tabular-nums">{formatDay(e.date, lang, { day: "numeric" })}</span>
                        <span className="caps mt-1 block text-[0.6875rem]">{formatDay(e.date, lang, { month: "short", year: "numeric" })}</span>
                      </>
                    ) : (
                      <span className="caps block pt-1.5 text-[0.6875rem] leading-relaxed">{t.when || d.events.recurring}</span>
                    )}
                  </div>
                  <div>
                    <p className="caps text-[0.6875rem] text-cream/65">{d.events.kinds[e.kind]}</p>
                    <h3 className="display mt-2 text-2xl md:text-[1.75rem]">{t.title}</h3>
                    <p className="mt-2 max-w-prose leading-relaxed text-cream/85">{t.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="lead text-cream/85">{d.events.empty}</p>
        )}
      </div>
    </section>
  );
}

function Blocks({ d }: { d: Dict }) {
  const hrefs: Record<string, { href: string; external?: boolean; icon?: boolean }> = {
    cafe: { href: site.directionsUrl, external: true, icon: true },
    colis: { href: "#infos" },
    courses: { href: "#evenements" },
  };
  return (
    <section aria-label={d.blocks.map((b) => b.kicker).join(", ")} className="py-20 md:py-28">
      <div className="wrap flex flex-col gap-20 md:gap-28">
        {d.blocks.map((b, i) => {
          const link = hrefs[b.id];
          return (
            <article key={b.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <Reveal className={i % 2 ? "md:order-2" : ""}>
                <PhotoSlot id={b.photo as PhotoSlotId} d={d} className="aspect-[4/5] md:aspect-[5/6]" />
              </Reveal>
              <Reveal delay={0.08} className="max-w-md">
                <p className="caps text-red">{b.kicker}</p>
                <h2 className="display mt-4 text-[clamp(2rem,4vw,3rem)]">{b.title}</h2>
                <span className="rail mt-6" aria-hidden="true" />
                <p className="lead mt-6">{b.text}</p>
                <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener" } : {})} className={`btn mt-8 ${link.external ? "btn-red" : "btn-green"}`}>
                  {link.icon && <PinIcon className="size-4" />}
                  {b.cta}
                  {!link.icon && <ArrowIcon />}
                </a>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Reviews({ d, lang }: { d: Dict; lang: Locale }) {
  const value = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1 }).format(site.rating.value);
  return (
    <section aria-labelledby="reviews-title" className="border-y border-line bg-paper py-20 md:py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
        <Reveal>
          <p className="caps text-red">{d.reviews.kicker}</p>
          <h2 id="reviews-title" className="display mt-4 text-[clamp(2rem,4vw,3rem)]">
            {d.reviews.title}
          </h2>
          <p className="mt-8 flex items-end gap-3">
            <span className="display text-7xl text-green">{value}</span>
            <span className="pb-2 text-muted">/ 5</span>
          </p>
          <span className="mt-2 flex text-gold" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className="size-4" />
            ))}
          </span>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">{fill(d.reviews.text, { value, count: site.rating.count })}</p>
          <a href={site.reviewsUrl} target="_blank" rel="noopener" className="btn btn-line mt-7 text-green">
            {d.reviews.cta}
            <ArrowIcon />
            <span className="sr-only">{d.a11y.newTab}</span>
          </a>
          <p className="mt-4 text-xs text-muted">{fill(d.reviews.checked, { date: formatDay(site.rating.checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>
        </Reveal>
        {/* À REMPLIR avec de vrais avis clients (reprendre de vrais avis Google, avec l'accord du gérant et des auteurs). N'en inventer aucun. */}
        <ul className="grid gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex min-h-56 flex-col justify-between border border-dashed border-green/30 p-6">
              <span className="display text-5xl leading-none text-gold/70" aria-hidden="true">
                “
              </span>
              <p className="font-display text-green/70 italic">{d.reviews.slot}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Infos({ d, lang }: { d: Dict; lang: Locale }) {
  const dt = "caps text-[0.6875rem] text-red";
  return (
    <section id="infos" aria-labelledby="infos-title" className="py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHead id="infos-title" kicker={d.infos.kicker} title={d.infos.title} />
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className={dt}>{d.infos.address}</dt>
              <dd className="mt-2 font-display text-xl leading-snug">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </dd>
            </div>
            <div>
              <dt className={dt}>{d.infos.phone}</dt>
              <dd className="mt-2">
                <a href={`tel:${site.phoneIntl}`} className="font-display text-xl tabular-nums underline-offset-4 hover:text-red hover:underline">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={dt}>{d.infos.hours}</dt>
              <dd className="mt-2">
                <HoursTable lang={lang} d={d} />
                <OpenStatus className="mt-3 text-sm" />
                <p className="mt-2 text-sm text-muted">{d.infos.toConfirm}</p>
              </dd>
            </div>
            <div>
              <dt className={dt}>{d.infos.access}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{d.infos.accessText}</dd>
            </div>
            <div>
              <dt className={dt}>{d.infos.parking}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{d.infos.parkingText}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={site.directionsUrl} target="_blank" rel="noopener" className="btn btn-red">
              <PinIcon className="size-4" />
              {d.infos.directions}
            </a>
            <a href={`tel:${site.phoneIntl}`} className="btn btn-line text-green">
              <PhoneIcon className="size-4" />
              {d.nav.call}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <PhotoSlot id="facade" d={d} className="aspect-[16/10]" />
          <MapEmbed className="aspect-[16/10] lg:flex-1" />
        </div>
      </div>
    </section>
  );
}

function Faq({ d }: { d: Dict }) {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead id="faq-title" kicker={d.faq.kicker} title={d.faq.title} />
        <div className="border-t border-line">
          {d.faq.items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <PlusIcon className="size-5 shrink-0 text-red transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-prose pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ d }: { d: Dict }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-cream-deep py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead id="contact-title" kicker={d.contact.kicker} title={d.contact.title} intro={d.contact.intro} />
        <ContactForm />
      </div>
    </section>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const d = getDict(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />
      <Hero d={d} lang={lang} />
      <Tiles d={d} />
      <Strip d={d} />
      <Services d={d} lang={lang} />
      <Events d={d} lang={lang} />
      <Blocks d={d} />
      <Reviews d={d} lang={lang} />
      <Infos d={d} lang={lang} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}

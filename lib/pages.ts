import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue
export const PAGE_IDS = ["bar", "relais", "tarifs", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  bar: { fr: "bar-tabac-salouel", en: "bar-tobacconist-salouel" },
  relais: { fr: "point-relais-colis-salouel", en: "parcel-pickup-point-salouel" },
  tarifs: { fr: "tarifs", en: "prices" },
  legal: { fr: "mentions-legales", en: "legal-notice" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;

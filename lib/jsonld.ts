import site from "@/data/site.json";
import services from "@/data/services.json";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { weekHours } from "@/lib/hours";
import { pagePath, type PageId } from "@/lib/pages";

const BUSINESS = `${site.url}/#le-sulky`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Le Sulky : à la fois bar (BarOrPub) et commerce (Store : tabac, jeux, point relais). */
function business(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": ["BarOrPub", "Store"],
    "@id": BUSINESS,
    name: site.name,
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`],
    logo: `${site.url}/logo.svg`,
    telephone: site.phoneIntl,
    priceRange: "€",
    currenciesAccepted: "EUR",
    address: { "@type": "PostalAddress", streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    areaServed: ["Salouël", "Amiens", "Pont-de-Metz", "Saleux"],
    openingHoursSpecification: weekHours().flatMap((slots, i) => slots.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAYS[i]}`, opens, closes }))),
    // Note Google relevée à la main (data/site.json → rating.checked) : à mettre à jour de temps en temps
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1, description: `Google, ${site.rating.checked}` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: d.services.title,
      itemListElement: services.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d.services.items[s.id as keyof typeof d.services.items].name } })),
    },
    knowsLanguage: ["fr", "en"],
  };
}

/** Données structurées de l'accueil : commerce, horaires, note Google, FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: [...locales], publisher: { "@id": BUSINESS } },
      business(lang),
      { "@type": "FAQPage", mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

/** Données structurées d'une page secondaire, avec fil d'Ariane. */
export function pageJsonLd(lang: Locale, id: PageId) {
  const d = getDict(lang);
  const url = `${site.url}${pagePath(id, lang)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      { "@type": "WebPage", "@id": `${url}#page`, url, name: d.pages[id].metaTitle, inLanguage: lang, about: { "@id": BUSINESS } },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.pages[id].title, item: url },
        ],
      },
    ],
  };
}

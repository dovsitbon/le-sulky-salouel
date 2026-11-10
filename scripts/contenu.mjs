// Génère CONTENU.md (tous les textes, prix, horaires et infos à demander) depuis locales/ et data/. Lancer : npm run contenu
import { readFileSync, writeFileSync } from "node:fs";

const j = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const fr = j("locales/fr.json");
const en = j("locales/en.json");
const site = j("data/site.json");
const hours = j("data/horaires.json");
const services = j("data/services.json");
const events = j("data/evenements.json");
const tarifs = j("data/tarifs.json");
const annonces = j("data/annonces.json");

const days = fr.infos.days;
const eur = (n) => n.toFixed(2).replace(".", ",") + " €";
const L = [];
const p = (...s) => L.push(...s);

p("# Le Sulky : contenu du site, à valider", "", `Site : ${site.url} · Textes en français (l'anglais suit les mêmes blocs, dans locales/en.json).`, "Tout ce qui est marqué **à remplir** ou **à confirmer** attend la réponse du gérant.", "");

p("## Infos à demander au gérant", "",
  "- [ ] Son prénom (et celui du gérant) et l'histoire du Sulky : depuis quand, pourquoi ce nom",
  "- [ ] La liste exacte des services : FDJ (paris sportifs ?), presse, recharges, Nickel, timbres, cartes cadeaux…",
  "- [ ] Le réseau du point relais : Relais Colis, Mondial Relay, Pickup, Chronopost, UPS…",
  "- [ ] Les horaires exacts, jours fériés et congés annuels",
  "- [ ] Les événements diffusés : écran des courses, matchs (lesquels ?), soirées",
  "- [ ] Une adresse e-mail pour recevoir les messages du formulaire",
  "- [ ] Un numéro de portable pour activer WhatsApp (sinon on reste sur le fixe)",
  "- [ ] Des photos : façade, comptoir le matin, linéaire tabac, écran PMU, coin colis, l'équipe (sans visages de clients)",
  "- [ ] Le logo de l'enseigne s'il existe (fichier ou photo nette)",
  "- [ ] Raison sociale, forme juridique, SIRET, directeur de la publication (mentions légales)",
  "- [ ] Stationnement et arrêt de bus le plus proche",
  "- [ ] Les prix du bar (café, crème, chocolat, demi, softs) et les moyens de paiement",
  "- [ ] Son accord pour reprendre quelques vrais avis Google sur le site", "");

p("## Titre du hero : 3 propositions", "", `1. **${fr.hero.title}** (retenu)`, "2. Votre bar-tabac dès 6 h", "3. Le rendez-vous de Salouël", "");

p("## Référencement", "", `- Title : ${fr.meta.title}`, `- Description : ${fr.meta.description}`, `- Title EN : ${en.meta.title}`, "");

p("## Bandeau du haut", "", `- Par défaut : ${annonces.default.fr}`, ...annonces.items.map((a) => `- ${a.from} → ${a.to}${a.active === false ? " (inactif)" : ""} : ${a.fr}`), "");

p("## Horaires (à confirmer)", "", ...Object.entries(hours.week).map(([k, s]) => `- ${days[k - 1]} : ${s.length ? s.map(([a, b]) => `${a} – ${b}`).join(", ") : "fermé"}`), "");

p("## Hero", "", `- Petite ligne : ${fr.hero.kicker}`, `- Titre : ${fr.hero.title}`, `- Texte : ${fr.hero.sub}`, `- Boutons : ${fr.hero.ctaDirections} · ${fr.hero.ctaServices}`, `- Note : ${site.rating.value}/5 sur ${site.rating.count} avis Google (relevée le ${site.rating.checked})`, "");

p("## Bande de services (4 pictos)", "", ...fr.strip.items.map((s) => `- **${s.title}** : ${s.text}`), "");

p("## Services", "", fr.services.intro, "", ...services.items.map((s) => `- **${fr.services.items[s.id].name}**${s.confirmed ? "" : " (à confirmer)"} : ${fr.services.items[s.id].text}`), "");

p("## Événements (data/evenements.json)", "", ...events.items.map((e) => `- **${e.fr.title}** (${e.date ?? (e.fr.when || "toute l'année")}) : ${e.fr.text}`), "");

p("## Blocs alternés", "", ...fr.blocks.map((b) => `- **${b.title}** : ${b.text} → bouton « ${b.cta} »`), "");

p("## Tarifs (à valider)", "");
for (const c of tarifs.categories) {
  p(`### ${fr.tarifs.categories[c.id]}`, "");
  for (const it of c.items) {
    const t = fr.tarifs.items[it.id];
    const v = it.price === null ? "**à remplir**" : it.price === 0 ? "gratuit" : `${it.from ? "à partir de " : ""}${eur(it.price)}`;
    p(`- ${t.name}${t.desc ? ` (${t.desc})` : ""} : ${v}`);
  }
  p("");
}
p(`_${fr.tarifs.note}_`, "");

p("## Infos pratiques", "", `- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`, `- Téléphone : ${site.phone}`, `- Accès : ${fr.infos.accessText}`, `- Stationnement : ${fr.infos.parkingText}`, "");

p("## FAQ (à valider)", "", ...fr.faq.items.flatMap((f) => [`**${f.q}**`, f.a, ""]));

p("## Pages locales", "");
for (const id of ["bar", "relais"]) {
  const pg = fr.pages[id];
  p(`### ${pg.h1}`, "", `- Title : ${pg.metaTitle}`, `- Description : ${pg.description}`, "", pg.intro, "", ...pg.sections.flatMap((s) => [`**${s.title}** : ${s.text}`, ""]));
}

p("## Contact", "", fr.contact.intro, "", `Champs : ${fr.contact.name}, ${fr.contact.phone}, ${fr.contact.email}, ${fr.contact.subject} (${Object.values(fr.contact.subjects).join(", ")}), ${fr.contact.message}.`, "Envoi : e-mail de notification via Resend (variables RESEND_API_KEY, CONTACT_NOTIFY_EMAIL, RESEND_FROM sur Vercel). Tant qu'elles manquent, le site invite à appeler.", "");

writeFileSync(new URL("../CONTENU.md", import.meta.url), L.join("\n"));
console.log("CONTENU.md :", L.length, "lignes");

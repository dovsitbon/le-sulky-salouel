// Génère le logo (public/logo.svg), le favicon (app/icon.svg), l'icône Apple et l'image de partage (public/og.jpg)
// à partir des tracés du cheval et du sulky (lib/mark.json). Lancer : npm run icons
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { MARK_PATHS, MARK_VIEWBOX } from "./mark.mjs";

const GREEN = "#1F4D3A", CREAM = "#F6F0E4", GOLD = "#C9A14E", RED = "#B3261E", INK = "#181818";
const paths = (color, w) => `<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g>`;

// Logo : le sulky au-dessus de « LE SULKY » (texte vectoriel simple, facile à remplacer par le vrai logo)
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" role="img" aria-label="Le Sulky">
<g transform="translate(80 0)">${paths(GREEN, 2.4)}</g>
<text x="160" y="128" text-anchor="middle" font-family="Fraunces, Georgia, 'Times New Roman', serif" font-size="40" letter-spacing="7" fill="${INK}">LE SULKY</text>
<path d="M118 146h84" stroke="${GOLD}" stroke-width="1"/><path d="M118 151h84" stroke="${GOLD}" stroke-width="1"/>
<text x="160" y="166" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="9" letter-spacing="3.5" fill="${RED}">BAR · TABAC · PMU</text>
</svg>`;
await writeFile("public/logo.svg", logo);

// Favicon : carré vert, sulky crème en trait épais (lisible en 32 px)
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${GREEN}"/><g transform="translate(2 12) scale(0.375)">${paths(CREAM, 6)}</g></svg>`;
await writeFile("app/icon.svg", icon);
await sharp(Buffer.from(icon.replace('rx="12"', 'rx="0"')), { density: 600 }).resize(180, 180).png().toFile("app/apple-icon.png");

// Image de partage 1200×630
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${GREEN}"/>
<g fill="none" stroke="${GOLD}" stroke-opacity="0.22"><ellipse cx="820" cy="330" rx="560" ry="260"/><ellipse cx="820" cy="330" rx="500" ry="210"/></g>
<g transform="translate(700 150) scale(2.6)">${paths(GOLD, 1.4)}</g>
<text x="90" y="300" font-family="Georgia, serif" font-size="108" letter-spacing="14" fill="${CREAM}">LE SULKY</text>
<path d="M92 334h180M92 342h180" stroke="${GOLD}" stroke-width="1.5"/>
<text x="92" y="400" font-family="Arial, sans-serif" font-size="26" letter-spacing="6" fill="${CREAM}">BAR · TABAC · PMU · POINT RELAIS</text>
<text x="92" y="450" font-family="Georgia, serif" font-size="30" fill="${CREAM}" fill-opacity="0.85">23 route de Rouen, Salouël · dès 6 h</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 86 }).toFile("public/og.jpg");
console.log("icônes prêtes");

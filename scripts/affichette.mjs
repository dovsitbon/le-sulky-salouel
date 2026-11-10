// Affichette A5 imprimable (print/affichette-a5.pdf) avec QR code vers le site. Lancer : npm run affichette
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";
import { markSvg } from "./mark.mjs";

const site = JSON.parse(await readFile(new URL("../data/site.json", import.meta.url), "utf8"));
const url = `${site.url}/fr`;
const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const GREEN = hex("#1F4D3A"), CREAM = hex("#F6F0E4"), GOLD = hex("#C9A14E"), RED = hex("#B3261E"), INK = hex("#181818"), MUTED = hex("#4D4A43");

const pdf = await PDFDocument.create();
pdf.setTitle("Le Sulky · affichette A5");
const W = 419.53, H = 595.28; // A5 en points
const page = pdf.addPage([W, H]);
const serif = await pdf.embedFont(StandardFonts.TimesRoman);
const serifI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
const sans = await pdf.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });
// Bande verte du haut, avec le sulky au trait or
const bandH = 210;
page.drawRectangle({ x: 0, y: H - bandH, width: W, height: bandH, color: GREEN });
const markPng = await sharp(Buffer.from(markSvg("#C9A14E", 2)), { density: 600 }).resize({ width: 900 }).png().toBuffer();
const mark = await pdf.embedPng(markPng);
const mW = 150, mH = (mark.height / mark.width) * mW;
page.drawImage(mark, { x: (W - mW) / 2, y: H - 40 - mH, width: mW, height: mH });

const center = (text, font, size, y, color, spacing = 0) => {
  const w = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  let x = (W - w) / 2;
  if (!spacing) return page.drawText(text, { x, y, size, font, color });
  for (const ch of text) {
    page.drawText(ch, { x, y, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + spacing;
  }
};

center("LE SULKY", serif, 38, H - 165, CREAM, 6);
center("BAR  ·  TABAC  ·  PMU  ·  POINT RELAIS", sans, 8.5, H - 188, GOLD, 1.6);

let y = H - bandH - 48;
center("Retrouvez-nous en ligne", serif, 22, y, INK);
y -= 20;
center("horaires, services, événements et itinéraire", serifI, 12.5, y, MUTED);

const qrPng = await QRCode.toBuffer(url, { margin: 0, width: 600, color: { dark: "#1F4D3A", light: "#F6F0E4" }, errorCorrectionLevel: "M" });
const qrS = 118;
y -= 24 + qrS;
page.drawImage(await pdf.embedPng(qrPng), { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 18;
center(url.replace(/^https?:\/\//, ""), sans, 8.5, y, RED);

y -= 22;
page.drawLine({ start: { x: W / 2 - 40, y: y + 3 }, end: { x: W / 2 + 40, y: y + 3 }, thickness: 0.6, color: GOLD });
page.drawLine({ start: { x: W / 2 - 40, y: y - 2 }, end: { x: W / 2 + 40, y: y - 2 }, thickness: 0.6, color: GOLD });

y -= 26;
center("Du lundi au samedi : 6 h - 20 h   ·   Dimanche : 7 h - 14 h", sans, 9, y, INK);
y -= 16;
center(`${site.address.street}, ${site.address.postalCode} Salouël   ·   ${site.phone}`, sans, 9, y, INK);
y -= 16;
center(`${String(site.rating.value).replace(".", ",")}/5 sur ${site.rating.count} avis Google`, serifI, 10.5, y, MUTED);

await mkdir(new URL("../print/", import.meta.url), { recursive: true });
await writeFile(new URL("../print/affichette-a5.pdf", import.meta.url), await pdf.save());
console.log("affichette prête :", url, "· bas du texte à", Math.round(y), "pt");

// Tracés du cheval et du sulky, lus depuis lib/mark.json (source unique)
import { readFileSync } from "node:fs";
const mark = JSON.parse(readFileSync(new URL("../lib/mark.json", import.meta.url), "utf8"));
export const MARK_VIEWBOX = mark.viewBox;
export const MARK_PATHS = mark.paths;
export const markSvg = (color = "#1F4D3A", stroke = 2.2) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;

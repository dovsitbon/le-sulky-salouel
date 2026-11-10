import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["fr", "en"];

// Français par défaut ; on suit le cookie (choix explicite) puis la langue du navigateur.
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const header = req.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase().slice(0, 2);
  return first === "en" ? "en" : "fr";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|icon|apple-icon|og\.jpg|logo|robots\.txt|sitemap\.xml|llms\.txt|.*\..*).*)"],
};

"use client";

import { useEffect, useState } from "react";
import mark from "@/lib/mark.json";

import { INTRO_KEY } from "@/lib/keys";

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  document.documentElement.classList.add("intro-seen");
}

/**
 * Ouverture (1,2 s, une fois par session), en CSS (globals.css) : fond crème, le cheval et son sulky
 * se dessinent au trait vert et avancent un peu, « LE SULKY » puis « BAR · TABAC · PMU », fondu sur le hero.
 * Bouton « Passer » ; rien si l'utilisateur préfère réduire les animations.
 */
export function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(markSeen, 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-green">
      <svg viewBox={mark.viewBox} className="intro-mark h-24 w-auto md:h-28" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {mark.paths.map((d, i) => (
          <path key={d} d={d} pathLength={1} style={{ animationDelay: `${i * 0.03}s` }} />
        ))}
      </svg>
      <p className="intro-name display mt-6 text-[clamp(1.75rem,7vw,2.5rem)] tracking-[0.16em] text-ink" translate="no" aria-hidden="true">
        LE SULKY
      </p>
      <p className="intro-tag caps mt-3 text-red" aria-hidden="true">
        {tagline}
      </p>
      <button
        type="button"
        onClick={() => {
          markSeen();
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 px-4 text-[0.9375rem] text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}

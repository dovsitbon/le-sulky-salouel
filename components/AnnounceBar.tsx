"use client";

import { useEffect, useState } from "react";
import annonces from "@/data/annonces.json";
import { CloseIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { isoDay } from "@/lib/format";

type Item = { id: string; active?: boolean; from?: string; to?: string; fr: string; en: string };
const KEY = "lesulky-annonce";

/** Message du moment (data/annonces.json) choisi d'après la date du jour ; refermable, mémorisé pour la session. */
function current(today: string): Item {
  const items = annonces.items as Item[];
  return items.find((a) => a.active !== false && (!a.from || a.from <= today) && (!a.to || today <= a.to)) ?? (annonces.default as Item);
}

export function AnnounceBar({ buildDay }: { buildDay: string }) {
  const { lang, d } = useLocale();
  const [item, setItem] = useState<Item>(() => current(buildDay));
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const it = current(isoDay(new Date()));
    let hidden = false;
    try {
      hidden = sessionStorage.getItem(KEY) === it.id;
    } catch {}
    // Date réelle du visiteur (la page est générée à l'avance) et fermeture mémorisée pour la session
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItem(it);
    setClosed(hidden);
  }, []);

  if (closed) return null;

  return (
    <div className="relative bg-green text-cream">
      <p className="wrap flex min-h-10 items-center justify-center py-2 pe-12 text-center text-[0.8125rem] leading-snug md:text-sm">{item[lang]}</p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, item.id);
          } catch {}
          setClosed(true);
        }}
        className="absolute end-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-cream/80 transition-colors hover:text-cream"
        aria-label={d.a11y.close}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

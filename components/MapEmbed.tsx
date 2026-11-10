"use client";

import { useState } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { Mark } from "@/components/Logo";
import { PinIcon } from "@/components/icons";

/** Carte Google Maps chargée seulement au clic : pas de cookie tiers ni de script lourd au chargement de la page. */
export function MapEmbed({ className = "" }: { className?: string }) {
  const { d } = useLocale();
  const [show, setShow] = useState(false);
  if (show) return <iframe src={site.mapsEmbed} title={d.infos.mapTitle} className={`w-full border-0 ${className}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />;
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-green text-cream ${className}`}>
      {/* Piste au trait : la route de Rouen, stylisée */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full opacity-25" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-20 230C80 200 140 120 230 110S360 60 420 20" />
        <path d="M-20 244C80 214 140 134 230 124S360 74 420 34" strokeDasharray="4 6" />
        <path d="M120 -10 160 310M300 -10 260 310M-10 80h420" strokeOpacity="0.5" />
      </svg>
      <div className="relative flex flex-col items-center gap-4 p-6 text-center">
        <Mark className="h-10 w-auto text-gold-soft" />
        <p className="text-sm text-cream/85">
          {site.address.street}, {site.address.postalCode} {site.address.city}
        </p>
        <button type="button" onClick={() => setShow(true)} className="btn btn-line text-cream">
          <PinIcon className="size-4" />
          {d.infos.mapButton}
        </button>
        <p className="text-xs text-cream/70">{d.infos.mapNote}</p>
      </div>
    </div>
  );
}

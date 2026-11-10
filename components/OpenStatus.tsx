"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers";
import { addDays, statusAt, type Status } from "@/lib/hours";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime, isoDay } from "@/lib/format";

/** « Ouvert maintenant / Fermé, ouvre à… », calculé à l'heure de Paris, mis à jour chaque minute. */
export function OpenStatus({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { lang, d } = useLocale();
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setS(statusAt(new Date()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  let label = d.status.loading;
  if (s?.open) label = fill(d.status.open, { time: formatTime(s.until, lang) });
  else if (s && s.at && s.nextDay) {
    const time = formatTime(s.at, lang);
    if (s.today) label = fill(d.status.closedToday, { time });
    else if (s.nextDay === addDays(isoDay(new Date()), 1)) label = fill(d.status.closedTomorrow, { time });
    else label = fill(d.status.closedNext, { day: formatDay(s.nextDay, lang, { weekday: "long" }), time });
  }

  const dot = s === null ? "bg-current opacity-40" : s.open ? "bg-[#3fae6a]" : "bg-red";
  return (
    <span className={`inline-flex items-center gap-2 ${tone === "light" ? "text-cream" : "text-ink"} ${className}`} aria-live="polite">
      <span className={`size-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

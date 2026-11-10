import type { Dict, Locale } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import { groupedHours } from "@/lib/hours";
import { formatTime } from "@/lib/format";

/** Horaires regroupés : « Lundi au samedi · 6 h – 20 h ». */
export function HoursTable({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  return (
    <dl className={`divide-y divide-line ${className}`}>
      {groupedHours().map((g) => (
        <div key={g.from} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt>{g.from === g.to ? d.infos.days[g.from - 1] : fill(d.infos.range, { from: d.infos.days[g.from - 1], to: d.infos.days[g.to - 1].toLowerCase() })}</dt>
          <dd className="text-end tabular-nums">{g.slots.length ? g.slots.map(([a, b]) => `${formatTime(a, lang)} – ${formatTime(b, lang)}`).join(", ") : d.infos.closed}</dd>
        </div>
      ))}
    </dl>
  );
}

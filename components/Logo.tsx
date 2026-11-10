import mark from "@/lib/mark.json";

/** Cheval et sulky au trait (lib/mark.json). */
export function Mark({ className = "", strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox={mark.viewBox} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {mark.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Logo typographique : le sulky au trait au-dessus de « LE SULKY ». */
export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-green ${className}`} translate="no">
      <Mark className={compact ? "h-6 w-auto" : "h-8 w-auto"} strokeWidth={2.6} />
      <span className="font-display text-[1.375rem] leading-none tracking-[0.14em] text-ink">LE SULKY</span>
    </span>
  );
}

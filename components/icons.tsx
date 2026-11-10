// Pictos au trait, même épaisseur partout (1.5), dessinés pour le site
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const CupIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M6 13h17v6a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7v-6Z" /><path d="M23 15h2a3 3 0 0 1 0 6h-2.5M4 28.5h22M12 4c-1 1.5 1 3 0 5M17 4c-1 1.5 1 3 0 5" /></svg>
);
export const LeafIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M7 25C7 13 14 6 26 6c0 12-7 19-19 19Z" /><path d="M7 25 19 13M12 20h5M15 16v-4" /></svg>
);
export const HorseshoeIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M9 27H6.5C5 22 4 18 4 15 4 8.5 9.4 4 16 4s12 4.5 12 11c0 3-1 7-2.5 12H23c1-4 2-8 2-12 0-4.8-4-7.5-9-7.5S7 10.2 7 15c0 4 1 8 2 12Z" /><path d="M7.5 12.5h.01M8 18.5h.01M24.5 12.5h.01M24 18.5h.01M16 7.5h.01" strokeWidth="2.4" /></svg>
);
export const TicketIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M4 9h24v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6V9Z" /><path d="M20 9v2.5M20 15v2M20 20.5V23M9 14h6M9 18h4" /></svg>
);
export const ParcelIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M16 4 27 9.5v13L16 28 5 22.5v-13L16 4Z" /><path d="M5 9.5 16 15l11-5.5M16 15v13M10.5 6.8l11 5.5v4.2" /></svg>
);
export const PaperIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M7 5h15v20a2 2 0 0 0 2 2H9a2 2 0 0 1-2-2V5Z" /><path d="M22 11h3v14a2 2 0 0 1-2 2M11 10h7M11 14h7M11 18h7M11 22h4" /></svg>
);
export const SunriseIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><path d="M9 22a7 7 0 0 1 14 0M3 22h26M7 27h18M16 6v4M6.5 11.5l2.6 2.6M25.5 11.5l-2.6 2.6M2.5 17h3M26.5 17h3" /></svg>
);
export const ParkingIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}><rect x="5" y="5" width="22" height="22" rx="4" /><path d="M13 23V10h4.5a3.5 3.5 0 0 1 0 7H13" /></svg>
);
export const PinIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const PhoneIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" /></svg>
);
export const ArrowIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${className} rtl:-scale-x-100`} {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const CloseIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const StarIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8L12 3Z" /></svg>
);
export const PlusIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 5v14M5 12h14" /></svg>
);

export const SERVICE_ICONS = { cup: CupIcon, leaf: LeafIcon, horseshoe: HorseshoeIcon, ticket: TicketIcon, parcel: ParcelIcon, paper: PaperIcon, sunrise: SunriseIcon, parking: ParkingIcon } as const;
export type IconName = keyof typeof SERVICE_ICONS;

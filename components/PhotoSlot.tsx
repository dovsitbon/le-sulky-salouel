import Image from "next/image";
import type { Dict } from "@/lib/i18n";
import { photoOf, type PhotoSlotId } from "@/lib/photos";
import { Mark } from "@/components/Logo";

/**
 * Photo d'un emplacement (data/photos.json) ou, tant qu'elle manque, un emplacement sobre :
 * fond crème rayé, cadre pointillé, petit cheval au trait et légende « Photo à venir ».
 * Une photo libre de droits (stock: true) porte la mention « Photo d'illustration » : jamais présentée comme le commerce.
 */
export function PhotoSlot({
  id,
  d,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  position = "center",
}: {
  id: PhotoSlotId;
  d: Dict;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  const p = photoOf(id);
  if (p) {
    return (
      <figure className={`relative overflow-hidden bg-cream-deep ${className}`}>
        <Image src={p.src} alt={d.alt[id]} fill sizes={sizes} priority={priority} quality={70} className="object-cover" style={{ objectPosition: position }} />
        {p.stock && <figcaption className="absolute end-2 bottom-2 rounded-sm bg-ink/60 px-2 py-0.5 text-[0.6875rem] text-cream">{d.photo.illustration}</figcaption>}
      </figure>
    );
  }
  return (
    <div className={`slot grid place-items-center ${className}`} role="img" aria-label={`${d.photo.pending} : ${d.photo.slots[id]}`}>
      <div className="flex flex-col items-center gap-3 px-6 text-center text-green/60">
        <Mark className="h-9 w-auto" strokeWidth={2} />
        <span className="caps text-[0.6875rem]">{d.photo.pending}</span>
        <span className="font-display text-base text-green/75 italic">{d.photo.slots[id]}</span>
      </div>
    </div>
  );
}

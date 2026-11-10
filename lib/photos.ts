import photos from "@/data/photos.json";

export type PhotoSlotId = Exclude<keyof typeof photos, "_note">;
export type Photo = { src: string; width: number; height: number } | null;

/** Photo d'un emplacement (data/photos.json), ou null tant qu'elle n'est pas fournie. */
export const photoOf = (id: PhotoSlotId): Photo => (photos[id] as Photo) ?? null;

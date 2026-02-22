export type TourTagId =
  | "adventure"
  | "nature"
  | "city-tour"
  | "party"
  | "nightlife"
  | "culture"
  | "local-food"
  | "magic-towns"

export const tourTags: Record<
  TourTagId,
  {
    es: string
    en: string
  }
> = {
  adventure: { es: "Aventura", en: "Adventure" },
  nature: { es: "Naturaleza", en: "Nature" },
  "city-tour": { es: "City Tour", en: "City Tour" },
  party: { es: "Fiesta", en: "Party" },
  nightlife: { es: "Vida Nocturna", en: "Nightlife" },
  culture: { es: "Cultura", en: "Culture" },
  "local-food": { es: "Gastronomía", en: "Local Food" },
  "magic-towns": { es: "Pueblos Mágicos", en: "Magic Towns" },
}

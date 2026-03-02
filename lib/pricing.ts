export const COP_PER_USD = 4000
const PRIVATE_GROUP_SIZE = 4
const PRIVATE_GROUP_DISCOUNT = 0.2

type TourPricingConfig =
  | {
      model: "per_person"
      copPerPerson: number
    }
  | {
      model: "tips_based"
    }

const PRICING_ALIASES: Record<string, string> = {
  "tour-comuna-13": "comuna-13",
  comuna13: "comuna-13",
  "city-tour": "medellin-walking",
}

export const TOUR_PRICING: Record<string, TourPricingConfig> = {
  "guatape-private": { model: "per_person", copPerPerson: 180000 },
  "salto-del-buey": { model: "per_person", copPerPerson: 550000 },
  "comuna-13": { model: "per_person", copPerPerson: 80000 },
  "tour-nocturno": { model: "per_person", copPerPerson: 130000 },
  "tour-cafetero": { model: "per_person", copPerPerson: 250000 },
  "medellin-walking": { model: "tips_based" },
}

export function resolveTourPricingId(tourId: string) {
  const normalized = tourId.trim().toLowerCase()
  return PRICING_ALIASES[normalized] ?? normalized
}

export function getTourPricing(tourId: string) {
  return TOUR_PRICING[resolveTourPricingId(tourId)] ?? null
}

export function toUsdFromCop(cop: number) {
  return cop / COP_PER_USD
}

export function calculateBookingTotalCop(params: {
  tourId: string
  bookingMode: "full_group" | "join_group"
  numberOfPeople: number
}) {
  const pricing = getTourPricing(params.tourId)
  if (!pricing) {
    throw new Error("Tour sin configuración de precio")
  }

  if (pricing.model === "tips_based") {
    throw new Error("Este tour está basado en propinas y no usa checkout de pago fijo")
  }

  if (!Number.isFinite(params.numberOfPeople) || params.numberOfPeople < 1) {
    throw new Error("Número de personas inválido")
  }

  if (params.bookingMode === "full_group") {
    const privateBase = pricing.copPerPerson * PRIVATE_GROUP_SIZE
    return Math.round(privateBase * (1 - PRIVATE_GROUP_DISCOUNT))
  }

  return Math.round(pricing.copPerPerson * params.numberOfPeople)
}

export function getPrivateGroupPriceCop(tourId: string) {
  const pricing = getTourPricing(tourId)
  if (!pricing || pricing.model !== "per_person") return null
  return Math.round(pricing.copPerPerson * PRIVATE_GROUP_SIZE * (1 - PRIVATE_GROUP_DISCOUNT))
}


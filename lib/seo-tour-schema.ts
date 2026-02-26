import type { TourContent } from "@/lib/tours-content"

export const touristTypeByTour: Record<string, string[]> = {
  "guatape-private": ["couples", "families", "international-tourists"],
  "guatape-semi-private": ["couples", "small-groups", "international-tourists"],
  "salto-del-buey": ["adventure-seekers", "nature-lovers", "young-travelers", "small-groups"],
  "medellin-city-experience": ["first-time-visitors", "international-tourists", "solo-travelers", "couples"],
  "coffee-farm-experience": ["culture-lovers", "international-tourists", "families", "couples"],
}

export const touristDestinationByTour: Record<string, string[]> = {
  "city-tour-chiva": ["Medellín", "Antioquia", "Colombia"],
  "comuna-13": ["Medellín", "Antioquia", "Colombia"],
  "medellin-walking": ["Medellín", "Antioquia", "Colombia"],
  "tour-nocturno": ["Medellín", "Antioquia", "Colombia"],
  "guatape-private": ["Guatapé", "Antioquia", "Colombia"],
  "salto-del-buey": ["La Ceja", "Antioquia", "Colombia"],
  "tour-cafetero": ["Antioquia", "Colombia"],
}

export function durationToIso(duration: string) {
  const firstHour = Number((duration.match(/\d+/) || [4])[0])
  if (!Number.isFinite(firstHour) || firstHour <= 0) return "PT4H"
  return `PT${firstHour}H`
}

export function fallbackTouristTypes(tourId: string) {
  const base = touristTypeByTour[tourId] || ["travelers"]
  return Array.from(new Set([...base, "solo-travelers", "travelers"]))
}

export function fallbackTouristDestination(tourId: string, city: string) {
  const destination = touristDestinationByTour[tourId]
  if (destination && destination.length > 0) return destination
  return [city || "Medellín", "Antioquia", "Colombia"]
}

export function buildTourStructuredData(tour: TourContent, siteUrl: string) {
  const destinationParts = fallbackTouristDestination(tour.id, tour.city)
  const touristTypes = fallbackTouristTypes(tour.id)
  const itineraryItems = [...tour.includes, ...tour.experience].slice(0, 8).map((step, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Thing",
      name: step,
    },
  }))

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${siteUrl}/tours/${tour.id}#touristtrip`,
    name: tour.title,
    description: tour.summary,
    image: [tour.posterImage || tour.heroImage].filter(Boolean),
    url: `${siteUrl}/tours/${tour.id}`,
    inLanguage: ["es", "en"],
    touristType: touristTypes,
    timeRequired: durationToIso(tour.duration),
    touristDestination: {
      "@type": "Place",
      name: destinationParts.join(", "),
      address: {
        "@type": "PostalAddress",
        addressLocality: destinationParts[0] || "Medellín",
        addressRegion: destinationParts[1] || "Antioquia",
        addressCountry: destinationParts[destinationParts.length - 1] || "Colombia",
      },
    },
    areaServed: destinationParts.join(", "),
    itinerary: {
      "@type": "ItemList",
      itemListElement: itineraryItems,
    },
    provider: {
      "@id": `${siteUrl}#organization`,
    },
  }
}

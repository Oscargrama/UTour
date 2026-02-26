import type { Metadata } from "next"
import type { TourContent } from "@/lib/tours-content"

export function buildTourMetadata(tour: TourContent): Metadata {
  const description = `${tour.duration} · ${tour.groupSize} · ${tour.summary}`
  const ogImage = tour.posterImage || tour.heroImage || "/og/utour-default-1200x630.svg"

  return {
    title: `${tour.title} en ${tour.city} | UTour`,
    description,
    alternates: {
      canonical: `/tours/${tour.id}`,
    },
    openGraph: {
      title: `${tour.title} en ${tour.city} | UTour`,
      description,
      type: "website",
      url: `/tours/${tour.id}`,
      images: [
        {
          url: ogImage,
          alt: tour.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tour.title} | UTour`,
      description,
      images: [ogImage],
    },
  }
}

export function notFoundTourMetadata(): Metadata {
  return {
    title: "Tour no encontrado | UTour",
    description: "La experiencia solicitada no está disponible.",
  }
}

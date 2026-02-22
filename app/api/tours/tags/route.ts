import { NextResponse } from "next/server"
import { tourTags } from "@/lib/tour-tags"
import { getToursOrderedByDemand } from "@/lib/tours-content"

export async function GET() {
  const toursByDemand = getToursOrderedByDemand()

  const tagsCatalog = Object.entries(tourTags).map(([id, labels]) => ({
    id,
    labels,
  }))

  const tours = toursByDemand.map((tour) => ({
    id: tour.id,
    title: tour.title,
    city: tour.city,
    hero_image: tour.heroImage,
    hero_video: tour.heroVideo ?? null,
    poster_image: tour.posterImage ?? null,
    gallery: tour.gallery,
    tags: tour.tags,
    demand_score: tour.demandScore,
    demand_class: tour.demandClass,
    tag_labels: tour.tags.map((tagId) => ({
      id: tagId,
      ...tourTags[tagId],
    })),
  }))

  return NextResponse.json(
    {
      version: "1.0",
      generated_at: new Date().toISOString(),
      ordered_by: "demand_score_desc",
      tags_catalog: tagsCatalog,
      tours,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    },
  )
}

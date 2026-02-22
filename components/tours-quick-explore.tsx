"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Clock,
  Flame,
  Landmark,
  Leaf,
  MoonStar,
  PartyPopper,
  Sparkles,
  Star,
  Trees,
  Users,
  Utensils,
} from "lucide-react"
import { getToursOrderedByDemand } from "@/lib/tours-content"
import { tourTags, type TourTagId } from "@/lib/tour-tags"

function TagIcon({ tag }: { tag: TourTagId }) {
  const className = "h-3.5 w-3.5 text-[#1f85d4]"
  if (tag === "adventure") return <Trees className={className} />
  if (tag === "nature") return <Leaf className={className} />
  if (tag === "city-tour") return <Building2 className={className} />
  if (tag === "party") return <PartyPopper className={className} />
  if (tag === "nightlife") return <MoonStar className={className} />
  if (tag === "culture") return <Landmark className={className} />
  if (tag === "local-food") return <Utensils className={className} />
  return <Sparkles className={className} />
}

export function ToursQuickExplore() {
  const tours = getToursOrderedByDemand()
  const [selectedTag, setSelectedTag] = useState<TourTagId | "all">("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")

  const tagsForFilter = useMemo(
    () =>
      Object.entries(tourTags).map(([id, labels]) => ({
        id: id as TourTagId,
        ...labels,
      })),
    [],
  )

  const citiesForFilter = useMemo(() => {
    const uniqueCities = Array.from(new Set(tours.map((tour) => tour.city)))
    return uniqueCities.sort((a, b) => a.localeCompare(b))
  }, [tours])

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const cityMatches = selectedCity === "all" || tour.city === selectedCity
      const tagMatches = selectedTag === "all" || tour.tags.includes(selectedTag)
      return cityMatches && tagMatches
    })
  }, [tours, selectedTag, selectedCity])

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-[#1f3684] md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            Explora rápido todas las experiencias
          </h2>
          <p className="max-w-2xl text-[#42527f]">
            Revisa cada tour en segundos. Si ya te gustó uno, agenda directo. Si quieres detalle, ábrelo en su página.
          </p>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#1f3684]">Ciudad:</span>
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="h-9 rounded-full border border-[#d8e3ff] bg-white px-3 text-sm text-[#1f3684] outline-none focus:border-[#7a2ce8]"
            aria-label="Filtrar por ciudad"
          >
            <option value="all">Todas</option>
            {citiesForFilter.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTag("all")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              selectedTag === "all"
                ? "border-[#7a2ce8] bg-[#f3ebff] text-[#4e24a8]"
                : "border-[#d8e3ff] bg-white text-[#1f3684] hover:border-[#bcd1ff]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Todos
          </button>
          {tagsForFilter.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selectedTag === tag.id
                  ? "border-[#7a2ce8] bg-[#f3ebff] text-[#4e24a8]"
                  : "border-[#d8e3ff] bg-white text-[#1f3684] hover:border-[#bcd1ff]"
              }`}
              title={`${tag.es} / ${tag.en}`}
            >
              <TagIcon tag={tag.id} />
              {tag.es}
            </button>
          ))}
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {filteredTours.map((tour) => (
            <article
              key={tour.id}
              className={`group relative min-w-[260px] max-w-[260px] overflow-hidden rounded-[26px] border bg-white shadow-[0_25px_60px_-35px_rgba(31,54,132,0.5)] ${
                tour.demandClass === "top_seller"
                  ? "border-[#7a2ce8]/45 ring-1 ring-[#38cbe1]/40"
                  : "border-[#dfe6ff]"
              }`}
            >
              <div className="relative h-[210px]">
                {tour.heroVideo ? (
                  <video
                    src={tour.heroVideo}
                    poster={tour.posterImage || tour.heroImage}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c4f]/85 via-[#1f3684]/35 to-transparent" />
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  {tour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#cbe0ff] bg-white/90"
                      title={`${tourTags[tag].es} / ${tourTags[tag].en}`}
                      aria-label={`${tourTags[tag].es} / ${tourTags[tag].en}`}
                    >
                      <TagIcon tag={tag} />
                    </span>
                  ))}
                </div>
                {tour.demandClass === "top_seller" && (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#7a2ce8]">
                    <Flame className="h-3.5 w-3.5 text-[#7a2ce8]" />
                    Más solicitado
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="line-clamp-2 text-base font-bold text-white">{tour.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-white/85">{tour.summary}</p>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-xs text-[#42527f]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f8ff] px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    {tour.rating}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f8ff] px-2 py-1">
                    <Clock className="h-3.5 w-3.5 text-[#1f85d4]" />
                    {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f8ff] px-2 py-1">
                    <Users className="h-3.5 w-3.5 text-[#1f85d4]" />
                    {tour.groupSize}
                  </span>
                </div>

                <div className="inline-flex rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-semibold text-[#1f3684]">
                  {tour.price}
                </div>

                <div className="flex gap-2">
                  <Button asChild className="brand-cta-btn h-10 flex-1 rounded-full text-xs">
                    <Link href={`/book?tour=${tour.id}`}>Agendar ahora</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 flex-1 rounded-full border-[#cbd7ff] text-xs text-[#1f3684]"
                  >
                    <Link href={`/tours/${tour.id}`}>Ver más</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

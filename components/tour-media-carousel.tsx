"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type TourMediaCarouselProps = {
  title: string
  heroVideo?: string
  posterImage?: string
  heroImage: string
  gallery: string[]
}

export function TourMediaCarousel({ title, heroVideo, posterImage, heroImage, gallery }: TourMediaCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBySlide = (direction: "next" | "prev") => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.95)
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={trackRef} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:thin]">
        {heroVideo && (
          <article className="h-full min-w-full snap-start">
            <video
              src={heroVideo}
              poster={posterImage || heroImage}
              className="h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
              controls
            />
          </article>
        )}

        {(posterImage || heroImage) && (
          <article className="h-full min-w-full snap-start">
            <img src={posterImage || heroImage} alt={`Poster ${title}`} className="h-full w-full object-cover" />
          </article>
        )}

        {gallery.map((mediaSrc, index) => (
          <article key={`${title}-gallery-${index}`} className="h-full min-w-full snap-start">
            <img src={mediaSrc} alt={`${title} galeria ${index + 1}`} className="h-full w-full object-cover" />
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBySlide("prev")}
        className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#1f3684] shadow-lg backdrop-blur"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollBySlide("next")}
        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#1f3684] shadow-lg backdrop-blur"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

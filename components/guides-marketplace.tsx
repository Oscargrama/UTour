"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { curatedReviews, type CuratedReview } from "@/lib/curated-reviews"

export function GuidesMarketplace() {
  const founderBioParagraphs = [
    "Somos Carolina, Oscar y Zeus (nuestro inspector de calidad) y hacemos esto porque creemos que viajar no debería ser una carrera contra el tiempo, sino una forma de conectar con los lugares, las personas y con uno mismo…",
    "Por eso estamos construyendo una nueva forma de explorar: más humana, más consciente y hecha para disfrutarse de verdad.",
  ]

  const curatedHomeReviews = curatedReviews.filter(
    (review) => review.tourId === "guatape-private" || review.tourId === "salto-del-buey",
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const reviewCount = curatedHomeReviews.length

  const goToReview = useCallback(
    (index: number) => {
      if (reviewCount === 0) return
      const next = ((index % reviewCount) + reviewCount) % reviewCount
      setActiveIndex(next)
    },
    [reviewCount],
  )

  const goPrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + reviewCount) % reviewCount)
  }, [reviewCount])

  const goNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % reviewCount)
  }, [reviewCount])

  useEffect(() => {
    if (reviewCount < 2) return
    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduceMotion) return
    }
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewCount)
    }, 11000)
    return () => window.clearInterval(id)
  }, [reviewCount])

  const stackedReviews = useMemo(() => {
    if (curatedHomeReviews.length === 0) return []
    const stackSize = Math.min(4, curatedHomeReviews.length)
    return Array.from({ length: stackSize }).map(
      (_, index) => curatedHomeReviews[(activeIndex + index) % curatedHomeReviews.length],
    )
  }, [activeIndex, curatedHomeReviews])

  return (
    <section id="guides" className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef3ff] py-20">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#38CBE1]/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7A2CE8]/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#7a2ce8]" />
            Conoce al founding team
          </p>
          <h2
            className="bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Creamos UTour para que viajar se sienta real
          </h2>
          <p className="mt-3 text-lg text-[#42527f]">
            Más humana, más consciente y hecha para disfrutarse de verdad.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_1.05fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-[#dfe6ff] bg-white shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)]">
            <div className="relative h-[460px] md:h-[560px]">
              <Image
                src="/images/foundingteam.webp"
                alt="Equipo fundador UTour"
                fill
                priority
                sizes="(min-width: 1024px) min(48vw, 640px), 100vw"
                className="object-cover object-bottom"
                unoptimized
              />
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0f1c4f]/70 via-[#1f3684]/10 to-transparent"
                aria-hidden
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="rounded-[28px] border border-[#dfe6ff] bg-white/95 p-8 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.35)]">
              <h3 className="text-2xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
                Conoce el Equipo Fundador
              </h3>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-[#42527f]">
                {founderBioParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="brand-cta-btn h-11 rounded-full px-6">
                  <Link href="/book">Reserva ahora</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-full border-[#cbd7ff] text-[#1f3684]">
                  <Link href="/tours">Ver experiencias</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {stackedReviews.length > 0 && (
          <div className="mt-16">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
                <Quote className="mr-2 h-4 w-4 text-[#7a2ce8]" />
                Qué dicen de nosotros
              </p>
              <h3
                className="text-3xl font-bold tracking-tight text-[#1f3684]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Reseñas reales de viajeros UTour
              </h3>
            </div>

            <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-8">
              <div
                className="relative mx-auto w-full max-w-[560px]"
                role="region"
                aria-roledescription="carrusel"
                aria-label="Reseñas de viajeros"
              >
                {stackedReviews.map((review, index) => {
                  const positions = [
                    { x: 0, y: 0, scale: 1, opacity: 1, blur: "", glass: "", hide: false },
                    {
                      x: -88,
                      y: 14,
                      scale: 0.94,
                      opacity: 0.62,
                      blur: "blur-[1px]",
                      glass: "bg-white/55 backdrop-blur-md border-[#dfe6ff]/80",
                      hide: true,
                    },
                    {
                      x: 88,
                      y: 14,
                      scale: 0.94,
                      opacity: 0.62,
                      blur: "blur-[1px]",
                      glass: "bg-white/55 backdrop-blur-md border-[#dfe6ff]/80",
                      hide: true,
                    },
                    {
                      x: 0,
                      y: 28,
                      scale: 0.88,
                      opacity: 0.42,
                      blur: "blur-[2px]",
                      glass: "bg-white/45 backdrop-blur-lg border-[#dfe6ff]/70",
                      hide: true,
                    },
                  ]
                  const position = positions[index] || positions[positions.length - 1]
                  return (
                    <article
                      key={`${review.id}-${index}`}
                      className={`absolute inset-x-0 top-0 mx-auto flex h-[300px] w-full max-w-[560px] flex-col rounded-[28px] border p-6 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.35)] transition-all duration-700 md:h-[320px] ${position.blur} ${
                        index === 0 ? "border-[#dfe6ff] bg-white" : ""
                      } ${position.glass} ${position.hide ? "hidden md:block" : ""}`}
                      style={{
                        zIndex: 10 - index,
                        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${position.scale})`,
                        transformOrigin: "center top",
                        opacity: position.opacity,
                      }}
                      aria-hidden={index !== 0}
                    >
                      <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a2ce8]">
                        {review.tourId === "guatape-private" ? "Guatapé" : "Salto del Buey"}
                      </div>
                      {index === 0 ? (
                        <p
                          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 text-base leading-relaxed text-[#42527f]"
                          aria-live="polite"
                        >
                          “{review.comment}”
                        </p>
                      ) : (
                        <p className="mt-3 min-h-0 flex-1 overflow-hidden text-base leading-relaxed text-[#42527f]">
                          “{review.comment}”
                        </p>
                      )}
                      <div className="mt-4 flex shrink-0 items-center justify-between text-sm text-[#5b6a97]">
                        <span className="font-semibold text-[#1f3684]">{review.name}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#38cbe1] text-[#38cbe1]" />
                          {review.rating}
                        </span>
                      </div>
                    </article>
                  )
                })}
                <div className="pointer-events-none invisible relative h-[300px] md:h-[320px]" aria-hidden="true" />
              </div>

              {reviewCount > 1 && (
                <div className="mx-auto mt-6 flex max-w-[560px] flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full border-[#cbd7ff] text-[#1f3684] hover:bg-[#edf2ff]"
                      onClick={goPrev}
                      aria-label="Reseña anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center justify-center gap-2 px-2" role="tablist" aria-label="Elegir reseña">
                      {curatedHomeReviews.map((r, i) => (
                        <button
                          key={r.id}
                          type="button"
                          role="tab"
                          aria-selected={i === activeIndex}
                          aria-label={`Mostrar reseña ${i + 1} de ${reviewCount}`}
                          className={`h-2.5 rounded-full transition-all ${
                            i === activeIndex ? "w-8 bg-[#7a2ce8]" : "w-2.5 bg-[#c9d4ff] hover:bg-[#a8b8f0]"
                          }`}
                          onClick={() => goToReview(i)}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full border-[#cbd7ff] text-[#1f3684] hover:bg-[#edf2ff]"
                      onClick={goNext}
                      aria-label="Reseña siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-center text-xs text-[#5b6a97] sm:text-left">Cambia cada 11 s · También puedes elegir manualmente</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

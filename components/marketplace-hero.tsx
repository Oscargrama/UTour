"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Flame, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTourById } from "@/lib/tours-content"

type Lang = "es" | "en"

export function MarketplaceHero() {
  const [lang, setLang] = useState<Lang>("es")
  const topSellerTour = getTourById("salto-del-buey")
  const topSellerVideo = topSellerTour?.heroVideo
  const topSellerPoster = topSellerTour?.posterImage || topSellerTour?.heroImage

  useEffect(() => {
    const navLang = (typeof navigator !== "undefined" ? navigator.language : "es").toLowerCase()
    if (!navLang.startsWith("es")) setLang("en")
  }, [])

  const copy = useMemo(() => {
    if (lang === "en") {
      return {
        eyebrow: "Meet Colombia with local people",
        title: "Travel without pressure and with more freedom, at your own pace",
        subtitle:
          "Private or semi-private experiences designed around your style. We handle the details. You just enjoy the journey.",
        placeholder: "AI Asisstant soon available",
        cta: "Book Salto del Buey now",
        topSeller: "Top seller: Salto del Buey",
      }
    }
    return {
      eyebrow: "Conoce Colombia con gente local",
      title: "Viaja y conoce con mas libertad, sin prisa y a tu ritmo.",
      subtitle:
        "Recorridos turisticos privados o semiprivados, con gente local, diseñados según tu estilo. Nosotros organizamos. Tú vives la experiencia.",
      placeholder: "Asistente AI proximamente disponible",
      cta: "Reserva Salto del Buey ahora",
      topSeller: "Más comprado: Salto del Buey",
    }
  }, [lang])

  return (
    <section className="relative overflow-hidden bg-[#f4f7ff] py-14 md:py-20">
      <div className="absolute inset-x-0 top-0 h-60 brand-gradient-bg opacity-8" />
      <div className="container relative mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#7a2ce8]" />
            {copy.eyebrow}
          </p>
          <h1
            className="max-w-2xl text-4xl font-extrabold leading-tight text-[#101b4c] md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#44507b]">{copy.subtitle}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d9dfff] bg-white/80 px-3 py-1 text-xs font-semibold text-[#4b2db3]">
            <Flame className="h-3.5 w-3.5" />
            {copy.topSeller}
          </p>

          <div className="mt-8 max-w-2xl rounded-2xl border border-[#d9e2ff] bg-white p-2 shadow-[0_8px_24px_rgba(31,54,132,0.1)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <input
                aria-label="Orquestador AI"
                readOnly
                value={copy.placeholder}
                className="h-12 w-full rounded-xl border-0 bg-transparent px-4 text-[15px] text-[#33416f] outline-none"
              />
              <Button asChild size="lg" className="brand-cta-btn h-12 rounded-xl px-6">
                <Link href="/book?tour=salto-del-buey">
                  {copy.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#d9e2ff] bg-white shadow-[0_12px_40px_rgba(31,54,132,0.22)]">
          {topSellerVideo ? (
            <video
              src={topSellerVideo}
              poster={topSellerPoster}
              className="h-[420px] w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img src={topSellerPoster} alt="Salto del Buey" className="h-[420px] w-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1c4f]/55 via-[#1f3684]/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{copy.topSeller}</p>
            <h3 className="text-2xl font-bold text-white">Día de Aventura en Salto del Buey</h3>
            <p className="text-sm text-white/85">Salida desde Medellín · Naturaleza, cascadas y ritmo flexible.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

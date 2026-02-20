"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type Lang = "es" | "en"

export function MarketplaceHero() {
  const [lang, setLang] = useState<Lang>("es")

  useEffect(() => {
    const navLang = (typeof navigator !== "undefined" ? navigator.language : "es").toLowerCase()
    if (!navLang.startsWith("es")) setLang("en")
  }, [])

  const copy = useMemo(() => {
    if (lang === "en") {
      return {
        eyebrow: "Handcrafted Colombian travel, powered by AI",
        title: "Travel plans designed and booked in one flow.",
        subtitle:
          "Tell us your style, budget and group size. Our AI Orchestrator builds your itinerary and prepares checkout without friction.",
        placeholder: "Adventure + pueblos + nightlife, $1000, 2 people...",
        cta: "Reserve now",
      }
    }
    return {
      eyebrow: "Viajes hechos a tu medida con IA",
      title: "Viajes diseñados y reservados en un solo flujo.",
      subtitle:
        "Cuéntanos estilo, presupuesto y número de viajeros. Nuestro Orquestador IA arma tu itinerario y prepara checkout sin fricción.",
      placeholder: "Aventura + pueblos + noche, 1000 USD, 2 personas...",
      cta: "Reserva ahora",
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

          <div className="mt-8 max-w-2xl rounded-2xl border border-[#d9e2ff] bg-white p-2 shadow-[0_8px_24px_rgba(31,54,132,0.1)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <input
                aria-label="Orquestador AI"
                readOnly
                value={copy.placeholder}
                className="h-12 w-full rounded-xl border-0 bg-transparent px-4 text-[15px] text-[#33416f] outline-none"
              />
              <Button asChild size="lg" className="h-12 rounded-xl px-6">
                <Link href="/book">
                  {copy.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="/guatape-colombia-colorful-town-aerial-view-with-el.jpg"
            alt="Guatapé"
            className="h-[420px] w-full rounded-3xl object-cover shadow-[0_12px_40px_rgba(31,54,132,0.22)]"
          />
          <div className="absolute -bottom-6 -left-6 hidden w-[45%] overflow-hidden rounded-2xl border-4 border-white shadow-xl md:block">
            <img
              src="/comuna-13-graffiti-medellin-colorful-street-art-es.jpg"
              alt="Comuna 13"
              className="h-36 w-full object-cover"
            />
          </div>
          <div className="absolute -right-5 -top-5 hidden w-[34%] overflow-hidden rounded-2xl border-4 border-white shadow-xl md:block">
            <img src="/colombian-coffee-farm-tour-with-horses.jpg" alt="Tour del café" className="h-32 w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

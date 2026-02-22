"use client"

import { Button } from "@/components/ui/button"
import { Clock, MapPin, MessageCircle, Star, Users } from "lucide-react"
import { toursContent } from "@/lib/tours-content"

const handleBookingClick = (tourId: string) => {
  window.location.href = `/book?tour=${tourId}`
}

export function ToursSection() {
  return (
    <section id="tours" className="py-20 bg-gradient-to-b from-[#f5f8ff] to-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] text-balance md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experiencias, Tour por Tour
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Aquí está el contenido completo de cada experiencia para que compares con claridad: qué incluye, para quién
            es y cómo se vive.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-base font-medium text-[#1f3684]">
            Viaja con más libertad, sin afanes, en grupos privados o semiprivados.
          </p>
        </div>

        <div className="space-y-8">
          {toursContent.map((tour, index) => (
            <article
              key={tour.id}
              id={`tour-${tour.id}`}
              className="overflow-hidden rounded-3xl border border-[#dfe6ff] bg-white shadow-[0_20px_65px_-40px_rgba(31,54,132,0.35)]"
            >
              <div className="grid gap-0 lg:grid-cols-[1.05fr_1.2fr]">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="h-full min-h-[280px] w-full object-cover"
                />
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-[#d7e2ff] bg-[#f7f9ff] px-3 py-1 text-xs font-semibold text-[#1f3684]">
                      Tour {index + 1}
                    </span>
                    <span className="inline-flex rounded-full border border-[#cbe7ff] bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#1f85d4]">
                      Formato privado/semiprivado
                    </span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7e8] px-3 py-1 text-sm">
                      <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="font-semibold text-[#8f5f00]">{tour.rating}</span>
                      <span className="text-[#8f5f00]/70">({tour.reviews})</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
                    {tour.title}
                  </h3>
                  <p className="mb-5 leading-relaxed text-[#33416f]">{tour.summary}</p>

                  <div className="mb-5 grid gap-2 text-sm sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-xl bg-[#f5f8ff] px-3 py-2 text-[#38538f]">
                      <Clock className="h-4 w-4 text-[#1f85d4]" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[#f5f8ff] px-3 py-2 text-[#38538f]">
                      <Users className="h-4 w-4 text-[#1f85d4]" />
                      <span>{tour.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[#f5f8ff] px-3 py-2 text-[#38538f]">
                      <MapPin className="h-4 w-4 text-[#1f85d4]" />
                      <span>Salida desde Medellín</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">Ideal para</h4>
                      <ul className="space-y-1 text-sm text-[#42527f]">
                        {tour.idealFor.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">Incluye</h4>
                      <ul className="space-y-1 text-sm text-[#42527f]">
                        {tour.includes.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#e5ebff] bg-[#fbfcff] p-4">
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">
                      Experiencia y logística
                    </h4>
                    <ul className="mb-3 space-y-1 text-sm text-[#42527f]">
                      {tour.experience.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-[#42527f]">{tour.logistics}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-2xl font-bold text-[#1f3684]">{tour.price}</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button onClick={() => handleBookingClick(tour.id)} className="brand-cta-btn min-w-40">
                        Reservar Ahora
                      </Button>
                      <Button
                        variant="outline"
                        className="min-w-40 border-2 border-green-500 bg-transparent text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => {
                          window.open(
                            `https://api.whatsapp.com/send/?phone=573178494031&text=Hola%20Oscar!%20Me%20interesa%20el%20${encodeURIComponent(
                              tour.title,
                            )}.%20Podrías%20darme%20más%20información?`,
                            "_blank",
                          )
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

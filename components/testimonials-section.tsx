"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, ExternalLink } from "lucide-react"

const GURUWALK_REVIEWS = [
  {
    id: "guruwalk-1",
    name: "Alicia",
    location: "Munich, Alemania",
    rating: 5,
    comment:
      "Oscar was super friendly. He picked us up and even brought us to the airport, as we were short in time. We saw Guatape and two other villages and could stop wherever we wanted to, which was very nice :). I would really recommend the tour!",
    tour_type: "Guatapé desde Medellín: Tierra de Zocalos y Magia en las Montañas",
    verified: true,
    date: "Dic 2025",
    reviewId: "2553835",
  },
  {
    id: "guruwalk-2",
    name: "Kathleen",
    location: "Bradenton, FL, USA",
    rating: 5,
    comment:
      "Oscar was an excellent guide, good driver, proud Colombian who showed us many sources of his pride. Great experience!",
    tour_type: "Guatapé desde Medellín: Tierra de Zocalos y Magia en las Montañas",
    verified: true,
    date: "Dic 2025",
    reviewId: "2552172",
  },
  {
    id: "guruwalk-3",
    name: "Alicia",
    location: "Orlando, FL, USA",
    rating: 5,
    comment:
      "Oscar was a fantastic tour guide, we highly recommended him for any tour, we enjoyed the tour so much that if we go back we will get Oscar again.",
    tour_type: "Guatapé desde Medellín",
    verified: true,
    date: "Oct 2025",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lo Que Dicen Nuestros Viajeros
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Testimonios reales de personas que vivieron una experiencia inolvidable.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg font-bold text-[#f59e0b]">GuruWalk</span>
            <span className="text-sm font-medium text-muted-foreground">Reseñas Verificadas</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {GURUWALK_REVIEWS.map((review) => (
              <Card key={review.id} className="border-2 border-[#f59e0b] bg-[#fefce8] hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="text-xs font-semibold text-[#00b5d8] bg-white px-2 py-1 rounded-full">
                        ✓ Verificada
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-[#1f2937] leading-relaxed font-medium">"{review.comment}"</p>

                  <div className="border-t border-[#f59e0b]/30 pt-4 space-y-2">
                    <p className="font-bold text-[#1f2937]">{review.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.location} • {review.date}
                    </p>
                    {review.tour_type && <p className="text-sm text-[#00b5d8] font-medium">{review.tour_type}</p>}
                    <a
                      href="https://www.guruwalk.com/es/gurus/n3cmy71bzzr7s5n4xnh2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#f59e0b] hover:text-[#1f2937] font-medium transition-colors mt-2"
                    >
                      Ver perfil completo en GuruWalk
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

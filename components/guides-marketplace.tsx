import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Car, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { curatedReviews } from "@/lib/curated-reviews"

export async function GuidesMarketplace() {
  const supabase = await createClient()

  const { data: guides } = await supabase
    .from("guides")
    .select(`
      *,
      users (
        full_name,
        email
      )
    `)
    .eq("status", "approved")
    .order("average_rating", { ascending: false })

  if (!guides || guides.length === 0) {
    return null
  }

  const founderBioParagraphs = [
    "Hola, soy Oscar, tu acompañante en esta aventura y fundador de UTour.",
    "UTour nació porque los tours tradicionales se sienten apurados, impersonales y masivos. Decidí crear experiencias privadas o semiprivadas donde el viajero marca el ritmo, no el cronómetro. Porque viajar no debería sentirse como cumplir una agenda, sino como vivir una historia.",
  ]

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
            Equipo UTour
          </p>
          <h2
            className="bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Conoce a quien diseña cada experiencia
          </h2>
          <p className="mt-3 text-lg text-[#42527f]">Experiencias privadas o semiprivadas, creadas con intención local.</p>
        </div>

        <div className={`grid gap-8 ${guides.length === 1 ? "mx-auto max-w-4xl" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {guides.map((guide) => (
            (() => {
              const isFounderCard = guides.length === 1 || guide.users?.full_name?.toLowerCase().includes("david")
              const normalizedName = isFounderCard ? "Oscar Infante" : guide.users?.full_name
              const normalizedBio = guide.bio || "Guía turístico certificado con experiencia en Medellín"
              const normalizedImage = isFounderCard
                ? "/images/team/oscar-infante.webp"
                : guide.profile_image_url || "/placeholder.svg?height=300&width=400"
              const totalVisibleReviews = Math.max(Number(guide.total_reviews || 0), curatedReviews.length)

              return (
                <article
                  key={guide.id}
                  className="group overflow-hidden rounded-[28px] border border-[#dfe6ff] bg-white/90 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(122,44,232,0.35)]"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={normalizedImage}
                      alt={normalizedName || "Guía"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c4f]/75 via-[#1f3684]/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                      {isFounderCard && (
                        <Badge className="border-0 bg-white/95 text-[#4e24a8]">
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Guía y Founder UTour
                        </Badge>
                      )}
                      {guide.has_vehicle && (
                        <Badge className="border-0 bg-[#0ea5a8]/95 text-white">
                          <Car className="mr-1.5 h-3.5 w-3.5" />
                          Con Vehículo
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{normalizedName}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1f3684]">
                        <Star className="h-3.5 w-3.5 fill-[#38cbe1] text-[#38cbe1]" />
                        {guide.average_rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    {isFounderCard ? (
                      <div className="space-y-2.5 text-sm leading-relaxed text-[#42527f]">
                        {founderBioParagraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-[#42527f]">{normalizedBio}</p>
                    )}

                    {guide.skills && guide.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {guide.skills.slice(0, 4).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full border border-[#d7e2ff] bg-[#f6f9ff] px-2.5 py-1 text-xs font-semibold text-[#1f3684]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#42527f]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6ff] px-2.5 py-1 font-semibold text-[#1f3684]">
                        <Star className="h-3.5 w-3.5 fill-[#38cbe1] text-[#38cbe1]" />
                        {totalVisibleReviews} reseñas
                      </span>
                      {guide.available_tours && guide.available_tours.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6ff] px-2.5 py-1 font-semibold text-[#1f3684]">
                          <MapPin className="h-3.5 w-3.5 text-[#1f85d4]" />
                          {guide.available_tours.length} tours
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild className="brand-cta-btn h-10 rounded-full px-5 text-sm">
                        <Link href="/book">Reserva ahora</Link>
                      </Button>
                      <Button asChild variant="outline" className="h-10 rounded-full border-[#cbd7ff] text-[#1f3684]">
                        <Link href="/tours/guatape-private#resenas">Ver reseñas</Link>
                      </Button>
                      <Button asChild variant="outline" className="h-10 rounded-full border-[#cbd7ff] text-[#1f3684]">
                        <a
                          href="https://www.guruwalk.com/es/gurus/n3cmy71bzzr7s5n4xnh2"
                          target="_blank"
                          rel="noreferrer"
                        >
                          GuruWalk
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })()
          ))}
        </div>
      </div>
    </section>
  )
}

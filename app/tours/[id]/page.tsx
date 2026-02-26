import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { BadgeCheck, CalendarDays, Clock, ExternalLink, MapPin, Star, UserRound, Users } from "lucide-react"
import { getTourById, toursContent } from "@/lib/tours-content"
import { getCuratedReviewsByTourId } from "@/lib/curated-reviews"
import { createClient } from "@/lib/supabase/server"
import { TourMediaCarousel } from "@/components/tour-media-carousel"
import { getSiteUrl } from "@/lib/site-url"
import { buildTourStructuredData } from "@/lib/seo-tour-schema"
import { buildTourMetadata, notFoundTourMetadata } from "@/lib/seo-tour-metadata"

type TourDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const normalizedId = decodeURIComponent(id)
  const tour = getTourById(normalizedId)

  if (!tour) {
    return notFoundTourMetadata()
  }

  return buildTourMetadata(tour)
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params
  const normalizedId = decodeURIComponent(id)
  const tour = getTourById(normalizedId)
  const siteUrl = getSiteUrl()

  if (!tour) {
    notFound()
  }

  const tourStructuredData = buildTourStructuredData(tour, siteUrl)

  const curatedTourReviews = getCuratedReviewsByTourId(tour.id)
  const supabase = await createClient()
  const { data: submittedReviews } = await supabase
    .from("testimonials")
    .select("id, name, rating, comment, date")
    .eq("approved", true)
    .eq("tour_type", tour.id)
    .order("created_at", { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tourStructuredData) }} />
      <Header />
      <main className="bg-gradient-to-b from-[#f4f8ff] to-white py-10 md:py-14">
        <div className="container mx-auto px-4">
          <Link href="/" className="mb-6 inline-flex text-sm font-semibold text-[#1f85d4] hover:underline">
            Volver al inicio
          </Link>

          <article className="overflow-hidden rounded-3xl border border-[#dfe6ff] bg-white shadow-[0_20px_65px_-40px_rgba(31,54,132,0.35)]">
            <div className="grid items-start gap-0 lg:grid-cols-[minmax(360px,42%)_1fr]">
              <div className="relative h-[360px] overflow-hidden md:h-[460px] lg:h-[560px]">
                <TourMediaCarousel
                  title={tour.title}
                  heroVideo={tour.heroVideo}
                  posterImage={tour.posterImage}
                  heroImage={tour.heroImage}
                  gallery={tour.gallery}
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-[#cbe7ff] bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#1f85d4]">
                    Formato privado/semiprivado
                  </span>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#eef7ff] px-3 py-1 text-sm">
                    <Star className="h-4 w-4 fill-[#38cbe1] text-[#1f85d4]" />
                    <span className="font-semibold text-[#1f3684]">{tour.rating}</span>
                    <span className="text-[#1f3684]/70">({tour.reviews})</span>
                  </div>
                </div>

                <h1 className="mb-3 text-3xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
                  {tour.title}
                </h1>
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

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <section className="rounded-2xl border border-[#e5ebff] bg-[#fbfcff] p-4">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">Ideal para</h2>
                    <ul className="space-y-1 text-sm text-[#42527f]">
                      {tour.idealFor.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-[#e5ebff] bg-[#fbfcff] p-4">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">Incluye</h2>
                    <ul className="space-y-1 text-sm text-[#42527f]">
                      {tour.includes.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-[#e5ebff] bg-[#fbfcff] p-4 md:col-span-2 xl:col-span-1">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1f3684]">
                      Experiencia y logística
                    </h2>
                    <ul className="mb-3 space-y-1 text-sm text-[#42527f]">
                      {tour.experience.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-[#42527f]">{tour.logistics}</p>
                  </section>
                </div>

                <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-2xl font-bold text-[#1f3684]">{tour.price}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button asChild className="brand-cta-btn min-w-40">
                      <Link href={`/book?tour=${tour.id}`}>Agendar ahora</Link>
                    </Button>
                    <Button asChild variant="outline" className="min-w-40 border-[#cbd7ff] text-[#1f3684]">
                      <Link href={`/resenas/${tour.id}`}>Dejar reseña</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {(curatedTourReviews.length > 0 || (submittedReviews?.length ?? 0) > 0) && (
            <section id="resenas" className="mt-10">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
                  Reseñas de este tour
                </h2>
                <p className="text-[#42527f]">Opiniones reales de viajeros que ya vivieron esta experiencia.</p>
              </div>

              {curatedTourReviews.length > 0 && (
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1f3684]">GuruWalk</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#cbe7ff] bg-[#eef7ff] px-2 py-1 text-xs font-semibold text-[#1f85d4]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Reseñas verificadas
                    </span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {curatedTourReviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-[#dfe6ff] bg-gradient-to-b from-white to-[#f7faff] p-5 shadow-[0_16px_50px_-35px_rgba(31,54,132,0.4)]"
                      >
                        <div className="mb-3 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} className="h-4 w-4 fill-[#38cbe1] text-[#1f85d4]" />
                          ))}
                        </div>
                        <p className="mb-3 text-sm leading-relaxed text-[#1f2937]">"{review.comment}"</p>
                        <div className="space-y-1 border-t border-[#dce6ff] pt-3">
                          <p className="inline-flex items-center gap-2 font-semibold text-[#1f2937]">
                            <UserRound className="h-4 w-4 text-[#1f85d4]" />
                            {review.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{review.location}</p>
                          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {review.date}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <a
                    href="https://www.guruwalk.com/es/gurus/n3cmy71bzzr7s5n4xnh2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1f85d4] hover:underline"
                  >
                    Ver perfil completo en GuruWalk
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {(submittedReviews?.length ?? 0) > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1f3684]">Reseñas UTour</span>
                    <span className="text-sm font-medium text-muted-foreground">Aprobadas recientemente</span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {submittedReviews?.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-[#dfe6ff] bg-gradient-to-b from-white to-[#f7faff] p-5 shadow-[0_16px_50px_-35px_rgba(31,54,132,0.4)]"
                      >
                        <div className="mb-3 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < review.rating ? "fill-[#38cbe1] text-[#1f85d4]" : "text-[#d5dff8]"}`}
                            />
                          ))}
                        </div>
                        <p className="mb-3 text-sm leading-relaxed text-[#1f2937]">"{review.comment}"</p>
                        <div className="space-y-1 border-t border-[#dce6ff] pt-3">
                          <p className="inline-flex items-center gap-2 font-semibold text-[#1f2937]">
                            <UserRound className="h-4 w-4 text-[#1f85d4]" />
                            {review.name}
                          </p>
                          {review.date && (
                            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {review.date}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return toursContent.map((tour) => ({ id: tour.id }))
}

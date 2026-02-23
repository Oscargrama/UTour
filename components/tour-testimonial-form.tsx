"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

type TourTestimonialFormProps = {
  tourId: string
  tourTitle: string
}

export function TourTestimonialForm({ tourId, tourTitle }: TourTestimonialFormProps) {
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          name,
          country,
          rating,
          comment,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || "No se pudo enviar la reseña")
      }

      setSuccess(true)
      setName("")
      setCountry("")
      setRating(5)
      setComment("")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#dfe6ff] bg-white p-6 shadow-[0_20px_65px_-40px_rgba(31,54,132,0.35)] md:p-8">
          <p className="mb-2 text-sm font-semibold text-[#1f85d4]">Reseña del tour</p>
          <h1 className="mb-2 text-3xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
            {tourTitle}
          </h1>
          <p className="mb-6 text-[#42527f]">
            Gracias por viajar con UTour. Tu reseña nos ayuda a mejorar y a dar más confianza a nuevos viajeros.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Ej: Colombia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-xl border border-[#d6e2ff] bg-[#f7faff] p-2 transition hover:border-[#7a2ce8]"
                    aria-label={`Calificar ${value} estrellas`}
                  >
                    <Star className={`h-6 w-6 ${value <= rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[#b6c3ea]"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comentario</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Cuéntanos cómo fue tu experiencia"
                className="min-h-32"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                ¡Gracias! Tu reseña fue enviada y quedará visible cuando la aprobemos.
              </div>
            )}

            <Button type="submit" disabled={loading} className="brand-cta-btn h-11 w-full rounded-xl">
              {loading ? "Enviando..." : "Enviar reseña"}
            </Button>

            <Link href={`/tours/${tourId}`} className="block text-center text-sm font-semibold text-[#1f85d4] hover:underline">
              Volver al detalle del tour
            </Link>
          </form>
        </div>
      </div>
    </section>
  )
}

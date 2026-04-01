import { Button } from "@/components/ui/button"
import { Car, CircleCheck, Sparkles, Handshake } from "lucide-react"
import Link from "next/link"

const checklistItemClass =
  "flex items-start gap-3 rounded-xl border border-[#e8edff]/80 bg-white/60 px-3 py-2.5 backdrop-blur-sm"

export function JoinPlatform() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef3ff] py-20">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#38CBE1]/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7A2CE8]/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#7a2ce8]" />
            Colabora con UTour
          </p>
          <h2
            className="bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Únete a la plataforma
          </h2>
          <p className="mt-3 text-lg text-[#42527f]">
            Buscamos guías y aliados que compartan nuestra visión de experiencias privadas, personalizadas y sin prisas.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-stretch">
          {/* Guías — gradiente violeta / cyan */}
          <article className="group relative flex h-full flex-col rounded-[28px] bg-gradient-to-br from-[#7A2CE8] via-[#555bdf] to-[#38CBE1] p-[1px] shadow-[0_24px_60px_-28px_rgba(122,44,232,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-24px_rgba(122,44,232,0.45)]">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-gradient-to-b from-white via-[#fafbff] to-[#f0f4ff]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[#7A2CE8]/12 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#38CBE1]/10 blur-2xl" />

              <div className="relative flex h-full flex-col px-6 pb-6 pt-7 md:px-8 md:pb-8 md:pt-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A2CE8] to-[#555bdf] text-white shadow-[0_12px_28px_-8px_rgba(122,44,232,0.65)] ring-4 ring-white/80">
                    <Car className="h-7 w-7" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a2ce8]">En ruta</p>
                    <h3
                      className="mt-1 text-xl font-bold leading-tight text-[#1f3684] md:text-2xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Guías y riders certificados
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-[#42527f]">
                  Red selecta de guías y riders (con o sin vehículo) que entienden que el viajero marca el ritmo. Criterio,
                  calidez y excelencia — sin volumen masivo.
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7a2ce8]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Experiencias privadas y semiprivadas</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7a2ce8]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Estándar de calidad definido</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7a2ce8]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Capacitación y acompañamiento</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7a2ce8]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Trabajo por solicitud, no masivo</span>
                  </li>
                </ul>

                <div className="mt-auto border-t border-[#dfe6ff]/80 pt-6">
                  <Button className="brand-cta-btn h-12 w-full rounded-full text-base shadow-[0_8px_24px_-6px_rgba(122,44,232,0.45)]" size="lg" asChild>
                    <Link href="/auth/register-guide">Postular como guía o rider</Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Aliados — gradiente índigo / azul */}
          <article className="group relative flex h-full flex-col rounded-[28px] bg-gradient-to-br from-[#1F3684] via-[#1F85D4] to-[#38CBE1] p-[1px] shadow-[0_24px_60px_-28px_rgba(31,54,132,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-24px_rgba(31,85,212,0.4)]">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-gradient-to-b from-white via-[#f8faff] to-[#eef5ff]">
              <div className="pointer-events-none absolute -right-6 top-0 h-40 w-40 rounded-full bg-[#1f85d4]/15 blur-2xl" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-28 w-28 rounded-full bg-[#1f3684]/10 blur-2xl" />

              <div className="relative flex h-full flex-col px-6 pb-6 pt-7 md:px-8 md:pb-8 md:pt-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1F3684] to-[#1F85D4] text-white shadow-[0_12px_28px_-8px_rgba(31,85,212,0.55)] ring-4 ring-white/80">
                    <Handshake className="h-7 w-7" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f85d4]">En destino</p>
                    <h3
                      className="mt-1 text-xl font-bold leading-tight text-[#1f3684] md:text-2xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Hostales, hoteles y anfitriones aliados
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-[#42527f]">
                  Ofrece a tus huéspedes algo distinto a los tours tradicionales: experiencias UTour con comisiones claras y
                  seguimiento transparente.
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f85d4]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Comisión por reserva confirmada</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f85d4]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Código personalizado</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f85d4]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Seguimiento transparente</span>
                  </li>
                  <li className={checklistItemClass}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f85d4]" aria-hidden />
                    <span className="text-sm font-medium text-[#1f3684]">Experiencias que elevan su servicio</span>
                  </li>
                </ul>

                <div className="mt-auto border-t border-[#dfe6ff]/80 pt-6">
                  <Button className="brand-cta-btn h-12 w-full rounded-full text-base shadow-[0_8px_24px_-6px_rgba(31,85,212,0.4)]" size="lg" asChild>
                    <Link href="/auth/register-ambassador">Convertirme en aliado</Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

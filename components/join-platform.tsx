import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, CircleCheck, Sparkles, Handshake } from "lucide-react"
import Link from "next/link"

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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden border border-[#dfe6ff] bg-white/90 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(122,44,232,0.35)]">
            <CardHeader className="bg-gradient-to-r from-[#7A2CE8] via-[#555BDF] to-[#38CBE1] text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Car className="h-6 w-6" />
                Guías Seleccionados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#1f3684]">Guías certificados por UTour</h3>
              <p className="text-[#42527f]">
                Formamos una red selecta de guías y riders (con o sin vehiculo) que entienden que el viajero marca el
                ritmo. No buscamos volumen. Buscamos criterio, calidez y excelencia.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Experiencias privadas y semiprivadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Estándar de calidad definido</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Capacitación y acompañamiento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Trabajo por solicitud, no masivo</span>
                </li>
              </ul>
              <Button className="brand-cta-btn w-full rounded-full" size="lg" asChild>
                <Link href="/auth/register-guide">Postular como guía o rider</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-[#dfe6ff] bg-white/90 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(122,44,232,0.35)]">
            <CardHeader className="bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#38CBE1] text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Handshake className="h-6 w-6" />
                Aliados Estratégicos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#1f3684]">Aliados estratégicos</h3>
              <p className="text-[#42527f]">
                Hoteles, anfitriones y espacios que quieran ofrecer a sus huéspedes algo diferente a los tours
                tradicionales.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Comisión por reserva confirmada</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Código personalizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Seguimiento transparente</span>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheck className="h-5 w-5 text-[#1f85d4] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1f3684]">Experiencias que elevan su servicio</span>
                </li>
              </ul>
              <Button className="brand-cta-btn w-full rounded-full" size="lg" asChild>
                <Link href="/auth/register-ambassador">Convertirme en aliado</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

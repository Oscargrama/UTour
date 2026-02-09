import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Users, MapPin, DollarSign, Clock, Shield } from "lucide-react"
import Link from "next/link"

export function JoinPlatform() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Únete a la Plataforma</h2>
          <p className="text-xl text-muted-foreground">ingresa a la lista de espera    </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Guide Card */}
          <Card className="border-2 border-[#10b981] hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Car className="h-6 w-6" />
                Guía / Rider
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">Comparte tu pasión por Medellín y genera ingresos flexibles</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Gana $80,000 - $500,000 COP por tour</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Define tus horarios y disponibilidad</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Tours a pie o con tu vehículo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Capacitación y certificación incluida</span>
                </li>
              </ul>
              <Button className="w-full bg-[#10b981] hover:bg-[#059669] rounded-full" size="lg" asChild>
                <Link href="/auth/register-guide">Aplicar como Guía</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Ambassador Card */}
          <Card className="border-2 border-[#3b82f6] hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Embajador
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">Ideal para hostels, hoteles y recepcionistas de Airbnb</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span>10% de comisión por cada reserva</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span>Código único de referido personal</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span>Sin costo inicial, gana desde el día 1</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span>Dashboard para rastrear tus ganancias</span>
                </li>
              </ul>
              <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] opacity-100 rounded-full" size="lg" asChild>
                <Link href="/auth/register-ambassador">Ser Embajador</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

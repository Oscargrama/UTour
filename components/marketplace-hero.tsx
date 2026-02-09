"use client"

import { Button } from "@/components/ui/button"
import { Car, MapPin, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function MarketplaceHero() {
  const [userType, setUserType] = useState<"traveler" | "guide" | "ambassador">("traveler")

  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-[#f59e0b] via-[#fbbf24] to-[#10b981]">
      <div className="absolute inset-0 bg-black/20" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Tu Plataforma de Experiencias en Medellín
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-balance">
            Conectamos viajeros con guías locales certificados. Descubre, reserva y gana con YouTour.
          </p>

          {/* User Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setUserType("traveler")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                userType === "traveler"
                  ? "bg-white text-[#f59e0b] shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <MapPin className="inline mr-2 h-5 w-5" />
              Soy Viajero
            </button>
            <button
              onClick={() => setUserType("guide")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                userType === "guide"
                  ? "bg-white text-[#10b981] shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Car className="inline mr-2 h-5 w-5" />
              Soy Guía/Rider
            </button>
            <button
              onClick={() => setUserType("ambassador")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                userType === "ambassador"
                  ? "bg-white text-[#3b82f6] shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Users className="inline mr-2 h-5 w-5" />
              Soy Embajador
            </button>
          </div>

          {/* Dynamic CTA based on user type */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            {userType === "traveler" && (
              <>
                <h3 className="text-2xl font-bold mb-4">Explora Medellín con Guías Locales</h3>
                <p className="mb-6">Tours auténticos, transporte incluido, experiencias inolvidables</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-[#f59e0b] hover:bg-gray-100" asChild>
                    <Link href="/book">
                      <Calendar className="mr-2 h-5 w-5" />
                      Reservar Ahora
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 bg-transparent"
                    asChild
                  >
                    <Link href="#guides">Ver Guías Certificados</Link>
                  </Button>
                </div>
              </>
            )}

            {userType === "guide" && (
              <>
                <h3 className="text-2xl font-bold mb-4">Conviértete en Guía Certificado</h3>
                <p className="mb-6">Comparte tu pasión por Medellín y gana dinero mostrando tu ciudad</p>
                <ul className="text-left mb-6 space-y-2 max-w-md mx-auto">
                  <li className="flex items-start">
                    <span className="text-[#10b981] mr-2">✓</span>
                    Gana hasta $200,000 COP por tour
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#10b981] mr-2">✓</span>
                    Flexibilidad total de horarios
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#10b981] mr-2">✓</span>
                    Con o sin vehículo (tours a pie disponibles)
                  </li>
                </ul>
                <Button size="lg" className="bg-[#10b981] text-white hover:bg-[#059669]" asChild>
                  <Link href="/auth/register-guide">
                    <Car className="mr-2 h-5 w-5" />
                    Únete como Guía
                  </Link>
                </Button>
              </>
            )}

            {userType === "ambassador" && (
              <>
                <h3 className="text-2xl font-bold mb-4">Gana Comisiones por Referir Clientes</h3>
                <p className="mb-6">Perfecto para hostels, hoteles y recepcionistas de Airbnb</p>
                <ul className="text-left mb-6 space-y-2 max-w-md mx-auto">
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">✓</span>
                    10% de comisión por cada reserva
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">✓</span>
                    Tu código único de referido
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">✓</span>
                    Sin costo, 100% ganancias adicionales
                  </li>
                </ul>
                <Button size="lg" className="bg-[#3b82f6] text-white hover:bg-[#2563eb]" asChild>
                  <Link href="/auth/register-ambassador">
                    <Users className="mr-2 h-5 w-5" />
                    Únete como Embajador
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

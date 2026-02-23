import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Star, Users, MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/guatape-colombia-colorful-town-aerial-view-with-el.jpg"
          alt="Guatapé, Colombia"
          className="h-full w-full object-cover brightness-50"
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-[#f59e0b]" />
            <span className="text-sm font-medium">Medellín & Guatapé, Colombia</span>
          </div>

          <h1
            className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Descubre la Magia de Colombia con un Guía Local
          </h1>

          <p className="mb-8 text-xl text-gray-200 leading-relaxed max-w-2xl text-pretty">
            Tours privados personalizados a Guatapé, El Peñol y los mejores lugares de Medellín. Experiencias
            auténticas, no turismo masivo.
          </p>

          <div className="mb-8 flex flex-wrap gap-6 text-white">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="font-semibold">5.0</span>
              <span className="text-sm text-gray-300">(127 reseñas)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#f59e0b]" />
              <span className="text-sm text-gray-300">+500 viajeros felices</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-[#f59e0b] hover:bg-[#fbbf24] text-white text-lg px-8">
              <Link href="#booking">Reservar Tour Privado</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
            >
              <a
                href="https://api.whatsapp.com/send/?phone=573146726226&text=Hola%20UTour!%20Me%20gustaría%20información%20sobre%20tours%20privados%20en%20Guatapé%20y%20Medellín."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

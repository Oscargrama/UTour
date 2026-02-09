import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Globe, Shield } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Heart,
      title: "Pasión Local",
      description: "Nacido y criado en Medellín, comparto mi amor por Colombia con cada viajero.",
    },
    {
      icon: Globe,
      title: "Bilingüe",
      description: "Tours en español e inglés para que te sientas completamente cómodo.",
    },
    {
      icon: Award,
      title: "+5 Años de Experiencia",
      description: "Guía certificado con cientos de tours exitosos y viajeros felices.",
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description: "Tu seguridad es mi prioridad. Tours con todas las medidas necesarias.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src="/images/oscar-profile.jpeg"
                alt="Oscar - Guía Turístico"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#f59e0b] text-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold">500+</p>
              <p className="text-sm">Viajeros Felices</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2
              className="mb-6 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Conoce a tu Guía: Oscar
            </h2>

            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-8">
              <p>
                Hola! Soy Oscar, un apasionado guía turístico de Medellín. Durante más de 5 años, he tenido el
                privilegio de mostrar a viajeros de todo el mundo la belleza y calidez de mi tierra.
              </p>
              <p>
                Lo que más me gusta de ser guía es crear conexiones genuinas y mostrar el lado auténtico de Colombia que
                no encontrarás en las guías tradicionales. Cada tour es una oportunidad para compartir historias,
                cultura y crear recuerdos inolvidables.
              </p>
              <p>
                Mi objetivo es simple: que te vayas no solo con fotos increíbles, sino con una comprensión real de
                nuestra cultura y ganas de volver.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-sm bg-[#fefce8]">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-[#f59e0b] mb-3" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, MapPin, Star, MessageCircle } from "lucide-react"

const tours = [
  {
    id: "guatape-private",
    title: "Tour Privado Guatapé & El Peñol",
    description:
      "Experimenta la belleza de Guatapé con un tour completamente personalizado. Incluye visita a El Peñol, paseo en barco y tiempo libre en el pueblo.",
    image: "/guatape-colorful-zocalos-town-streets-colombia.jpg",
    duration: "8-10 horas",
    groupSize: "Hasta 4 personas",
    price: "$600.000 COP",
    rating: 5.0,
    reviews: 87,
    highlights: [
      "Transporte privado desde tu hotel",
      "Paseo en barco por el embalse",
      "Guía en español e inglés",
      "Flexibilidad total en el itinerario",
    ],
  },
  {
    id: "medellin-walking",
    title: "Free Walking Tour Medellín",
    description:
      "Conoce la verdadera Medellín con un local. Exploramos el centro, la Plaza Botero, y la increíble transformación de la ciudad.",
    image: "/medellin-plaza-botero-colombia-city-center.jpg",
    duration: "3 horas",
    groupSize: "Grupos pequeños",
    price: "Basado en propinas",
    rating: 5.0,
    reviews: 143,
    highlights: [
      "Historia y cultura paisa",
      "Plaza Botero y arte urbano",
      "Recomendaciones locales",
      "Grupos reducidos",
    ],
  },
  {
    id: "comuna-13",
    title: "Tour Comuna 13",
    description:
      "Descubre la increíble transformación de la Comuna 13, desde su difícil pasado hasta convertirse en un símbolo de esperanza y arte urbano.",
    image: "/comuna-13-graffiti-medellin-colorful-street-art-es.jpg",
    duration: "4 horas",
    groupSize: "Privado o grupal",
    price: "Desde $80.000 COP",
    rating: 4.9,
    reviews: 52,
    highlights: ["Escaleras eléctricas", "Arte urbano y graffiti", "Historia local auténtica", "Apoyo a la comunidad"],
  },
  {
    id: "tour-cafetero",
    title: "Tour del Café en Finca Típica Antioqueña",
    description:
      "Descubre todo el proceso del café desde la siembra hasta la taza. Vive la experiencia completa de la cultura cafetera paisa con cabalgata, almuerzo típico y cata de café.",
    image: "/colombian-coffee-farm-tour-with-horses.jpg",
    duration: "4 horas",
    groupSize: "Grupos pequeños",
    price: "$230.000 COP",
    rating: 5.0,
    reviews: 78,
    highlights: [
      "Cabalgata hasta la finca cafetera",
      "Proceso completo del café",
      "Almuerzo típico antioqueño",
      "Cata de café con diferentes filtrados",
    ],
  },
  {
    id: "city-tour-chiva",
    title: "City Tour En Chiva Por Sitios Emblemáticos",
    description:
      "Explora Medellín en chiva típica. Visita la Comuna 13, Plaza Botero, Pueblito Paisa y más. Incluye desayuno y almuerzo.",
    image: "/medellin-chiva-party-bus-tour.jpg",
    duration: "7 horas",
    groupSize: "Grupos",
    price: "$130.000 COP",
    rating: 4.8,
    reviews: 95,
    highlights: [
      "Transporte en chiva típica",
      "Comuna 13 y Plaza Botero",
      "Pueblito Paisa",
      "Desayuno y almuerzo incluidos",
    ],
  },
  {
    id: "tour-nocturno",
    title: "Tour Nocturno a 2 Miradores con Fogata",
    description:
      "Disfruta de las vistas nocturnas de Medellín desde dos miradores espectaculares. Incluye fogata, música en vivo y sabores locales.",
    image: "/medellin-night-city-lights-viewpoint.jpg",
    duration: "4 horas",
    groupSize: "Grupos pequeños",
    price: "Desde $150.000 COP",
    rating: 4.9,
    reviews: 64,
    highlights: [
      "Dos miradores panorámicos",
      "Fogata y música local",
      "Snacks y bebidas",
      "Experiencia nocturna única",
    ],
  },
]

const handleBookingClick = (tourId: string) => {
  window.location.href = `/book?tour=${tourId}`
}

export function ToursSection() {
  return (
    <section id="tours" className="py-20 bg-[#fefce8]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Tours Disponibles
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Elige tu aventura. Cada tour está diseñado para brindarte una experiencia auténtica y memorable.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-md">
                  <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                  <span className="text-sm font-semibold">{tour.rating}</span>
                  <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                  {tour.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">{tour.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-[#f59e0b]" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-[#f59e0b]" />
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-[#f59e0b]" />
                    <span>Salida desde Medellín</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-2xl font-bold text-[#f59e0b]">{tour.price}</p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <Button
                  onClick={() => handleBookingClick(tour.id)}
                  className="w-full bg-[#f59e0b] hover:bg-[#fbbf24] text-white"
                >
                  Reservar Ahora
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent"
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send/?phone=573178494031&text=Hola%20Oscar!%20Me%20interesa%20el%20${encodeURIComponent(tour.title)}%20para%20${tour.groupSize}.%20Podrías%20darme%20más%20información?`,
                      "_blank",
                    )
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

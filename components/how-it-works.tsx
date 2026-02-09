import { MapPin, Search, Calendar, Star } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Explora Tours",
      description: "Descubre experiencias auténticas en Medellín con guías locales certificados",
      color: "text-[#f59e0b]",
    },
    {
      icon: Calendar,
      title: "Reserva Fácil",
      description: "Selecciona fecha, hora y número de personas. Pago seguro y confirmación instantánea",
      color: "text-[#10b981]",
    },
    {
      icon: MapPin,
      title: "Punto de Encuentro",
      description: "Tu guía te recogerá en tu hotel o punto acordado. Todo incluido",
      color: "text-[#3b82f6]",
    },
    {
      icon: Star,
      title: "Vive la Experiencia",
      description: "Disfruta tu tour y califica a tu guía. Tu opinión ayuda a la comunidad",
      color: "text-[#f59e0b]",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
          <p className="text-xl text-muted-foreground">Simple, rápido y seguro como Uber</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center ${step.color}`}
                >
                  <step.icon className="h-10 w-10" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

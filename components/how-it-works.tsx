import { Bot, CalendarDays, CreditCard, Sparkles } from "lucide-react"

const steps = [
  {
    icon: CalendarDays,
    title: "Describe tu plan",
    description: "Fechas, intereses y presupuesto.",
  },
  {
    icon: Bot,
    title: "UTour AI estructura tu viaje",
    description: "Selecciona experiencias, optimiza tiempos y calcula costos.",
  },
  {
    icon: CreditCard,
    title: "Confirma todo en un solo pago",
    description: "Sin coordinar proveedores manualmente.",
  },
  {
    icon: Sparkles,
    title: "Operación automática",
    description: "Confirmaciones, recordatorios y soporte activo.",
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef3ff] py-20">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#38CBE1]/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7A2CE8]/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Cuentanos que quieres vivir, y lo organizamos en minutos.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="group rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_-35px_rgba(31,54,132,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(122,44,232,0.35)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A2CE8] via-[#555BDF] to-[#38CBE1] text-white shadow-lg shadow-[#1F85D4]/25">
                <step.icon className="h-5 w-5" />
              </div>

              <div className="mb-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[#1F85D4]/20 bg-[#1F85D4]/10 px-2 text-xs font-semibold text-[#1F3684]">
                {index + 1}
              </div>

              <h3 className="mb-2 text-xl font-semibold text-[#1F3684]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#1F3684]/75">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

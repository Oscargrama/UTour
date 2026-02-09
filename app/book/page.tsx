import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MultiStepBooking } from "@/components/multi-step-booking"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#fefce8]">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1
              className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Reserva Tu Aventura
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Elige si quieres reservar un grupo completo o compartir el viaje con otros viajeros
            </p>
          </div>
          <MultiStepBooking />
        </div>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  )
}

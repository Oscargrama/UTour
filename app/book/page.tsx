import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MultiStepBooking } from "@/components/multi-step-booking"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"

export const metadata: Metadata = {
  title: "Reservar tours en Medellín y Guatapé | UTour",
  description:
    "Este no es un tour más. Es tu momento de descubrir, caminar, probar, mirar y disfrutar sin afán. Reserva ahora con pago seguro en Mercado Pago y confirma tu experiencia en minutos.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Reservar tours en Medellín y Guatapé | UTour",
    description:
      "Reserva tu próxima experiencia y conoce el destino a tu ritmo. Más libertad. Más conexión. Más viaje.",
    url: "/book",
    type: "website",
    images: [
      {
        url: "/og/utour-default-1200x630.svg",
        width: 1200,
        height: 630,
        alt: "UTour - Reserva tu próxima experiencia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservar tours en Medellín y Guatapé | UTour",
    description: "Reserva tu próxima experiencia y conoce el destino a tu ritmo.",
    images: ["/og/utour-default-1200x630.svg"],
  },
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <Suspense fallback={null}>
            <MultiStepBooking />
          </Suspense>
        </div>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  )
}

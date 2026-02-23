import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MultiStepBooking } from "@/components/multi-step-booking"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"

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

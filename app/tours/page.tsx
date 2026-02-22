import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToursSection } from "@/components/tours-section"

export default function ToursPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ToursSection />
      </main>
      <Footer />
    </div>
  )
}

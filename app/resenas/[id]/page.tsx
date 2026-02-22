import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getTourById } from "@/lib/tours-content"
import { TourTestimonialForm } from "@/components/tour-testimonial-form"

type TourReviewPageProps = {
  params: Promise<{ id: string }>
}

export default async function TourReviewPage({ params }: TourReviewPageProps) {
  const { id } = await params
  const tour = getTourById(id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f8ff] to-white">
      <Header />
      <main>
        <TourTestimonialForm tourId={tour.id} tourTitle={tour.title} />
      </main>
      <Footer />
    </div>
  )
}

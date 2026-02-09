import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { TestimonialActions } from "@/components/testimonial-actions"

export default async function TestimonialsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Testimonios
          </h1>
          <p className="text-muted-foreground">Aprueba o rechaza testimonios de clientes</p>
        </div>

        <div className="space-y-4">
          {testimonials && testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{testimonial.name}</CardTitle>
                        <Badge variant={testimonial.approved ? "default" : "secondary"}>
                          {testimonial.approved ? "Aprobado" : "Pendiente"}
                        </Badge>
                      </div>

                      <div className="mb-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-muted-foreground mb-2">{testimonial.comment}</p>

                      {testimonial.tour_type && (
                        <p className="text-sm text-muted-foreground">Tour: {testimonial.tour_type}</p>
                      )}
                    </div>

                    <TestimonialActions testimonialId={testimonial.id} isApproved={testimonial.approved} />
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No hay testimonios aún</CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

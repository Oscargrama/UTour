import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Car } from "lucide-react"
import Image from "next/image"

export async function GuidesMarketplace() {
  const supabase = await createClient()

  const { data: guides } = await supabase
    .from("guides")
    .select(`
      *,
      users (
        full_name,
        email
      )
    `)
    .eq("status", "approved")
    .order("average_rating", { ascending: false })

  if (!guides || guides.length === 0) {
    return null
  }

  return (
    <section id="guides" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nuestros Guías Certificados</h2>
          <p className="text-xl text-muted-foreground">Expertos locales listos para mostrarte lo mejor de Medellín</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src={guide.profile_image_url || "/placeholder.svg?height=300&width=400"}
                  alt={guide.users?.full_name || "Guía"}
                  fill
                  className="object-cover"
                />
                {guide.has_vehicle && (
                  <Badge className="absolute top-4 right-4 bg-[#10b981]">
                    <Car className="h-3 w-3 mr-1" />
                    Con Vehículo
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{guide.users?.full_name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="font-semibold">{guide.average_rating}</span>
                      <span className="text-sm text-muted-foreground">({guide.total_reviews} reseñas)</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {guide.bio || "Guía turístico certificado con experiencia en Medellín"}
                </p>

                {guide.skills && guide.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.skills.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {guide.available_tours && guide.available_tours.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Tours disponibles:</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{guide.available_tours.length} tours</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

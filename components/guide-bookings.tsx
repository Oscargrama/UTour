"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Phone, Mail, Globe } from "lucide-react"

export default function GuideBookings({ guideId }: { guideId: string }) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchBookings()
  }, [guideId])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("guide_id", guideId)
        .eq("status", "confirmed")
        .order("date", { ascending: true })

      if (error) throw error

      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Cargando reservas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Reservas Confirmadas</CardTitle>
        <CardDescription>Tours asignados a ti por el administrador</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tienes reservas asignadas aún</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.tour_type}</h3>
                    <p className="text-sm text-muted-foreground">Ref: {booking.booking_reference}</p>
                  </div>
                  <Badge className="bg-green-500">Confirmada</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#f59e0b]" />
                    <span>
                      {new Date(booking.date).toLocaleDateString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#f59e0b]" />
                    <span>{booking.number_of_people} personas</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#f59e0b]" />
                    <span>{booking.language === "spanish" ? "Español" : "Inglés"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#f59e0b]" />
                    <span>{booking.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm">
                    <strong>Cliente:</strong> {booking.name}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {booking.email}
                  </p>
                  {booking.message && (
                    <p className="text-sm mt-2">
                      <strong>Notas:</strong> {booking.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

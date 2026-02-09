import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingActions } from "@/components/booking-actions"
import { BookingsCalendar } from "@/components/bookings-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function BookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: bookings } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })

  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
    completed: "bg-blue-500",
  }

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Reservas
          </h1>
          <p className="text-muted-foreground">Gestiona todas las reservas de tours</p>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Vista de Lista</TabsTrigger>
            <TabsTrigger value="calendar">Vista de Calendario</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <BookingsCalendar bookings={bookings || []} />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{booking.name}</CardTitle>
                          {booking.booking_reference && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {booking.booking_reference}
                            </Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                          <p>
                            <strong>Email:</strong> {booking.email}
                          </p>
                          <p>
                            <strong>Teléfono:</strong> {booking.phone}
                          </p>
                          <p>
                            <strong>Tour:</strong> {booking.tour_type}
                          </p>
                          <p>
                            <strong>Fecha:</strong> {new Date(booking.date).toLocaleDateString("es-CO")}
                          </p>
                          <p>
                            <strong>Personas:</strong> {booking.number_of_people}
                          </p>
                          <p>
                            <strong>Idioma:</strong> {booking.language === "spanish" ? "Español" : "English"}
                          </p>
                          {booking.has_minors && (
                            <p className="text-orange-600">
                              <strong>⚠️ Menores de edad en el grupo</strong>
                            </p>
                          )}
                          {booking.total_price && (
                            <p>
                              <strong>Precio:</strong> ${Number(booking.total_price).toLocaleString("es-CO")} COP
                            </p>
                          )}
                          {booking.message && (
                            <p className="col-span-2 mt-2">
                              <strong>Mensaje:</strong> {booking.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                          {booking.status}
                        </Badge>
                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No hay reservas aún</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

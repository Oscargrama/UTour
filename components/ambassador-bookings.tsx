"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AmbassadorBookings({ ambassadorId }: { ambassadorId: string }) {
  const [bookings, setBookings] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchData()
  }, [ambassadorId])

  const fetchData = async () => {
    try {
      // Get bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("ambassador_id", ambassadorId)
        .order("date", { ascending: false })

      if (bookingsError) throw bookingsError

      // Get commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from("commissions")
        .select("*, bookings(*)")
        .eq("ambassador_id", ambassadorId)
        .order("created_at", { ascending: false })

      if (commissionsError) throw commissionsError

      setBookings(bookingsData || [])
      setCommissions(commissionsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendiente", className: "bg-yellow-500" },
      confirmed: { label: "Confirmada", className: "bg-blue-500" },
      completed: { label: "Completada", className: "bg-green-500" },
      cancelled: { label: "Cancelada", className: "bg-red-500" },
    }
    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getCommissionStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendiente", className: "bg-yellow-500" },
      paid: { label: "Pagada", className: "bg-green-500" },
      cancelled: { label: "Cancelada", className: "bg-red-500" },
    }
    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Cargando datos...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="tours" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tours">Tours Referidos</TabsTrigger>
        <TabsTrigger value="commissions">Recompensas</TabsTrigger>
      </TabsList>

      <TabsContent value="tours">
        <Card>
          <CardHeader>
            <CardTitle>Tours Referidos</CardTitle>
            <CardDescription>Todos los tours reservados con tu código de referido</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tienes tours referidos aún</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{booking.tour_type}</h3>
                        <p className="text-sm text-muted-foreground">Ref: {booking.booking_reference}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString("es-CO")}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${booking.total_price?.toLocaleString("es-CO")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="commissions">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Recompensas</CardTitle>
            <CardDescription>Comisiones generadas por tus referidos</CardDescription>
          </CardHeader>
          <CardContent>
            {commissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tienes comisiones aún</p>
            ) : (
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />$
                          {Number.parseFloat(commission.amount).toLocaleString("es-CO")}
                        </h3>
                        <p className="text-sm text-muted-foreground">{commission.bookings?.tour_type}</p>
                      </div>
                      {getCommissionStatusBadge(commission.status)}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Tour: {commission.bookings?.booking_reference}</p>
                      {commission.paid_at && <p>Pagado: {new Date(commission.paid_at).toLocaleDateString("es-CO")}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

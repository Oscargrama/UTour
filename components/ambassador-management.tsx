"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AmbassadorManagement() {
  const [ambassadors, setAmbassadors] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: ambassadorsData, error: ambassadorsError } = await supabase
        .from("ambassadors")
        .select("*, users(full_name, email)")
        .order("created_at", { ascending: false })

      if (ambassadorsError) throw ambassadorsError

      const { data: commissionsData, error: commissionsError } = await supabase
        .from("commissions")
        .select("*, ambassadors(username, users(full_name)), bookings(tour_type, booking_reference)")
        .order("created_at", { ascending: false })

      if (commissionsError) throw commissionsError

      setAmbassadors(ambassadorsData || [])
      setCommissions(commissionsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const payCommission = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", commissionId)

      if (error) throw error

      toast({
        title: "Comisión pagada",
        description: "La comisión ha sido marcada como pagada exitosamente.",
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo marcar la comisión como pagada",
        variant: "destructive",
      })
    }
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
    <Tabs defaultValue="ambassadors" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ambassadors">Embajadores</TabsTrigger>
        <TabsTrigger value="commissions">Comisiones</TabsTrigger>
      </TabsList>

      <TabsContent value="ambassadors">
        <Card>
          <CardHeader>
            <CardTitle>Embajadores</CardTitle>
            <CardDescription>Gestiona embajadores y sus referidos</CardDescription>
          </CardHeader>
          <CardContent>
            {ambassadors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay embajadores registrados</p>
            ) : (
              <div className="space-y-4">
                {ambassadors.map((ambassador) => (
                  <div key={ambassador.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{ambassador.users?.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{ambassador.users?.email}</p>
                      </div>
                      <Badge className={ambassador.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                        {ambassador.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Username</p>
                        <p className="font-medium">{ambassador.username}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Teléfono</p>
                        <p className="font-medium">{ambassador.phone}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Comisión</p>
                        <p className="font-medium">{ambassador.commission_rate}%</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Total Ganado</p>
                        <p className="font-medium text-green-600">
                          ${Number.parseFloat(ambassador.total_earnings).toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">Código de Referido (UUID):</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ambassador.referral_code}</code>
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
            <CardTitle>Gestión de Comisiones</CardTitle>
            <CardDescription>Paga las comisiones pendientes a los embajadores</CardDescription>
          </CardHeader>
          <CardContent>
            {commissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay comisiones registradas</p>
            ) : (
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />$
                          {Number.parseFloat(commission.amount).toLocaleString("es-CO")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Embajador: {commission.ambassadors?.users?.full_name}
                        </p>
                      </div>
                      <Badge
                        className={
                          commission.status === "paid"
                            ? "bg-green-500"
                            : commission.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }
                      >
                        {commission.status === "paid"
                          ? "Pagada"
                          : commission.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                      </Badge>
                    </div>

                    <div className="text-sm">
                      <p>
                        <strong>Tour:</strong> {commission.bookings?.tour_type}
                      </p>
                      <p>
                        <strong>Ref. Reserva:</strong> {commission.bookings?.booking_reference}
                      </p>
                      {commission.paid_at && (
                        <p>
                          <strong>Pagado:</strong> {new Date(commission.paid_at).toLocaleDateString("es-CO")}
                        </p>
                      )}
                    </div>

                    {commission.status === "pending" && (
                      <Button
                        onClick={() => payCommission(commission.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Marcar como Pagada
                      </Button>
                    )}
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

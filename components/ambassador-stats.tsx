"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, CheckCircle, Clock } from "lucide-react"

export default function AmbassadorStats({
  ambassadorId,
  totalEarnings,
}: {
  ambassadorId: string
  totalEarnings: number
}) {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
  })
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchStats()
  }, [ambassadorId])

  const fetchStats = async () => {
    try {
      // Get all referrals
      const { data: allBookings } = await supabase.from("bookings").select("*").eq("ambassador_id", ambassadorId)

      // Get completed bookings
      const { data: completedBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("ambassador_id", ambassadorId)
        .eq("status", "completed")

      // Get commissions
      const { data: pendingCommissions } = await supabase
        .from("commissions")
        .select("amount")
        .eq("ambassador_id", ambassadorId)
        .eq("status", "pending")

      const { data: paidCommissions } = await supabase
        .from("commissions")
        .select("amount")
        .eq("ambassador_id", ambassadorId)
        .eq("status", "paid")

      const pendingTotal = pendingCommissions?.reduce((sum, c) => sum + Number.parseFloat(c.amount.toString()), 0) || 0
      const paidTotal = paidCommissions?.reduce((sum, c) => sum + Number.parseFloat(c.amount.toString()), 0) || 0

      setStats({
        totalReferrals: allBookings?.length || 0,
        completedReferrals: completedBookings?.length || 0,
        pendingCommissions: pendingTotal,
        paidCommissions: paidTotal,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Acumulado</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarnings.toLocaleString("es-CO")}</div>
          <p className="text-xs text-muted-foreground">Ganancias totales pagadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendiente de Pago</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.pendingCommissions.toLocaleString("es-CO")}</div>
          <p className="text-xs text-muted-foreground">Tours completados sin pagar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tours Completados</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedReferrals}</div>
          <p className="text-xs text-muted-foreground">De {stats.totalReferrals} referidos totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comisión Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {stats.completedReferrals > 0
              ? Math.round(
                  (stats.paidCommissions + stats.pendingCommissions) / stats.completedReferrals,
                ).toLocaleString("es-CO")
              : "0"}
          </div>
          <p className="text-xs text-muted-foreground">Por tour completado</p>
        </CardContent>
      </Card>
    </div>
  )
}

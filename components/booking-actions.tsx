"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface BookingActionsProps {
  bookingId: string
  currentStatus: string
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)

      if (error) throw error

      toast({
        title: "Estado actualizado",
        description: `Reserva marcada como ${newStatus}`,
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Update status error:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentStatus !== "confirmed" && (
          <DropdownMenuItem onClick={() => updateStatus("confirmed")}>Marcar como Confirmada</DropdownMenuItem>
        )}
        {currentStatus !== "completed" && (
          <DropdownMenuItem onClick={() => updateStatus("completed")}>Marcar como Completada</DropdownMenuItem>
        )}
        {currentStatus !== "cancelled" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")}>Marcar como Cancelada</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

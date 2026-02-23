"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface TestimonialActionsProps {
  testimonialId: string
  isApproved: boolean
}

export function TestimonialActions({ testimonialId, isApproved }: TestimonialActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const toggleApproval = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("testimonials").update({ approved: !isApproved }).eq("id", testimonialId)

      if (error) throw error

      toast({
        title: isApproved ? "Testimonio rechazado" : "Testimonio aprobado",
        description: isApproved
          ? "El testimonio ya no se mostrará públicamente"
          : "El testimonio ahora es visible en el sitio web",
      })

      router.refresh()
    } catch (error) {
      console.error("Toggle approval error:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el testimonio",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isApproved ? "destructive" : "default"}
      size="sm"
      onClick={toggleApproval}
      disabled={loading}
      className={!isApproved ? "bg-[#f59e0b] hover:bg-[#fbbf24]" : ""}
    >
      {isApproved ? (
        <>
          <X className="mr-2 h-4 w-4" />
          Rechazar
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          Aprobar
        </>
      )}
    </Button>
  )
}

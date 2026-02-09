"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Car } from "lucide-react"

export default function GuideManagement() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from("guides")
        .select("*, users(full_name, email)")
        .order("created_at", { ascending: false })

      if (error) throw error

      setGuides(data || [])
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateGuideStatus = async (guideId: string, status: string) => {
    try {
      const { error } = await supabase.from("guides").update({ status }).eq("id", guideId)

      if (error) throw error

      toast({
        title: status === "approved" ? "Guía aprobado" : "Guía rechazado",
        description: `El guía ha sido ${status === "approved" ? "aprobado" : "rechazado"} exitosamente.`,
      })

      fetchGuides()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado del guía",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendiente", className: "bg-yellow-500" },
      approved: { label: "Aprobado", className: "bg-green-500" },
      rejected: { label: "Rechazado", className: "bg-red-500" },
      inactive: { label: "Inactivo", className: "bg-gray-500" },
    }
    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Cargando guías...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Guías</CardTitle>
        <CardDescription>Aprueba o rechaza solicitudes de guías</CardDescription>
      </CardHeader>
      <CardContent>
        {guides.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay guías registrados</p>
        ) : (
          <div className="space-y-4">
            {guides.map((guide) => (
              <div key={guide.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{guide.users?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{guide.users?.email}</p>
                  </div>
                  {getStatusBadge(guide.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Documento</p>
                    <p className="font-medium">{guide.document_number}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Edad</p>
                    <p className="font-medium">{calculateAge(guide.birth_date)} años</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{guide.phone}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Vehículo</p>
                    <p className="font-medium flex items-center gap-1">
                      {guide.has_vehicle ? (
                        <>
                          <Car className="h-4 w-4 text-green-600" />
                          Sí
                        </>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                </div>

                {guide.available_tours && guide.available_tours.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tours disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {guide.available_tours.map((tour: string) => (
                        <Badge key={tour} variant="outline">
                          {tour}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {guide.status === "pending" && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      onClick={() => updateGuideStatus(guide.id, "approved")}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => updateGuideStatus(guide.id, "rejected")}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

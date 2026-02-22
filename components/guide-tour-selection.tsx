"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Car } from "lucide-react"

const AVAILABLE_TOURS = [
  {
    id: "guatape-private",
    name: "Tour Privado a Guatapé",
    requiresVehicle: true,
    description: "Tour privado con transporte a Guatapé, Piedra del Peñol y paseo en barco",
  },
  {
    id: "city-tour",
    name: "City Tour Medellín",
    requiresVehicle: false,
    description: "Recorrido por los principales sitios turísticos de Medellín",
  },
  {
    id: "comuna13",
    name: "Tour Comuna 13",
    requiresVehicle: false,
    description: "Visita guiada a la Comuna 13 y sus grafitis",
  },
  {
    id: "tour-cafetero",
    name: "Tour del Café en Finca Típica",
    requiresVehicle: true,
    description: "Tour del café con cabalgata, almuerzo típico y cata de café",
  },
  {
    id: "tour-nocturno",
    name: "Tour Nocturno a Miradores",
    requiresVehicle: true,
    description: "Tour nocturno a miradores con fogata y música local",
  },
  {
    id: "salto-del-buey",
    name: "Día de Aventura en Salto del Buey",
    requiresVehicle: true,
    description: "Experiencia de aventura en montaña y cascadas desde Medellín",
  },
]

export default function GuideTourSelection({
  guideId,
  currentTours,
  hasVehicle,
}: {
  guideId: string
  currentTours: string[]
  hasVehicle: boolean
}) {
  const [selectedTours, setSelectedTours] = useState<string[]>(currentTours)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()

  const handleToggleTour = (tourId: string) => {
    if (selectedTours.includes(tourId)) {
      setSelectedTours(selectedTours.filter((t) => t !== tourId))
    } else {
      setSelectedTours([...selectedTours, tourId])
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from("guides").update({ available_tours: selectedTours }).eq("id", guideId)

      if (error) throw error

      toast({
        title: "Tours actualizados",
        description: "Tu disponibilidad de tours ha sido actualizada correctamente.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron actualizar los tours",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona tus Tours Disponibles</CardTitle>
        <CardDescription>Marca los tours que puedes y quieres realizar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {AVAILABLE_TOURS.map((tour) => {
          const isDisabled = tour.requiresVehicle && !hasVehicle

          return (
            <div
              key={tour.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border ${
                isDisabled ? "bg-gray-50 opacity-60" : "bg-white"
              }`}
            >
              <Checkbox
                id={tour.id}
                checked={selectedTours.includes(tour.id)}
                onCheckedChange={() => !isDisabled && handleToggleTour(tour.id)}
                disabled={isDisabled}
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={tour.id}
                  className={`text-sm font-medium leading-none ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#f59e0b]" />
                    {tour.name}
                    {tour.requiresVehicle && <Car className="h-4 w-4 text-gray-500" />}
                  </div>
                </label>
                <p className="text-sm text-muted-foreground">{tour.description}</p>
                {isDisabled && (
                  <p className="text-xs text-red-600">Requiere vehículo propio (actualiza tu perfil si tienes uno)</p>
                )}
              </div>
            </div>
          )
        })}

        <Button onClick={handleSave} disabled={loading} className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]">
          {loading ? "Guardando..." : "Guardar Disponibilidad"}
        </Button>
      </CardContent>
    </Card>
  )
}

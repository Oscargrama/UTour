"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const TOURS = [
  { id: "Tour Privado Guatapé", price: 600000 },
  { id: "City Tour Medellín", price: 150000 },
  { id: "Tour Comuna 13", price: 100000 },
  { id: "Tour del Café", price: 230000 },
  { id: "Tour Nocturno Miradores", price: 150000 },
]

export default function AmbassadorBookingForm({ ambassadorId }: { ambassadorId: string }) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourType: "",
    numberOfPeople: 1,
    language: "spanish",
    hasMinors: false,
    message: "",
  })

  const selectedTour = TOURS.find((t) => t.id === formData.tourType)
  const totalPrice = selectedTour ? selectedTour.price * formData.numberOfPeople : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("bookings").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tour_type: formData.tourType,
        date: format(date, "yyyy-MM-dd"),
        number_of_people: formData.numberOfPeople,
        language: formData.language,
        has_minors: formData.hasMinors,
        message: formData.message,
        total_price: totalPrice,
        ambassador_id: ambassadorId,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Reserva creada",
        description: "La reserva ha sido creada exitosamente. El administrador la revisará pronto.",
      })

      router.push("/ambassador/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la reserva",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendar Tour como Embajador</CardTitle>
        <CardDescription>Crea una reserva directamente sin necesidad de código de referido</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Cliente</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tourType">Tour</Label>
              <Select
                value={formData.tourType}
                onValueChange={(value) => setFormData({ ...formData, tourType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tour" />
                </SelectTrigger>
                <SelectContent>
                  {TOURS.map((tour) => (
                    <SelectItem key={tour.id} value={tour.id}>
                      {tour.id} - ${tour.price.toLocaleString("es-CO")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => date < new Date()} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Número de Personas</Label>
              <Input
                id="numberOfPeople"
                type="number"
                min="1"
                max="10"
                required
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="english">Inglés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasMinors"
              checked={formData.hasMinors}
              onCheckedChange={(checked) => setFormData({ ...formData, hasMinors: checked as boolean })}
            />
            <Label htmlFor="hasMinors" className="text-sm font-normal">
              Hay menores de edad en el grupo
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Notas Adicionales</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Solicitudes especiales o información adicional..."
            />
          </div>

          {totalPrice > 0 && (
            <div className="bg-[#fef3c7] rounded-lg p-4">
              <p className="text-lg font-semibold">Total: ${totalPrice.toLocaleString("es-CO")} COP</p>
              <p className="text-sm text-muted-foreground">
                Tu comisión (10%): ${(totalPrice * 0.1).toLocaleString("es-CO")} COP
              </p>
            </div>
          )}

          <Button type="submit" className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
            {loading ? "Creando reserva..." : "Crear Reserva"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

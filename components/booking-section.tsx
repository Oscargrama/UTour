"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { emailTemplates } from "@/lib/email-templates"

const tourTypes = [
  { value: "guatape-private", label: "Tour Privado Guatapé & El Peñol" },
  { value: "medellin-walking", label: "Free Walking Tour Medellín" },
  { value: "comuna-13", label: "Tour Comuna 13" },
  { value: "custom", label: "Tour Personalizado" },
]

export function BookingSection() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tour_type: "",
    date: "",
    number_of_people: "2",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("bookings").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          tour_type: formData.tour_type,
          date: formData.date,
          number_of_people: Number.parseInt(formData.number_of_people),
          message: formData.message,
          status: "pending",
        },
      ])

      if (error) throw error

      const emailData = emailTemplates.bookingConfirmation({
        name: formData.name,
        tour_type: formData.tour_type,
        date: formData.date,
        number_of_people: Number.parseInt(formData.number_of_people),
      })

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email,
          ...emailData,
        }),
      })

      toast({
        title: "Reserva Enviada!",
        description: "Te contactaremos pronto para confirmar tu tour. Revisa tu email.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        tour_type: "",
        date: "",
        number_of_people: "2",
        message: "",
      })
    } catch (error) {
      console.error("[v0] Booking error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu reserva. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reserva Tu Aventura
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Completa el formulario y nos pondremos en contacto contigo para confirmar todos los detalles.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Información de Reserva</CardTitle>
              <CardDescription>Llena todos los campos y te responderemos en menos de 24 horas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        required
                        placeholder="Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="juan@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+57 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tour_type">Tipo de Tour *</Label>
                  <Select
                    value={formData.tour_type}
                    onValueChange={(value) => setFormData({ ...formData, tour_type: value })}
                    required
                  >
                    <SelectTrigger id="tour_type">
                      <SelectValue placeholder="Selecciona un tour" />
                    </SelectTrigger>
                    <SelectContent>
                      {tourTypes.map((tour) => (
                        <SelectItem key={tour.value} value={tour.value}>
                          {tour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha Preferida *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="pl-10"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number_of_people">Número de Personas *</Label>
                    <Select
                      value={formData.number_of_people}
                      onValueChange={(value) => setFormData({ ...formData, number_of_people: value })}
                      required
                    >
                      <SelectTrigger id="number_of_people">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "persona" : "personas"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje o Peticiones Especiales</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="message"
                      placeholder="Cuéntanos si tienes alguna petición especial o pregunta..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[100px] pl-10 pt-3 resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#f59e0b] hover:bg-[#fbbf24] text-lg"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Reserva"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Al enviar esta reserva, aceptas que te contactemos para confirmar los detalles.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

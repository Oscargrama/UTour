"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Users, Globe, User, Mail, Phone, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { emailTemplates } from "@/lib/email-templates"
import Link from "next/link"

const privateTours = [
  {
    id: "guatape-private",
    name: "Tour Privado Guatapé & El Peñol",
    description: "Visita la piedra, el pueblo colorido y paseo en lancha",
    price: 600000,
    duration: "10-12 horas",
  },
  {
    id: "custom-private",
    name: "Tour Privado Personalizado",
    description: "Diseña tu propia aventura en Medellín y alrededores",
    price: 0,
    duration: "Flexible",
  },
  {
    id: "tour-comuna-13",
    name: "Tour Comuna 13",
    description: "Descubre la transformación de la Comuna 13 con arte urbano y graffiti",
    price: 100000,
    duration: "4 horas",
  },
  {
    id: "tour-cafetero",
    name: "Tour del Café en Finca Típica",
    description: "Proceso completo del café, cabalgata, almuerzo y cata",
    price: 230000,
    duration: "4 horas",
  },
  {
    id: "city-tour-chiva",
    name: "City Tour en Chiva",
    description: "Recorrido por sitios emblemáticos en chiva típica",
    price: 130000,
    duration: "7 horas",
  },
  {
    id: "tour-nocturno",
    name: "Tour Nocturno a Miradores",
    description: "Vistas nocturnas, fogata y música local",
    price: 150000,
    duration: "4 horas",
  },
]

type Step = "mode" | "tour" | "date" | "details" | "contact" | "confirmation"

export function MultiStepBooking() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<Step>("mode")
  const [loading, setLoading] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [availableGroups, setAvailableGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    booking_mode: "" as "full_group" | "join_group" | "",
    tour_type: "",
    date: undefined as Date | undefined,
    number_of_people: "2",
    language: "spanish",
    name: "",
    phone: "",
    email: "",
    has_minors: false,
    referral_code: "",
    acceptTerms: false,
  })

  const steps: Step[] = ["mode", "tour", "date", "details", "contact", "confirmation"]
  const currentStepIndex = steps.indexOf(currentStep)

  useEffect(() => {
    if (formData.booking_mode === "join_group" && formData.tour_type && formData.date) {
      fetchAvailableGroups()
    }
  }, [formData.booking_mode, formData.tour_type, formData.date])

  const fetchAvailableGroups = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tour_type", formData.tour_type)
      .eq("date", formData.date?.toISOString().split("T")[0])
      .eq("is_group_open", true)
      .eq("status", "confirmed")
      .gt("available_seats", 0)

    if (!error && data) {
      setAvailableGroups(data)
    }
  }

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "mode":
        return !!formData.booking_mode
      case "tour":
        return !!formData.tour_type
      case "date":
        if (formData.booking_mode === "join_group") {
          return !!formData.date && !!selectedGroup
        }
        return !!formData.date
      case "details":
        return !!formData.number_of_people && !!formData.language
      case "contact":
        return !!formData.name && !!formData.email && !!formData.phone && formData.acceptTerms
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      const selectedTour = privateTours.find((t) => t.id === formData.tour_type)

      let ambassadorId = null
      if (formData.referral_code) {
        const { data: ambassadorData } = await supabase
          .from("ambassadors")
          .select("id")
          .eq("referral_code", formData.referral_code)
          .single()

        if (ambassadorData) {
          ambassadorId = ambassadorData.id
        }
      }

      if (formData.booking_mode === "join_group" && selectedGroup) {
        const { data: groupData, error: groupError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", selectedGroup)
          .single()

        if (groupError || !groupData) throw new Error("Grupo no encontrado")

        const newAvailableSeats = groupData.available_seats - Number.parseInt(formData.number_of_people)
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            available_seats: newAvailableSeats,
            is_group_open: newAvailableSeats > 0,
          })
          .eq("id", selectedGroup)

        if (updateError) throw updateError

        const { data, error } = await supabase
          .from("bookings")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              tour_type: formData.tour_type,
              date: formData.date?.toISOString().split("T")[0],
              number_of_people: Number.parseInt(formData.number_of_people),
              language: formData.language,
              has_minors: formData.has_minors,
              status: "confirmed",
              total_price: (selectedTour?.price || 0) * Number.parseInt(formData.number_of_people),
              ambassador_id: ambassadorId,
              referral_code: formData.referral_code || null,
              booking_mode: "join_group",
            },
          ])
          .select()

        if (error) throw error

        const reference = data[0]?.booking_reference || "N/A"
        setBookingReference(reference)
      } else {
        const peopleCount = Number.parseInt(formData.number_of_people)
        const maxCapacity = 4
        const availableSeats = maxCapacity - peopleCount

        const { data, error } = await supabase
          .from("bookings")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              tour_type: formData.tour_type,
              date: formData.date?.toISOString().split("T")[0],
              number_of_people: peopleCount,
              language: formData.language,
              has_minors: formData.has_minors,
              status: "pending",
              total_price: selectedTour?.price || 0,
              ambassador_id: ambassadorId,
              referral_code: formData.referral_code || null,
              booking_mode: "full_group",
              available_seats: availableSeats,
              is_group_open: availableSeats > 0,
            },
          ])
          .select()

        if (error) throw error

        const reference = data[0]?.booking_reference || "N/A"
        setBookingReference(reference)
      }

      const emailData = emailTemplates.bookingConfirmation({
        name: formData.name,
        tour_type: selectedTour?.name || formData.tour_type,
        date: formData.date?.toLocaleDateString("es-CO") || "",
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

      setCurrentStep("confirmation")

      toast({
        title: "¡Reserva Confirmada!",
        description: `Tu referencia es: ${bookingReference}`,
      })
    } catch (error) {
      console.error("[v0] Booking error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu reserva. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-white to-[#fefce8]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reserva Tu Aventura
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {formData.booking_mode === "join_group"
              ? "Únete a un grupo existente y comparte el viaje"
              : "Reserva tu tour completo o comparte con otros viajeros"}
          </p>
        </div>

        {currentStep !== "confirmation" && (
          <div className="mx-auto max-w-3xl mb-8">
            <div className="flex items-center justify-between">
              {["Modo", "Tour", "Fecha", "Detalles", "Contacto"].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      index <= currentStepIndex
                        ? "border-[#f59e0b] bg-[#f59e0b] text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  {index < 4 && (
                    <div className={`h-1 w-12 md:w-24 ${index < currentStepIndex ? "bg-[#f59e0b]" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === "mode" && "¿Cómo Quieres Viajar?"}
                {currentStep === "tour" && "Selecciona Tu Tour"}
                {currentStep === "date" && "Elige la Fecha"}
                {currentStep === "details" && "Detalles del Grupo"}
                {currentStep === "contact" && "Información de Contacto"}
                {currentStep === "confirmation" && "¡Reserva Confirmada!"}
              </CardTitle>
              <CardDescription>
                {currentStep === "mode" && "Elige si quieres reservar un grupo completo o unirte a otros viajeros"}
                {currentStep === "tour" && "Elige el tour que deseas realizar"}
                {currentStep === "date" && formData.booking_mode === "join_group"
                  ? "Selecciona la fecha y únete a un grupo existente"
                  : "Selecciona la fecha preferida para tu tour"}
                {currentStep === "details" && "Cuéntanos sobre tu grupo"}
                {currentStep === "contact" && "¿Cómo te contactamos?"}
                {currentStep === "confirmation" && "Tu reserva ha sido recibida"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === "mode" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div
                    onClick={() => setFormData({ ...formData, booking_mode: "full_group" })}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-[#f59e0b] ${
                      formData.booking_mode === "full_group" ? "border-[#f59e0b] bg-[#fef3c7]" : "border-gray-200"
                    }`}
                  >
                    <Users className="h-12 w-12 text-[#f59e0b] mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Reservar Grupo Completo</h3>
                    <p className="text-sm text-muted-foreground">
                      Reserva tu tour privado para tu grupo (1-4 personas). Precio fijo por el tour completo.
                    </p>
                  </div>
                  <div
                    onClick={() => setFormData({ ...formData, booking_mode: "join_group" })}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-[#f59e0b] ${
                      formData.booking_mode === "join_group" ? "border-[#f59e0b] bg-[#fef3c7]" : "border-gray-200"
                    }`}
                  >
                    <User className="h-12 w-12 text-[#f59e0b] mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Unirme a un Grupo</h3>
                    <p className="text-sm text-muted-foreground">
                      Comparte el tour con otros viajeros. Paga solo por tu(s) silla(s). Ideal para viajeros solos o
                      parejas.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "tour" && (
                <div className="space-y-4">
                  {privateTours.map((tour) => (
                    <div
                      key={tour.id}
                      onClick={() => setFormData({ ...formData, tour_type: tour.id })}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-[#f59e0b] ${
                        formData.tour_type === tour.id ? "border-[#f59e0b] bg-[#fef3c7]" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{tour.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{tour.description}</p>
                          <p className="text-sm text-muted-foreground mt-2">Duración: {tour.duration}</p>
                        </div>
                        {tour.price > 0 && (
                          <div className="text-right">
                            {formData.booking_mode === "join_group" ? (
                              <>
                                <p className="text-2xl font-bold text-[#f59e0b]">
                                  ${(tour.price / 4).toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-muted-foreground">por persona</p>
                              </>
                            ) : (
                              <>
                                <p className="text-2xl font-bold text-[#f59e0b]">
                                  ${tour.price.toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-muted-foreground">COP</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === "date" && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      className="rounded-md border"
                    />
                  </div>

                  {formData.booking_mode === "join_group" && formData.date && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Grupos Disponibles para esta Fecha:</h4>
                      {availableGroups.length > 0 ? (
                        <div className="space-y-3">
                          {availableGroups.map((group) => (
                            <div
                              key={group.id}
                              onClick={() => setSelectedGroup(group.id)}
                              className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-[#f59e0b] ${
                                selectedGroup === group.id ? "border-[#f59e0b] bg-[#fef3c7]" : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {group.available_seats}{" "}
                                    {group.available_seats === 1 ? "asiento disponible" : "asientos disponibles"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Idioma: {group.language === "spanish" ? "Español" : "English"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Users className="h-6 w-6 text-[#f59e0b]" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 border-2 border-dashed rounded-lg">
                          <p className="text-muted-foreground">
                            No hay grupos disponibles para esta fecha. Intenta otra fecha o reserva un grupo completo.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === "details" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Número de Personas{" "}
                      {formData.booking_mode === "join_group" ? "(máximo según disponibilidad)" : "(máximo 4)"}
                    </Label>
                    <Select
                      value={formData.number_of_people}
                      onValueChange={(value) => setFormData({ ...formData, number_of_people: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.booking_mode === "join_group" && selectedGroup
                          ? (() => {
                              const group = availableGroups.find((g) => g.id === selectedGroup)
                              const maxSeats = group?.available_seats || 4
                              return Array.from({ length: Math.min(maxSeats, 4) }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {num} {num === 1 ? "persona" : "personas"}
                                  </div>
                                </SelectItem>
                              ))
                            })()
                          : [1, 2, 3, 4].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {num} {num === 1 ? "persona" : "personas"}
                                </div>
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Idioma del Tour</Label>
                    <RadioGroup
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="spanish" id="spanish" />
                        <Label htmlFor="spanish" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Globe className="h-4 w-4" />
                          Español
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="english" id="english" />
                        <Label htmlFor="english" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Globe className="h-4 w-4" />
                          English
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <Checkbox
                      id="has_minors"
                      checked={formData.has_minors}
                      onCheckedChange={(checked) => setFormData({ ...formData, has_minors: checked as boolean })}
                    />
                    <Label htmlFor="has_minors" className="cursor-pointer flex-1">
                      ¿Hay menores de edad en el grupo?
                    </Label>
                  </div>
                </div>
              )}

              {currentStep === "contact" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo del Contacto *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+57 317 849 4031"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                  <div className="space-y-2">
                    <Label htmlFor="referral_code">¿Tienes un código de referido?</Label>
                    <Input
                      id="referral_code"
                      placeholder="Ingresa el código de tu embajador (opcional)"
                      value={formData.referral_code}
                      onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Si alguien te recomendó YouTour, ingresa su código aquí
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 border rounded-lg p-4 bg-gray-50">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm cursor-pointer leading-relaxed">
                      Acepto los{" "}
                      <Link
                        href="/legal/terms"
                        target="_blank"
                        className="text-[#f59e0b] underline hover:text-[#fbbf24]"
                      >
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/legal/privacy"
                        target="_blank"
                        className="text-[#f59e0b] underline hover:text-[#fbbf24]"
                      >
                        Política de Privacidad y Protección de Datos Personales
                      </Link>
                      . Autorizo el uso de mis datos personales exclusivamente para la gestión y control de mi reserva
                      con fines turísticos.
                    </Label>
                  </div>
                </div>
              )}

              {currentStep === "confirmation" && (
                <div className="text-center py-8 space-y-6">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                      <Check className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1f2937] mb-2">¡Reserva Recibida!</h3>
                    <p className="text-muted-foreground">
                      Tu referencia de reserva es: <span className="font-bold text-[#f59e0b]">{bookingReference}</span>
                    </p>
                  </div>
                  <div className="bg-[#fef3c7] rounded-lg p-6 text-left space-y-2">
                    <h4 className="font-semibold mb-4">Resumen de tu Reserva:</h4>
                    <p>
                      <strong>Tour:</strong>{" "}
                      {privateTours.find((t) => t.id === formData.tour_type)?.name || formData.tour_type}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formData.date?.toLocaleDateString("es-CO")}
                    </p>
                    <p>
                      <strong>Personas:</strong> {formData.number_of_people}
                    </p>
                    <p>
                      <strong>Idioma:</strong> {formData.language === "spanish" ? "Español" : "English"}
                    </p>
                    <p>
                      <strong>Contacto:</strong> {formData.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>. Te contactaremos pronto
                    para confirmar todos los detalles de tu tour.
                  </p>
                  <Button onClick={() => window.location.reload()} className="bg-[#f59e0b] hover:bg-[#fbbf24]">
                    Hacer Otra Reserva
                  </Button>
                </div>
              )}

              {currentStep !== "confirmation" && (
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={currentStepIndex === 0}
                    className="gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  {currentStep !== "contact" ? (
                    <Button
                      onClick={goToNextStep}
                      disabled={!canProceed()}
                      className="gap-2 bg-[#f59e0b] hover:bg-[#fbbf24]"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || loading}
                      className="gap-2 bg-[#f59e0b] hover:bg-[#fbbf24]"
                    >
                      {loading ? "Procesando..." : "Confirmar Reserva"}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

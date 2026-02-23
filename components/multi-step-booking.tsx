"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Users, Globe, User, Mail, Phone, Check, Loader2, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SecurePaymentsBadge } from "@/components/secure-payments-badge"

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
    id: "tour-nocturno",
    name: "Tour Nocturno a Miradores",
    description: "Vistas nocturnas, fogata y música local",
    price: 150000,
    duration: "4 horas",
  },
  {
    id: "salto-del-buey",
    name: "Día de Aventura en Salto del Buey",
    description: "Aventura de naturaleza y cascadas en entorno de montaña",
    price: 280000,
    duration: "10-12 horas",
  },
]

type Step = "mode" | "tour" | "date" | "details" | "contact" | "confirmation"
type OtpStep = "email" | "code"

export function MultiStepBooking() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const preselectedTourId = searchParams.get("tour")
  const hasPreselectedTour = !!preselectedTourId && privateTours.some((tour) => tour.id === preselectedTourId)
  const [currentStep, setCurrentStep] = useState<Step>("mode")
  const [loading, setLoading] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [otpStep, setOtpStep] = useState<OtpStep>("email")
  const [otpEmail, setOtpEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [resumeAfterAuth, setResumeAfterAuth] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [availableGroups, setAvailableGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    booking_mode: "" as "full_group" | "join_group" | "",
    tour_type: hasPreselectedTour ? (preselectedTourId as string) : "",
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

  const steps: Step[] = useMemo(
    () =>
      hasPreselectedTour
        ? ["mode", "date", "details", "contact", "confirmation"]
        : ["mode", "tour", "date", "details", "contact", "confirmation"],
    [hasPreselectedTour],
  )
  const visibleSteps = useMemo(() => steps.filter((step) => step !== "confirmation"), [steps])
  const currentStepIndex = steps.indexOf(currentStep)

  const DRAFT_STORAGE_KEY = "utour_booking_draft"
  const PENDING_PAYMENT_KEY = "utour_pending_payment"

  const saveBookingDraft = () => {
    if (typeof window === "undefined") return
    const draft = {
      currentStep,
      selectedGroup,
      formData: {
        ...formData,
        date: formData.date ? formData.date.toISOString() : null,
      },
    }
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    sessionStorage.setItem(PENDING_PAYMENT_KEY, "1")
  }

  const clearBookingDraft = () => {
    if (typeof window === "undefined") return
    sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    sessionStorage.removeItem(PENDING_PAYMENT_KEY)
  }

  useEffect(() => {
    if (formData.booking_mode === "join_group" && formData.tour_type && formData.date) {
      fetchAvailableGroups()
    }
  }, [formData.booking_mode, formData.tour_type, formData.date])

  useEffect(() => {
    const tourFromUrl = searchParams.get("tour")
    if (!tourFromUrl) return

    const exists = privateTours.some((tour) => tour.id === tourFromUrl)
    if (!exists) return

    setFormData((prev) => ({ ...prev, tour_type: tourFromUrl }))
  }, [searchParams])

  useEffect(() => {
    // If tour is preselected from URL, skip the tour step entirely.
    if (hasPreselectedTour && currentStep === "tour") {
      setCurrentStep("date")
    }
  }, [hasPreselectedTour, currentStep])

  useEffect(() => {
    const restoreBookingDraft = async () => {
      if (typeof window === "undefined") return

      const rawDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (!rawDraft) return

      try {
        const parsed = JSON.parse(rawDraft) as {
          currentStep?: Step
          selectedGroup?: string | null
          formData?: typeof formData & { date?: string | null }
        }

        if (parsed.formData) {
          setFormData({
            ...parsed.formData,
            date: parsed.formData.date ? new Date(parsed.formData.date) : undefined,
          })
          setOtpEmail(parsed.formData.email || "")
        }
        if (parsed.selectedGroup) setSelectedGroup(parsed.selectedGroup)
        if (parsed.currentStep && steps.includes(parsed.currentStep)) setCurrentStep(parsed.currentStep)
      } catch {
        // If draft is malformed, ignore it and continue.
      }

      const pendingPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY) === "1"
      if (!pendingPayment) return

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setAuthModalOpen(false)
        setResumeAfterAuth(true)
      }
    }

    void restoreBookingDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Resume payment only after restored state is actually available.
    if (!resumeAfterAuth) return
    if (!formData.tour_type || !formData.date || !formData.booking_mode) return

    setResumeAfterAuth(false)
    void handleSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeAfterAuth, formData.tour_type, formData.date, formData.booking_mode])

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

  const submitPayment = async () => {
    try {
      const supabase = createClient()
      const selectedTour = privateTours.find((t) => t.id === formData.tour_type)
      if (!selectedTour) throw new Error("Tour no válido")
      if (!formData.date) throw new Error("Fecha no válida")

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

      const peopleCount = Number.parseInt(formData.number_of_people)
      const totalPrice =
        formData.booking_mode === "join_group" ? Math.round((selectedTour.price / 4) * peopleCount) : selectedTour.price

      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tour_type: formData.tour_type,
        date: formData.date.toISOString().split("T")[0],
        number_of_people: peopleCount,
        language: formData.language as "spanish" | "english",
        has_minors: formData.has_minors,
        ambassador_id: ambassadorId,
        referral_code: formData.referral_code || null,
        booking_mode: formData.booking_mode as "full_group" | "join_group",
      }

      const response = await fetch("/api/payments/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingData,
          total_price: totalPrice,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.details || result?.error || "No se pudo crear la preferencia de pago")
      }

      const checkoutUrl = result?.checkout_url || result?.sandbox_init_point || result?.init_point
      if (!checkoutUrl) {
        throw new Error("No se recibió URL de checkout de Mercado Pago")
      }

      clearBookingDraft()

      toast({
        title: "Redirigiendo al pago",
        description: "Te estamos enviando a Mercado Pago para completar tu reserva.",
      })

      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar el pago. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const ensureAuthBeforePayment = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return !!user
  }

  const ensureUserProfileRecord = async () => {
    try {
      await fetch("/api/auth/ensure-user", {
        method: "POST",
      })
    } catch (error) {
      // Never block payment because of profile sync issues.
      console.warn("ensure-user warning:", error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setAuthError("")
    try {
      const isAuthenticated = await ensureAuthBeforePayment()
      if (!isAuthenticated) {
        saveBookingDraft()
        setOtpEmail(formData.email || "")
        setOtpStep("email")
        setOtpCode("")
        setAuthModalOpen(true)
        return
      }

      await ensureUserProfileRecord()
      await submitPayment()
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    setAuthError("")
    try {
      saveBookingDraft()
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/book${formData.tour_type ? `?tour=${formData.tour_type}` : ""}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      })
      if (error) throw error
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "No se pudo iniciar sesión con Google.")
      setAuthLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setAuthLoading(true)
    setAuthError("")
    try {
      const email = (otpEmail || formData.email || "").trim()
      if (!email) throw new Error("Ingresa tu email para recibir el código.")

      saveBookingDraft()
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error

      setOtpEmail(email)
      setOtpStep("code")
      toast({
        title: "Código enviado",
        description: "Revisa tu email e ingresa el código de acceso.",
      })
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "No se pudo enviar el código.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setAuthLoading(true)
    setAuthError("")
    try {
      if (!otpEmail.trim()) throw new Error("Email no válido.")
      if (!otpCode.trim()) throw new Error("Ingresa el código de verificación.")

      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email: otpEmail.trim(),
        token: otpCode.trim(),
        type: "email",
      })
      if (error) throw error

      setAuthModalOpen(false)
      await submitPayment()
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Código inválido o vencido.")
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <section id="booking" className="bg-white py-20">
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-[#dfe6ff] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1f3684]">Continúa al pago en 10 segundos</DialogTitle>
            <DialogDescription className="text-[#42527f]">
              Crea tu cuenta UTour para guardar tu reserva y ver su estado en tiempo real.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button onClick={handleGoogleSignIn} disabled={authLoading} className="brand-cta-btn w-full rounded-full">
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Continuar con Google
                </>
              )}
            </Button>

            <div className="rounded-xl border border-[#dfe6ff] bg-[#f8fbff] p-4 space-y-3">
              <Label htmlFor="otp-email" className="text-[#1f3684]">
                Recibir código por email
              </Label>
              <Input
                id="otp-email"
                type="email"
                value={otpEmail}
                onChange={(event) => setOtpEmail(event.target.value)}
                placeholder="tu@email.com"
                disabled={authLoading || otpStep === "code"}
              />

              {otpStep === "code" && (
                <Input
                  id="otp-code"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  placeholder="Código de 6 dígitos"
                  disabled={authLoading}
                />
              )}

              {otpStep === "email" ? (
                <Button onClick={handleSendOtp} disabled={authLoading} variant="outline" className="w-full rounded-full">
                  {authLoading ? "Enviando..." : "Enviar código"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleVerifyOtp} disabled={authLoading} className="brand-cta-btn flex-1 rounded-full">
                    {authLoading ? "Verificando..." : "Validar y continuar"}
                  </Button>
                  <Button
                    onClick={() => {
                      setOtpStep("email")
                      setOtpCode("")
                    }}
                    disabled={authLoading}
                    variant="outline"
                    className="rounded-full"
                  >
                    Volver
                  </Button>
                </div>
              )}
            </div>

            <p className="text-xs text-[#42527f]">No te pediremos contraseña. Tu reserva no se pierde.</p>
            {authError ? <p className="text-sm font-medium text-red-600">{authError}</p> : null}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-4xl font-bold text-transparent md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reserva Tu Aventura
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#42527f]">
            {formData.booking_mode === "join_group"
              ? "Únete a un grupo existente y comparte el viaje"
              : "Reserva tu tour completo o comparte con otros viajeros"}
          </p>
          {hasPreselectedTour ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c9d8ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3684]">
              <Sparkles className="h-4 w-4 text-[#7A2CE8]" />
              Tour seleccionado: {privateTours.find((tour) => tour.id === formData.tour_type)?.name || formData.tour_type}
            </div>
          ) : null}
        </div>

        {currentStep !== "confirmation" && (
          <div className="mx-auto max-w-3xl mb-8">
            <div className="flex items-center justify-between">
              {visibleSteps.map((step, index) => {
                  const label =
                    step === "mode"
                      ? "Modo"
                      : step === "tour"
                        ? "Tour"
                        : step === "date"
                          ? "Fecha"
                          : step === "details"
                            ? "Detalles"
                            : "Contacto"

                  return (
                    <div key={label} className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          index <= currentStepIndex
                            ? "border-[#7A2CE8] bg-gradient-to-br from-[#7A2CE8] via-[#555BDF] to-[#38CBE1] text-white"
                            : "border-[#cad7ff] bg-white text-[#8392ba]"
                        }`}
                      >
                        {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
                      </div>
                      {index < visibleSteps.length - 1 && (
                        <div
                          className={`h-1 w-12 md:w-24 ${index < currentStepIndex ? "bg-[#555BDF]" : "bg-[#d7e3ff]"}`}
                        />
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <Card className="border-[#dbe6ff] shadow-[0_24px_70px_-35px_rgba(31,54,132,0.45)]">
            <CardHeader>
              <CardTitle className="text-[#1f3684]">
                {currentStep === "mode" && "¿Cómo Quieres Viajar?"}
                {currentStep === "tour" && "Selecciona Tu Tour"}
                {currentStep === "date" && "Elige la Fecha"}
                {currentStep === "details" && "Detalles del Grupo"}
                {currentStep === "contact" && "Información de Contacto"}
                {currentStep === "confirmation" && "¡Reserva Confirmada!"}
              </CardTitle>
              <CardDescription className="text-[#5b6a97]">
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
                    className={`cursor-pointer rounded-2xl border-2 p-6 transition-all hover:border-[#7A2CE8] hover:shadow-md ${
                      formData.booking_mode === "full_group"
                        ? "border-[#7A2CE8] bg-gradient-to-br from-[#f3edff] to-[#ecf8ff]"
                        : "border-[#d8e2ff] bg-white"
                    }`}
                  >
                    <Users className="mb-4 h-12 w-12 text-[#1f85d4]" />
                    <h3 className="mb-2 text-lg font-semibold text-[#1f3684]">Reservar Grupo Completo</h3>
                    <p className="text-sm text-[#5b6a97]">
                      Reserva tu tour privado para tu grupo (1-4 personas). Precio fijo por el tour completo.
                    </p>
                  </div>
                  <div
                    onClick={() => setFormData({ ...formData, booking_mode: "join_group" })}
                    className={`cursor-pointer rounded-2xl border-2 p-6 transition-all hover:border-[#7A2CE8] hover:shadow-md ${
                      formData.booking_mode === "join_group"
                        ? "border-[#7A2CE8] bg-gradient-to-br from-[#f3edff] to-[#ecf8ff]"
                        : "border-[#d8e2ff] bg-white"
                    }`}
                  >
                    <User className="mb-4 h-12 w-12 text-[#1f85d4]" />
                    <h3 className="mb-2 text-lg font-semibold text-[#1f3684]">Unirme a un Grupo</h3>
                    <p className="text-sm text-[#5b6a97]">
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
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:border-[#7A2CE8] hover:shadow-md ${
                        formData.tour_type === tour.id
                          ? "border-[#7A2CE8] bg-gradient-to-br from-[#f3edff] to-[#ecf8ff]"
                          : "border-[#d8e2ff] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1f3684]">{tour.name}</h3>
                          <p className="mt-1 text-sm text-[#5b6a97]">{tour.description}</p>
                          <p className="mt-2 text-sm text-[#5b6a97]">Duración: {tour.duration}</p>
                        </div>
                        {tour.price > 0 && (
                          <div className="text-right">
                            {formData.booking_mode === "join_group" ? (
                              <>
                                <p className="text-2xl font-bold text-[#1f3684]">
                                  ${(tour.price / 4).toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-[#5b6a97]">por persona</p>
                              </>
                            ) : (
                              <>
                                <p className="text-2xl font-bold text-[#1f3684]">
                                  ${tour.price.toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-[#5b6a97]">COP</p>
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
                      className="rounded-2xl border border-[#d8e2ff]"
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
                              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:border-[#7A2CE8] ${
                                selectedGroup === group.id
                                  ? "border-[#7A2CE8] bg-gradient-to-br from-[#f3edff] to-[#ecf8ff]"
                                  : "border-[#d8e2ff] bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {group.available_seats}{" "}
                                    {group.available_seats === 1 ? "asiento disponible" : "asientos disponibles"}
                                  </p>
                                  <p className="text-sm text-[#5b6a97]">
                                    Idioma: {group.language === "spanish" ? "Español" : "English"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Users className="h-6 w-6 text-[#1f85d4]" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 border-2 border-dashed rounded-lg">
                          <p className="text-[#5b6a97]">
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
                      <div className="flex cursor-pointer items-center space-x-2 rounded-xl border border-[#d8e2ff] p-4 hover:bg-[#f7faff]">
                        <RadioGroupItem value="spanish" id="spanish" />
                        <Label htmlFor="spanish" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Globe className="h-4 w-4" />
                          Español
                        </Label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2 rounded-xl border border-[#d8e2ff] p-4 hover:bg-[#f7faff]">
                        <RadioGroupItem value="english" id="english" />
                        <Label htmlFor="english" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Globe className="h-4 w-4" />
                          English
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2 rounded-xl border border-[#d8e2ff] p-4">
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
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#8090bb]" />
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
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-[#8090bb]" />
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+57 314 672 6226"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8090bb]" />
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
                    <p className="text-xs text-[#5b6a97]">
                      Si alguien te recomendó UTour, ingresa su código aquí
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 rounded-xl border border-[#d8e2ff] bg-[#f8fbff] p-4">
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
                        className="text-[#1f85d4] underline hover:text-[#1f3684]"
                      >
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/legal/privacy"
                        target="_blank"
                        className="text-[#1f85d4] underline hover:text-[#1f3684]"
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
                    <p className="text-[#5b6a97]">
                      Tu referencia de reserva es: <span className="font-bold text-[#1f3684]">{bookingReference}</span>
                    </p>
                  </div>
                  <div className="space-y-2 rounded-2xl bg-gradient-to-br from-[#f3edff] to-[#ecf8ff] p-6 text-left">
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
                  <p className="text-sm text-[#5b6a97]">
                    Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>. Te contactaremos pronto
                    para confirmar todos los detalles de tu tour.
                  </p>
                  <Button onClick={() => window.location.reload()} className="brand-cta-btn">
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
                    className="gap-2 border-[#c9d8ff] bg-transparent text-[#1f3684]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  {currentStep !== "contact" ? (
                    <Button
                      onClick={goToNextStep}
                      disabled={!canProceed()}
                      className="brand-cta-btn gap-2"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || loading}
                      className="brand-cta-btn gap-2"
                    >
                      {loading ? "Procesando..." : "Confirmar Reserva"}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-center">
            <SecurePaymentsBadge />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegisterGuidePage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    documentNumber: "",
    documentIssueDate: "",
    birthDate: "",
    phone: "",
    hasVehicle: false,
    acceptTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (age < 18) {
        toast({
          title: "Error",
          description: "Debes ser mayor de 18 años para registrarte como guía.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "guide",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: "guide",
        })

        if (userError) throw userError

        const { error: guideError } = await supabase.from("guides").insert({
          user_id: authData.user.id,
          document_number: formData.documentNumber,
          document_issue_date: formData.documentIssueDate,
          birth_date: formData.birthDate,
          phone: formData.phone,
          has_vehicle: formData.hasVehicle,
          status: "pending",
        })

        if (guideError) throw guideError

        toast({
          title: "Registro exitoso",
          description: "Tu solicitud está siendo revisada. Te notificaremos cuando sea aprobada.",
        })

        router.push("/login")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Hubo un error al registrarte. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefce8] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>
          <CardTitle className="text-2xl font-bold">Únete como Guía</CardTitle>
          <CardDescription>Completa el formulario para ingresar a la lista de espera de UTour como guía turístico</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  required
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentIssueDate">Fecha de Expedición</Label>
                <Input
                  id="documentIssueDate"
                  type="date"
                  required
                  value={formData.documentIssueDate}
                  onChange={(e) => setFormData({ ...formData, documentIssueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasVehicle"
                checked={formData.hasVehicle}
                onCheckedChange={(checked) => setFormData({ ...formData, hasVehicle: checked as boolean })}
              />
              <Label htmlFor="hasVehicle" className="text-sm font-normal">
                Tengo vehículo propio (indispensable para tours privados a Guatapé)
              </Label>
            </div>

            <div className="flex items-start space-x-2 border rounded-lg p-4 bg-gray-50">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
              />
              <Label htmlFor="acceptTerms" className="text-sm cursor-pointer leading-relaxed">
                Acepto los{" "}
                <Link href="/legal/terms" target="_blank" className="text-[#f59e0b] underline hover:text-[#fbbf24]">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/legal/privacy" target="_blank" className="text-[#f59e0b] underline hover:text-[#fbbf24]">
                  Política de Privacidad y Protección de Datos Personales
                </Link>
                . Autorizo el uso de mis datos personales para la gestión de mi cuenta como guía turístico.
              </Label>
            </div>

            <Button type="submit" className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
              {loading ? "Registrando..." : "Registrarme como Guía"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

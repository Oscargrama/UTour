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

export default function RegisterAmbassadorPage() {
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
    phone: "",
    username: "",
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
      // Validate username format (alphanumeric)
      if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        toast({
          title: "Error",
          description: "El username debe ser alfanumérico (solo letras y números).",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "ambassador",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user record
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: "ambassador",
        })

        if (userError) throw userError

        // Create ambassador record
        const { data: ambassadorData, error: ambassadorError } = await supabase
          .from("ambassadors")
          .insert({
            user_id: authData.user.id,
            document_number: formData.documentNumber,
            phone: formData.phone,
            username: formData.username,
          })
          .select()
          .single()

        if (ambassadorError) throw ambassadorError

        toast({
          title: "Registro exitoso",
          description: `Tu código de referido es: ${ambassadorData.referral_code}`,
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>
          <CardTitle className="text-2xl font-bold">Únete como Embajador</CardTitle>
          <CardDescription>Refiere tours y gana comisiones del 10%</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="documentNumber">Número de Documento</Label>
              <Input
                id="documentNumber"
                required
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
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
              <Label htmlFor="username">Username (alfanumérico)</Label>
              <Input
                id="username"
                required
                placeholder="ejemplo: oscar123"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Este será tu identificador único para referidos</p>
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
                . Autorizo el uso de mis datos personales para la gestión de mi cuenta como embajador.
              </Label>
            </div>

            <Button type="submit" className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
              {loading ? "Registrando..." : "Registrarme como Embajador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

export default function SetupAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Starting signup process...")

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
          data: {
            role: "admin",
          },
        },
      })

      if (error) throw error

      console.log("[v0] Signup successful:", data)

      if (data.session) {
        // Email confirmation is disabled - user is immediately logged in
        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Redirigiendo al panel de administración...",
        })

        setTimeout(() => {
          router.push("/admin")
          router.refresh()
        }, 1000)
      } else if (data.user && !data.user.email_confirmed_at) {
        // Email confirmation is enabled - user needs to check email
        toast({
          title: "Revisa tu email",
          description:
            "Te hemos enviado un correo de confirmación. Si no lo recibes, contacta al administrador para desactivar la confirmación de email en Supabase.",
        })

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (error: any) {
      console.error("[v0] Signup error:", error)
      toast({
        title: "Error al crear usuario",
        description: error.message || "No se pudo crear el usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef3ff] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <BrandLogo />
          </div>
          <CardTitle>Configuración de Administrador</CardTitle>
          <CardDescription>Crea tu cuenta de administrador para acceder al panel de control</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="oscar@delabmarketing.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear Cuenta de Administrador"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-[#f59e0b] hover:underline">
                Inicia sesión aquí
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

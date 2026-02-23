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

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Attempting login...")

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      console.log("[v0] Login successful, checking user role...")

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("email", formData.email)
        .single()

      let effectiveRole = userData?.role
      let effectiveName = userData?.full_name

      if (userError) {
        console.warn("[v0] User role record not found, defaulting to user role:", userError.message)
        effectiveRole = "user"
        effectiveName = (authData.user?.user_metadata?.full_name as string | undefined) || formData.email.split("@")[0]
      }

      console.log("[v0] User role:", effectiveRole)

      let redirectPath = "/admin"
      switch (effectiveRole) {
        case "admin":
          redirectPath = "/admin"
          break
        case "guide":
          redirectPath = "/guide/dashboard"
          break
        case "ambassador":
          redirectPath = "/ambassador/dashboard"
          break
        case "user":
          redirectPath = "/account"
          break
        default:
          redirectPath = "/account"
      }

      console.log("[v0] Redirecting to:", redirectPath)

      toast({
        title: `¡Bienvenido${effectiveName ? ` ${effectiveName}` : ""}!`,
        description: "Has iniciado sesión exitosamente.",
      })

      window.location.href = redirectPath
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      let errorMessage = "Credenciales incorrectas."

      if (error.message?.includes("Email not confirmed")) {
        errorMessage =
          "Tu email no ha sido confirmado. Por favor revisa tu bandeja de entrada o contacta al administrador para desactivar la confirmación de email."
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos. Verifica tus datos."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error de autenticación",
        description: errorMessage,
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
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { BrandLogo } from "@/components/brand-logo"
import { Loader2, Sparkles } from "lucide-react"

type OtpStep = "email" | "code"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [otpStep, setOtpStep] = useState<OtpStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  const nextPath = useMemo(() => {
    const raw = searchParams.get("next")
    if (!raw) return "/account"
    if (!raw.startsWith("/")) return "/account"
    return raw
  }, [searchParams])

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) router.replace(nextPath)
    }
    void checkSession()
  }, [nextPath, router])

  const ensureUserProfileRecord = async () => {
    try {
      await fetch("/api/auth/ensure-user", { method: "POST" })
    } catch {
      // Non-blocking
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/login?next=${encodeURIComponent(nextPath)}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) throw error
    } catch (error) {
      toast({
        title: "No se pudo iniciar sesión con Google",
        description: error instanceof Error ? error.message : "Intenta de nuevo.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setLoading(true)
    try {
      if (!email.trim()) throw new Error("Ingresa tu email.")
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
      if (error) throw error
      setOtpStep("code")
      toast({
        title: "Código enviado",
        description: "Revisa tu correo e ingresa el código.",
      })
    } catch (error) {
      toast({
        title: "No se pudo enviar el código",
        description: error instanceof Error ? error.message : "Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      if (!email.trim()) throw new Error("Email no válido.")
      if (!code.trim()) throw new Error("Ingresa el código.")

      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      })
      if (error) throw error

      await ensureUserProfileRecord()

      toast({
        title: "Sesión iniciada",
        description: "Bienvenido a UTour.",
      })
      router.replace(nextPath)
    } catch (error) {
      toast({
        title: "Código inválido",
        description: error instanceof Error ? error.message : "Verifica e intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef3ff] px-4">
      <Card className="w-full max-w-md border-[#dbe6ff] shadow-[0_20px_70px_-40px_rgba(31,54,132,0.45)]">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <BrandLogo />
          </div>
          <CardTitle className="text-[#1f3684]">Iniciar Sesión</CardTitle>
          <CardDescription>Accede con Google o con código por email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogle} disabled={loading} className="brand-cta-btn w-full rounded-full">
            {loading ? (
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading || otpStep === "code"}
            />

            {otpStep === "code" ? (
              <Input
                id="otp-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de 6 dígitos"
                disabled={loading}
              />
            ) : null}

            {otpStep === "email" ? (
              <Button onClick={handleSendOtp} disabled={loading} variant="outline" className="w-full rounded-full">
                {loading ? "Enviando..." : "Enviar código"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleVerifyOtp} disabled={loading} className="brand-cta-btn flex-1 rounded-full">
                  {loading ? "Verificando..." : "Validar y continuar"}
                </Button>
                <Button
                  onClick={() => {
                    setOtpStep("email")
                    setCode("")
                  }}
                  disabled={loading}
                  variant="outline"
                  className="rounded-full"
                >
                  Volver
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

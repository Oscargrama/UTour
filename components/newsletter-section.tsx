"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { emailTemplates } from "@/lib/email-templates"

export function NewsletterSection() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Ya estás suscrito",
            description: "Este email ya está en nuestra lista.",
          })
        } else {
          throw error
        }
      } else {
        const emailData = emailTemplates.newsletterWelcome(email)

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            ...emailData,
          }),
        })

        toast({
          title: "Suscripción exitosa!",
          description: "Recibirás tips y ofertas especiales en tu email.",
        })
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-[#f59e0b]">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="mb-4 text-3xl font-bold text-white md:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recibe Tips de Viaje y Ofertas Exclusivas
          </h2>
          <p className="mb-8 text-white/90 leading-relaxed">
            Suscríbete a nuestro newsletter y recibe guías locales, consejos de viaje y descuentos especiales.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="bg-[#1f2937] hover:bg-[#374151] text-white">
              {loading ? "Enviando..." : "Suscribirme"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-white/75">No spam. Puedes desuscribirte en cualquier momento.</p>
        </div>
      </div>
    </section>
  )
}

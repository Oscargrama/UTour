"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AmbassadorReferralCode({
  username,
  referralCode,
}: {
  username: string
  referralCode: string
}) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast({
      title: "Código copiado",
      description: "El código de referido ha sido copiado al portapapeles",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white">
      <CardHeader>
        <CardTitle className="text-white">Tu Código de Referido</CardTitle>
        <CardDescription className="text-white/90">
          Comparte este código con tus clientes para ganar comisiones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-white/90 mb-2">Username:</p>
          <p className="text-2xl font-bold">{username}</p>
        </div>

        <div>
          <p className="text-sm text-white/90 mb-2">Código UUID:</p>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
            <code className="flex-1 text-sm font-mono break-all">{referralCode}</code>
            <Button onClick={copyToClipboard} size="sm" variant="secondary" className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="bg-white/20 rounded-lg p-4">
          <p className="text-sm">
            Ganas <strong>10%</strong> de comisión por cada tour completado con tu código de referido
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

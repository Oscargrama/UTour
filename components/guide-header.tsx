"use client"

import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function GuideHeader({ guideName }: { guideName: string }) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido {guideName}</h1>
          <p className="text-sm text-gray-600">Panel de Guía - YouTour</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            <span className="text-[#f59e0b]">You</span>
            <span className="text-[#1f2937]">Tour</span>
            <span className="ml-2 text-sm text-muted-foreground">Admin</span>
          </div>
        </Link>

        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader

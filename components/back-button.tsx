"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BackButtonProps = {
  label?: string
  fallbackHref?: string
  className?: string
  variant?: "default" | "ghost" | "link" | "outline" | "secondary"
  useHistory?: boolean
}

export function BackButton({
  label = "Volver",
  fallbackHref = "/",
  className,
  variant = "ghost",
  useHistory = true,
}: BackButtonProps) {
  const router = useRouter()

  return (
    <Button variant={variant} className={cn("text-[#1f3684] hover:text-[#5a2cc7]", className)} asChild>
      <Link
        href={fallbackHref}
        onClick={(event) => {
          if (useHistory && typeof window !== "undefined" && window.history.length > 1) {
            event.preventDefault()
            router.back()
          }
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}

"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@/lib/analytics"

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    analytics.trackPageView(pathname)
  }, [pathname])

  return <>{children}</>
}

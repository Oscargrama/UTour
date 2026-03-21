"use client"

import type React from "react"

import { AnalyticsWrapper } from "@/components/analytics-wrapper"
import { CurrencyProvider } from "@/components/currency-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsWrapper>
      <CurrencyProvider>{children}</CurrencyProvider>
    </AnalyticsWrapper>
  )
}

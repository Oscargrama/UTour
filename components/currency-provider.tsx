"use client"

import type React from "react"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { CurrencyCode, FxRates } from "@/lib/currency"
import { detectCurrencyFromLocale } from "@/lib/currency"

type CurrencyContextValue = {
  currency: CurrencyCode
  setCurrency: (value: CurrencyCode) => void
  rates: FxRates | null
  loadingRates: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

const STORAGE_KEY = "utour_currency"

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("COP")
  const [rates, setRates] = useState<FxRates | null>(null)
  const [loadingRates, setLoadingRates] = useState(true)

  const setCurrency = useCallback((value: CurrencyCode) => {
    setCurrencyState(value)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null
    if (stored) {
      setCurrencyState(stored)
      return
    }

    const bootstrap = async () => {
      try {
        const geoRes = await fetch("/api/geo")
        if (geoRes.ok) {
          const data = (await geoRes.json()) as { currency?: CurrencyCode; locale?: string | null }
          if (data.currency) {
            setCurrencyState(data.currency)
            return
          }
          const fallback = detectCurrencyFromLocale(data.locale || navigator.language)
          setCurrencyState(fallback)
          return
        }
      } catch {
        // Ignore geo errors and fallback to browser locale.
      }
      const fallback = detectCurrencyFromLocale(navigator.language)
      setCurrencyState(fallback)
    }

    void bootstrap()
  }, [])

  useEffect(() => {
    const loadRates = async () => {
      setLoadingRates(true)
      try {
        const res = await fetch("/api/fx-rates")
        if (!res.ok) throw new Error("FX response not OK")
        const data = (await res.json()) as FxRates
        setRates(data)
      } catch {
        setRates(null)
      } finally {
        setLoadingRates(false)
      }
    }

    void loadRates()
  }, [])

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      loadingRates,
    }),
    [currency, setCurrency, rates, loadingRates],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider")
  }
  return context
}

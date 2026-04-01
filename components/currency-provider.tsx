"use client"

import type React from "react"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import type { CurrencyCode, FxRates } from "@/lib/currency"
import { detectCurrencyFromLocale, isSupportedCurrency } from "@/lib/currency"

type CurrencyContextValue = {
  currency: CurrencyCode
  setCurrency: (value: CurrencyCode) => void
  rates: FxRates | null
  loadingRates: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

const STORAGE_KEY = "utour_currency"

const currencyListeners = new Set<() => void>()

function notifyCurrencyListeners() {
  currencyListeners.forEach((l) => l())
}

function subscribeCurrency(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onStoreChange()
  }
  window.addEventListener("storage", onStorage)
  currencyListeners.add(onStoreChange)
  return () => {
    window.removeEventListener("storage", onStorage)
    currencyListeners.delete(onStoreChange)
  }
}

function getCurrencySnapshot(): CurrencyCode {
  if (typeof window === "undefined") return "COP"
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (isSupportedCurrency(raw)) return raw
  return "COP"
}

function getServerCurrencySnapshot(): CurrencyCode {
  return "COP"
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getServerCurrencySnapshot,
  )
  const [rates, setRates] = useState<FxRates | null>(null)
  const [loadingRates, setLoadingRates] = useState(true)

  const setCurrency = useCallback((value: CurrencyCode) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, value)
    notifyCurrencyListeners()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.localStorage.getItem(STORAGE_KEY)) return

    const bootstrap = async () => {
      try {
        const geoRes = await fetch("/api/geo")
        if (geoRes.ok) {
          const data = (await geoRes.json()) as { currency?: CurrencyCode; locale?: string | null }
          if (data.currency) {
            setCurrency(data.currency)
            return
          }
          const fallback = detectCurrencyFromLocale(data.locale || navigator.language)
          setCurrency(fallback)
          return
        }
      } catch {
        // Ignore geo errors and fallback to browser locale.
      }
      const fallback = detectCurrencyFromLocale(navigator.language)
      setCurrency(fallback)
    }

    void bootstrap()
  }, [setCurrency])

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

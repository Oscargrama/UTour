"use client"

import { useMemo } from "react"
import { useCurrency } from "@/components/currency-provider"
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const labels: Record<CurrencyCode, string> = {
  COP: "COP",
  USD: "USD",
  EUR: "EUR",
}

export function CurrencySwitcher({
  className,
  triggerClassName,
}: {
  className?: string
  triggerClassName?: string
}) {
  const { currency, setCurrency } = useCurrency()

  const items = useMemo(
    () =>
      SUPPORTED_CURRENCIES.map((code) => ({
        value: code,
        label: labels[code],
      })),
    [],
  )

  return (
    <div className={className}>
      <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
        <SelectTrigger
          className={`h-9 w-[88px] rounded-full border-[#c9d4ff] bg-white text-[#1f3684] ${triggerClassName || ""}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

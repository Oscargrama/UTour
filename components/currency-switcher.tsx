"use client"

import { useMemo } from "react"
import { useCurrency } from "@/components/currency-provider"
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const labels: Record<CurrencyCode, { label: string; flag: string }> = {
  COP: { label: "COP", flag: "🇨🇴" },
  USD: { label: "USD", flag: "🇺🇸" },
  EUR: { label: "EUR", flag: "🇪🇺" },
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
        label: labels[code].label,
        flag: labels[code].flag,
      })),
    [],
  )

  return (
    <div className={className}>
      <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
        <SelectTrigger
          className={`h-10 min-w-[118px] rounded-full border border-[#c9d4ff] bg-white/90 px-3 text-sm font-semibold text-[#1f3684] shadow-sm ${triggerClassName || ""}`}
        >
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className="text-base">{labels[currency].flag}</span>
              <span>{labels[currency].label}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span className="flex items-center gap-2">
                <span className="text-base">{item.flag}</span>
                <span>{item.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

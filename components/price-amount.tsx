"use client"

import { formatCurrencyFromCop } from "@/lib/currency"
import { useCurrency } from "@/components/currency-provider"

export function PriceAmount({ amountCop }: { amountCop: number | null }) {
  const { currency, rates } = useCurrency()

  if (amountCop === null || !Number.isFinite(amountCop)) {
    return <span>-</span>
  }

  return <span>{formatCurrencyFromCop(amountCop, currency, rates)}</span>
}

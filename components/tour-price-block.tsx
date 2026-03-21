"use client"

import { formatCurrencyFromCop } from "@/lib/currency"
import { getTourPricing } from "@/lib/pricing"
import { useCurrency } from "@/components/currency-provider"

type TourPriceBlockProps = {
  tourId: string
  overrideGroupCop?: number
}

export function TourPriceBlock({ tourId, overrideGroupCop }: TourPriceBlockProps) {
  const { currency, rates } = useCurrency()
  const pricing = getTourPricing(tourId)

  if (!pricing) {
    return <p className="text-2xl font-bold text-[#1f3684]">Consultar precio</p>
  }

  if (pricing.model === "tips_based") {
    return <p className="text-2xl font-bold text-[#1f3684]">Basado en propinas</p>
  }

  if (overrideGroupCop) {
    return (
      <div>
        <p className="text-2xl font-bold text-[#1f3684]">
          {formatCurrencyFromCop(overrideGroupCop, currency, rates)}
        </p>
        <p className="text-xs text-[#5b6a97]">Precio por grupo privado (hasta 4 personas)</p>
      </div>
    )
  }

  const perPerson = pricing.copPerPerson

  return (
    <div>
      <p className="text-2xl font-bold text-[#1f3684]">
        {formatCurrencyFromCop(perPerson, currency, rates)}
      </p>
      <p className="text-xs text-[#5b6a97]">Precio por persona</p>
    </div>
  )
}

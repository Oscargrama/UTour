export type CurrencyCode = "COP" | "USD" | "EUR"

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ["COP", "USD", "EUR"]

export type FxRates = {
  USD: number
  EUR: number
  updatedAt: string
  buffered: boolean
  bufferPercent: number
}

export function formatCurrencyFromCop(
  amountCop: number,
  currency: CurrencyCode,
  rates: FxRates | null,
) {
  if (!Number.isFinite(amountCop)) return ""

  if (currency === "COP" || !rates) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amountCop)
  }

  const rate = rates[currency]
  const converted = amountCop * rate
  const locale = currency === "USD" ? "en-US" : "es-ES"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)
}

export function detectCurrencyFromLocale(locale: string | undefined | null): CurrencyCode {
  if (!locale) return "COP"
  const normalized = locale.replace("_", "-")
  const parts = normalized.split("-")
  const region = parts[1]?.toUpperCase()

  if (region === "CO") return "COP"
  if (region && ["US", "PR", "GU", "AS", "VI"].includes(region)) return "USD"

  const euroRegions = new Set([
    "AT",
    "BE",
    "CY",
    "DE",
    "EE",
    "ES",
    "FI",
    "FR",
    "GR",
    "HR",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "MT",
    "NL",
    "PT",
    "SI",
    "SK",
  ])
  if (region && euroRegions.has(region)) return "EUR"

  if (parts[0]?.toLowerCase() === "es") return "COP"

  return "USD"
}

export function detectCurrencyFromCountry(country: string | undefined | null): CurrencyCode {
  if (!country) return "COP"
  const upper = country.toUpperCase()

  if (upper === "CO") return "COP"
  if (["US", "PR", "GU", "AS", "VI"].includes(upper)) return "USD"

  const euroRegions = new Set([
    "AT",
    "BE",
    "CY",
    "DE",
    "EE",
    "ES",
    "FI",
    "FR",
    "GR",
    "HR",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "MT",
    "NL",
    "PT",
    "SI",
    "SK",
  ])
  if (euroRegions.has(upper)) return "EUR"

  return "USD"
}

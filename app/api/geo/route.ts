import { NextResponse } from "next/server"
import { detectCurrencyFromCountry, detectCurrencyFromLocale } from "@/lib/currency"

export async function GET(request: Request) {
  const headers = request.headers
  const country =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    ""
  const locale = headers.get("accept-language") || ""

  const currency = country
    ? detectCurrencyFromCountry(country)
    : detectCurrencyFromLocale(locale.split(",")[0] || locale)

  return NextResponse.json({
    country: country || null,
    locale: locale || null,
    currency,
  })
}

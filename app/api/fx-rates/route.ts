import { NextResponse } from "next/server"

const CACHE_TTL_MS = 1000 * 60 * 60 * 4
const BUFFER_PERCENT = 0.03
const FALLBACK_RATES = {
  USD: 0.00025,
  EUR: 0.00023,
}

let cached:
  | {
      USD: number
      EUR: number
      updatedAt: string
      buffered: boolean
      bufferPercent: number
      fetchedAt: number
    }
  | null = null

async function fetchRatesFromProvider() {
  const response = await fetch("https://open.er-api.com/v6/latest/COP", {
    headers: {
      "User-Agent": "UTour FX",
    },
  })

  if (!response.ok) {
    throw new Error(`FX provider failed (${response.status})`)
  }

  const data = (await response.json()) as { rates?: Record<string, number> }
  const usd = data.rates?.USD
  const eur = data.rates?.EUR

  if (!usd || !eur) {
    throw new Error("FX provider missing USD/EUR rates")
  }

  return { USD: usd, EUR: eur }
}

export async function GET() {
  const now = Date.now()
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=86400",
      },
    })
  }

  try {
    const baseRates = await fetchRatesFromProvider()
    const bufferedRates = {
      USD: baseRates.USD * (1 + BUFFER_PERCENT),
      EUR: baseRates.EUR * (1 + BUFFER_PERCENT),
    }

    cached = {
      USD: bufferedRates.USD,
      EUR: bufferedRates.EUR,
      updatedAt: new Date().toISOString(),
      buffered: true,
      bufferPercent: BUFFER_PERCENT,
      fetchedAt: now,
    }

    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=86400",
      },
    })
  } catch {
    const fallback = {
      USD: FALLBACK_RATES.USD * (1 + BUFFER_PERCENT),
      EUR: FALLBACK_RATES.EUR * (1 + BUFFER_PERCENT),
      updatedAt: new Date().toISOString(),
      buffered: true,
      bufferPercent: BUFFER_PERCENT,
      fetchedAt: now,
    }

    cached = fallback

    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600",
      },
    })
  }
}

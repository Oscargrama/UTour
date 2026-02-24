function normalizeSiteUrl(value: string) {
  const trimmed = value.trim()
  const url = new URL(trimmed)
  return url.origin
}

export function getSiteUrl() {
  const candidates = [process.env.NEXT_PUBLIC_APP_URL, process.env.APP_URL, "https://youtour.vercel.app"]

  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      return normalizeSiteUrl(candidate)
    } catch {
      // Try next candidate
    }
  }

  return "https://youtour.vercel.app"
}

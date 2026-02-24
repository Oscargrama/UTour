import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-url"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  const isNonProduction = process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development"

  return {
    rules: isNonProduction
      ? {
          userAgent: "*",
          disallow: "/",
        }
      : {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/login"],
        },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

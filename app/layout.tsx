import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AnalyticsWrapper } from "@/components/analytics-wrapper"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "U Tour - Tours Privados en Medellín y Guatapé | Viaja sin prisas. Vive de verdad.",
  description:
    "Reserva tu próxima experiencia y conoce el destino a tu ritmo. Más libertad. Más conexión. Más viaje.",
  keywords: "tours medellin, guatape tour, el peñol, tours privados colombia, guia turistico medellin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "U Tour - Tours Privados en Medellín",
    description: "Viaja sin prisas. Vive de verdad.",
    type: "website",
    url: siteUrl,
    siteName: "U Tour",
    images: [
      {
        url: "/og/utour-default-1200x630.svg",
        width: 1200,
        height: 630,
        alt: "U Tour - Viaja sin prisas. Vive de verdad.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "U Tour - Tours Privados en Medellín",
    description: "Viaja sin prisas. Vive de verdad.",
    images: ["/og/utour-default-1200x630.svg"],
  },
  generator: "UTour",
  icons: {
    icon: "/faviconU.png",
    shortcut: "/faviconU.png",
    apple: "/faviconU.png",
  },
}

export const viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    "@id": `${siteUrl}#organization`,
    name: "U Tour",
    alternateName: "UTour",
    description: "Viaja sin prisas. Vive de verdad.",
    areaServed: "Medellín, Antioquia, Colombia",
    telephone: "+573146726226",
    url: siteUrl,
    logo: `${siteUrl}/faviconU.png`,
    image: `${siteUrl}/faviconU.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Estadio - Laureles",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "U Tour",
    alternateName: "UTour",
    inLanguage: ["es", "en"],
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
  }

  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}

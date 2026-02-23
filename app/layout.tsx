import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AnalyticsWrapper } from "@/components/analytics-wrapper"

export const metadata: Metadata = {
  title: "UTour - Tours Privados en Medellín y Guatapé | Experiencias Auténticas",
  description:
    "Descubre Colombia con tours privados personalizados. Visita Guatapé, El Peñol y Medellín con un guía local experimentado. Tours en español e inglés.",
  keywords: "tours medellin, guatape tour, el peñol, tours privados colombia, guia turistico medellin",
  openGraph: {
    title: "UTour - Tours Privados en Medellín",
    description: "Experiencias auténticas con un guía local",
    type: "website",
  },
  generator: "UTour",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <AnalyticsWrapper>{children}</AnalyticsWrapper>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function BlogNewsletter() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="bg-[#0f1530] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#1f2b57] bg-[#141c3b] px-6 py-12 text-center text-white shadow-[0_20px_50px_rgba(6,10,26,0.35)] md:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#38cbe1]">Mantente curioso</span>
          <h2 className="mt-4 text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Recibe nuevas rutas sin prisa
          </h2>
          <p className="mt-4 text-base text-[#c9d3f8]">
            Ideas, guías y experiencias para viajar con más libertad y menos presión. Una vez al mes.
          </p>

          <form
            className="mt-8 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-center"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <input
              type="email"
              required
              placeholder="Tu correo"
              className="h-12 w-full rounded-full border border-[#2a3560] bg-[#0f1530] px-5 text-sm text-white placeholder:text-[#7e8ac2] focus:outline-none focus:ring-2 focus:ring-[#38cbe1] md:w-[320px]"
            />
            <Button type="submit" className="brand-cta-btn h-12 rounded-full px-6 font-semibold">
              {submitted ? "¡Gracias!" : "Suscribirme"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

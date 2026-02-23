"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { featuredHomeFaqs } from "@/lib/faqs-content"
import { Button } from "@/components/ui/button"

export function FAQSection() {
  return (
    <section id="faqs" className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef3ff] py-20">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#38CBE1]/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7A2CE8]/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#7a2ce8]" />
            Preguntas frecuentes
          </p>
          <h2
            className="mb-4 bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-4xl font-bold text-transparent md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lo esencial antes de reservar
          </h2>
          <p className="text-lg leading-relaxed text-[#42527f]">
            Seleccionamos las 5 dudas más importantes para ayudarte a decidir rápido.
          </p>
        </div>

        <div className="rounded-3xl border border-[#dfe6ff] bg-white/90 p-4 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)] md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {featuredHomeFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-[#1f3684]">{faq.question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-[#42527f]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 flex justify-center">
            <Button asChild className="brand-cta-btn rounded-full px-6">
              <Link href="/faqs">
                Ir a sección de FAQs completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

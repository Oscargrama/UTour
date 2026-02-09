"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface FAQ {
  id: string
  question: string
  answer: string
}

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from("faqs").select("*").order("order_index", { ascending: true })

        if (data) {
          setFaqs(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch FAQs:", error)
        // Silently fail - component will just show empty
      }
    }

    fetchFAQs()
  }, [])

  return (
    <section className="py-20 bg-[#fefce8]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Resuelve tus dudas antes de reservar tu aventura.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.id} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

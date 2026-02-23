import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqSections } from "@/lib/faqs-content"
import { Sparkles, BookOpenText } from "lucide-react"

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#eef3ff]">
      <Header />
      <main className="py-16">
        <section className="relative overflow-hidden py-10">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#38CBE1]/20 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7A2CE8]/20 blur-3xl" />
          </div>

          <div className="container relative mx-auto px-4">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b4a7a] shadow-sm">
                <Sparkles className="mr-2 h-4 w-4 text-[#7a2ce8]" />
                Centro de ayuda UTour
              </p>
              <h1
                className="mb-4 bg-gradient-to-r from-[#1F3684] via-[#1F85D4] to-[#7A2CE8] bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Preguntas frecuentes completas
              </h1>
              <p className="text-lg leading-relaxed text-[#42527f]">
                Toda la información clave para viajeros, guías, riders y aliados estratégicos.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6">
              {faqSections.map((section) => (
                <article
                  key={section.id}
                  className="rounded-3xl border border-[#dfe6ff] bg-white/90 p-5 shadow-[0_22px_65px_-35px_rgba(31,54,132,0.45)] md:p-7"
                >
                  <div className="mb-4">
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1f3684]">
                      <BookOpenText className="h-3.5 w-3.5 text-[#1f85d4]" />
                      {section.title}
                    </p>
                    <p className="text-sm text-[#42527f]">{section.subtitle}</p>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-left text-base font-semibold text-[#1f3684]">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="leading-relaxed text-[#42527f]">{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

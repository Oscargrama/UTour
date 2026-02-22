import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketplaceHero } from "@/components/marketplace-hero"
import { ToursQuickExplore } from "@/components/tours-quick-explore"
import { GuidesMarketplace } from "@/components/guides-marketplace"
import { HowItWorks } from "@/components/how-it-works"
import { JoinPlatform } from "@/components/join-platform"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MarketplaceHero />
        <HowItWorks />
        <ToursQuickExplore />
        <GuidesMarketplace />
        <JoinPlatform />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  )
}

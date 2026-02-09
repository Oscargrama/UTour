import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MessageCircle, MapPin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#fefce8]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl font-bold text-[#1f2937] md:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contacto
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Tienes preguntas? Contáctame directamente y te responderé lo antes posible.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
                <Phone className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="mb-2 font-semibold">Teléfono</h3>
              <p className="text-sm text-muted-foreground">+57 317 849 4031</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
                <MessageCircle className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="mb-2 font-semibold">WhatsApp</h3>
              <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-[#f59e0b]">
                <a
                  href="https://api.whatsapp.com/send/?phone=573178494031&text=Hola%20Oscar!%20Tengo%20algunas%20preguntas%20sobre%20los%20tours."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar mensaje
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
                <Mail className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="mb-2 font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground break-all">oscar@delabmarketing.com</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
                <Instagram className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="mb-2 font-semibold">Instagram</h3>
              <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-[#f59e0b]">
                <a href="https://www.instagram.com/oscargrama/" target="_blank" rel="noopener noreferrer">
                  @oscargrama
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
                <MapPin className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="mb-2 font-semibold">Ubicación</h3>
              <p className="text-sm text-muted-foreground">Medellín, Colombia</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

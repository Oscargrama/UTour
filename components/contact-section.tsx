import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h2
            className="mb-2 text-3xl font-bold text-[#1f2937] md:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contacto
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
            ¿Tienes preguntas? Escríbenos y te respondemos rápido.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff]">
                <Phone className="h-5 w-5 text-[#1f85d4]" />
              </div>
              <h3 className="mb-1 font-semibold">Teléfono</h3>
              <p className="text-sm text-muted-foreground">+57 314 672 6226</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff]">
                <MessageCircle className="h-5 w-5 text-[#1f85d4]" />
              </div>
              <h3 className="mb-1 font-semibold">WhatsApp</h3>
              <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-[#1f85d4]">
                <a
                  href="https://api.whatsapp.com/send/?phone=573146726226&text=Hola%20UTour!%20Tengo%20algunas%20preguntas%20sobre%20los%20tours."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar mensaje
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff]">
                <Mail className="h-5 w-5 text-[#1f85d4]" />
              </div>
              <h3 className="mb-1 font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground break-all">d.oinfante@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff]">
                <MapPin className="h-5 w-5 text-[#1f85d4]" />
              </div>
              <h3 className="mb-1 font-semibold">Ubicación</h3>
              <p className="text-sm text-muted-foreground">Medellín, Colombia</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

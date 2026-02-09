import Link from "next/link"
import { Instagram, Facebook, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1f2937] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="text-[#f59e0b]">You</span>
              <span className="text-white">Tour</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experiencias auténticas en Medellín y Guatapé con un guía local apasionado.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#tours" className="text-gray-300 hover:text-[#f59e0b]">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-[#f59e0b]">
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-300 hover:text-[#f59e0b]">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-[#f59e0b]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Tours Populares</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Guatapé & El Peñol</li>
              <li className="text-gray-300">Free Walking Tour Medellín</li>
              <li className="text-gray-300">Tour Privado Comuna 13</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <a href="tel:+573178494031" className="hover:text-[#f59e0b]">
                  +57 317 849 4031
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>oscar@delabmarketing.com</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.instagram.com/oscargrama/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#f59e0b]"
                aria-label="Instagram de Oscar"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#f59e0b]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/terms" className="text-gray-300 hover:text-[#f59e0b]">
              Términos y Condiciones
            </Link>
            <Link href="/legal/privacy" className="text-gray-300 hover:text-[#f59e0b]">
              Política de Privacidad
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} YouTour. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

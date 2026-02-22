import Link from "next/link"
import { Instagram, Facebook, Mail, Phone } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

export function Footer() {
  return (
    <footer className="bg-[#0f1b4d] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <BrandLogo className="mb-4" onDark />
            <p className="text-sm leading-relaxed text-[#c6d2ff]">
              Experiencias auténticas en Medellín y Guatapé con un guía local apasionado.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#tours" className="text-[#c6d2ff] hover:text-[#38cbe1]">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-[#c6d2ff] hover:text-[#38cbe1]">
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link href="/tours/guatape-private#resenas" className="text-[#c6d2ff] hover:text-[#38cbe1]">
                  Reseñas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#c6d2ff] hover:text-[#38cbe1]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Tours Populares</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-[#c6d2ff]">Guatapé & El Peñol</li>
              <li className="text-[#c6d2ff]">City Tour Medellín</li>
              <li className="text-[#c6d2ff]">Tour Privado Comuna 13</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#c6d2ff]">
                <Phone className="h-4 w-4" />
                <a href="tel:+573178494031" className="hover:text-[#38cbe1]">
                  +57 317 849 4031
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#c6d2ff]">
                <Mail className="h-4 w-4" />
                <span>oscar@delabmarketing.com</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.instagram.com/oscargrama/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c6d2ff] hover:text-[#38cbe1]"
                aria-label="Instagram de Oscar"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c6d2ff] hover:text-[#38cbe1]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#27418f] pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/terms" className="text-[#c6d2ff] hover:text-[#38cbe1]">
              Términos y Condiciones
            </Link>
            <Link href="/legal/privacy" className="text-[#c6d2ff] hover:text-[#38cbe1]">
              Política de Privacidad
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-[#9db0eb]">
          <p>&copy; {new Date().getFullYear()} YouTour. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

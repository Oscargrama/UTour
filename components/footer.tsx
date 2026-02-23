import Link from "next/link"
import { SecurePaymentsBadge } from "@/components/secure-payments-badge"

export function Footer() {
  return (
    <footer className="border-t border-[#dbe6ff] bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-5">
          <SecurePaymentsBadge />

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/terms" className="text-[#42527f] hover:text-[#1f85d4]">
              Términos y Condiciones
            </Link>
            <Link href="/legal/privacy" className="text-[#42527f] hover:text-[#1f85d4]">
              Política de Privacidad
            </Link>
          </div>

          <p className="text-center text-sm text-[#7384b1]">&copy; {new Date().getFullYear()} UTour. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

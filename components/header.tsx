import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, Users, Briefcase, Search, FileText, MessageCircle, Map, CircleHelp } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BrandLogo } from "@/components/brand-logo"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const displayName = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Cuenta"

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Experiencias", href: "#tours", icon: Map },
    { name: "Buscar", href: "/book", icon: Search },
    { name: "Reseñas", href: "/tours/guatape-private#resenas", icon: MessageCircle },
    { name: "FAQs", href: "/faqs", icon: CircleHelp },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Contacto", href: "#contact", icon: MessageCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dce3ff] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Inicio UTour">
          <BrandLogo large />
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden text-[#2a3868] md:flex">
                  <User className="mr-2 h-4 w-4" />
                  Hola, {displayName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/signout" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="hidden text-[#2a3868] md:flex">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          )}

          <Button asChild className="brand-cta-btn hidden rounded-full px-5 md:flex">
            <Link href="/book">Reserva ahora</Link>
          </Button>

          {/* Global menu (desktop + mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-[#c9d4ff] bg-white text-[#1f3684] hover:bg-[#edf2ff]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[360px] max-w-[92vw] bg-[#f8f9ff]">
              <nav className="mt-8 flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={`${item.name}-${item.href}`}
                    href={item.href}
                    className="rounded-lg px-4 py-3 text-lg font-medium text-[#2a3868] transition-colors hover:bg-white hover:text-[#7a2ce8]"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="my-2 border-t border-[#e2e8ff]" />

                {user ? (
                  <>
                    <Button asChild variant="outline" className="mt-2 bg-transparent text-[#1f3684]">
                      <Link href="/account">
                        <User className="mr-2 h-4 w-4" />
                        Mi cuenta
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-transparent text-[#1f3684]">
                      <Link href="/auth/signout">
                        <User className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="mt-2 bg-transparent text-[#1f3684]">
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="border border-[#c9d4ff] bg-white text-[#1f3684] hover:bg-[#edf2ff]">
                      Únete al Equipo
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuLabel>Trabaja con nosotros</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register-guide" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">Únete como Guía</div>
                          <div className="text-xs text-muted-foreground">Comparte tu pasión por Medellín</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register-ambassador" className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">Únete como Embajador</div>
                          <div className="text-xs text-muted-foreground">Gana comisiones por referidos</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button asChild variant="outline" className="bg-[#edf2ff] text-[#1f3684] hover:bg-[#dce6ff]">
                  <Link href="/auth/register-guide">
                    <Users className="mr-2 h-4 w-4" />
                    Únete como Guía
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-[#edf2ff] text-[#1f3684] hover:bg-[#dce6ff]">
                  <Link href="/auth/register-ambassador">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Únete como Embajador
                  </Link>
                </Button>
                <Button asChild className="brand-cta-btn rounded-full">
                  <Link href="/book">Reserva ahora</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

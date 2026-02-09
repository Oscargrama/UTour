import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, Users, Briefcase } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Tours", href: "#tours" },
    { name: "Sobre Mí", href: "#about" },
    { name: "Testimonios", href: "#testimonials" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            <span className="text-[#f59e0b]">You</span>
            <span className="text-[#1f2937]">Tour</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#f59e0b]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="hidden md:flex bg-transparent">
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hidden bg-[#10b981] hover:bg-[#059669] md:flex">Únete al Equipo</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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

          <Button asChild className="hidden bg-[#f59e0b] hover:bg-[#fbbf24] md:flex">
            <Link href="/book">Reservar Tour</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-muted-foreground hover:text-[#f59e0b]"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild variant="outline" className="mt-4 bg-transparent">
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-[#10b981] text-white hover:bg-[#059669]">
                  <Link href="/auth/register-guide">
                    <Users className="mr-2 h-4 w-4" />
                    Únete como Guía
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-[#3b82f6] text-white hover:bg-[#2563eb]">
                  <Link href="/auth/register-ambassador">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Únete como Embajador
                  </Link>
                </Button>
                <Button asChild className="bg-[#f59e0b] hover:bg-[#fbbf24]">
                  <Link href="/book">Reservar Tour</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MessageSquare, FileText, Mail, Users, Briefcase } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [
    bookingsResult,
    testimonialsResult,
    blogPostsResult,
    subscribersResult,
    guidesResult,
    ambassadorsResult,
    pendingGuidesResult,
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase.from("guides").select("*", { count: "exact", head: true }),
    supabase.from("ambassadors").select("*", { count: "exact", head: true }),
    supabase.from("guides").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  const stats = [
    {
      title: "Reservas Totales",
      value: bookingsResult.count || 0,
      icon: Calendar,
      href: "/admin/bookings",
      color: "text-[#f59e0b]",
    },
    {
      title: "Guías",
      value: guidesResult.count || 0,
      icon: Users,
      href: "/admin/guides",
      color: "text-[#00b5d8]",
      badge: pendingGuidesResult.count || 0,
    },
    {
      title: "Embajadores",
      value: ambassadorsResult.count || 0,
      icon: Briefcase,
      href: "/admin/ambassadors",
      color: "text-[#f59e0b]",
    },
    {
      title: "Testimonios",
      value: testimonialsResult.count || 0,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-[#00b5d8]",
    },
    {
      title: "Posts de Blog",
      value: blogPostsResult.count || 0,
      icon: FileText,
      href: "/admin/blog",
      color: "text-[#1f2937]",
    },
    {
      title: "Suscriptores",
      value: subscribersResult.count || 0,
      icon: Mail,
      href: "/admin/subscribers",
      color: "text-[#f59e0b]",
    },
  ]

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground">Bienvenido de vuelta! Aquí está un resumen de tu negocio.</p>
        </div>

        {pendingGuidesResult.count && pendingGuidesResult.count > 0 && (
          <Card className="mb-6 border-[#f59e0b] bg-[#fef3c7]">
            <CardHeader>
              <CardTitle className="text-[#92400e]">Solicitudes Pendientes</CardTitle>
              <CardDescription>
                Tienes {pendingGuidesResult.count} solicitud{pendingGuidesResult.count > 1 ? "es" : ""} de guía
                {pendingGuidesResult.count > 1 ? "s" : ""} esperando aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-[#f59e0b] hover:bg-[#fbbf24]">
                <Link href="/admin/guides">Revisar Solicitudes</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {stat.badge !== undefined && stat.badge > 0 && (
                    <span className="bg-[#f59e0b] text-white text-xs font-bold px-2 py-1 rounded-full">
                      {stat.badge}
                    </span>
                  )}
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <Button asChild variant="link" className="px-0 text-xs mt-2">
                  <Link href={stat.href}>Ver detalles →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Administra tu contenido y equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="bg-[#f59e0b] hover:bg-[#fbbf24]">
                <Link href="/admin/bookings">Gestionar Reservas</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/guides">Aprobar Guías</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/ambassadors">Gestionar Embajadores</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/testimonials">Revisar Testimonios</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/blog">Crear Post</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Ver Sitio Web</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

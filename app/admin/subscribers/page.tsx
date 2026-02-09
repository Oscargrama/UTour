import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SubscribersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Suscriptores del Newsletter
          </h1>
          <p className="text-muted-foreground">Lista de todos los suscriptores al newsletter</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total: {subscribers?.length || 0} suscriptores</CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers && subscribers.length > 0 ? (
              <div className="space-y-2">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{subscriber.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Suscrito: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={subscriber.active ? "default" : "secondary"}>
                      {subscriber.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay suscriptores aún</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import GuideHeader from "@/components/guide-header"
import GuideBookings from "@/components/guide-bookings"
import GuideTourSelection from "@/components/guide-tour-selection"

export default async function GuideDashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server component, cannot set cookies
          }
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user and guide data
  const { data: userData } = await supabase.from("users").select("*").eq("email", session.user.email).single()

  if (!userData || userData.role !== "guide") {
    redirect("/login")
  }

  const { data: guideData } = await supabase.from("guides").select("*").eq("user_id", userData.id).single()

  if (!guideData) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideHeader guideName={userData.full_name} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {guideData.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Tu cuenta está en revisión. Te notificaremos cuando sea aprobada por el administrador.
            </p>
          </div>
        )}

        {guideData.status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Tu solicitud fue rechazada. Contacta al administrador para más información.</p>
          </div>
        )}

        {guideData.status === "approved" && (
          <>
            <GuideTourSelection
              guideId={guideData.id}
              currentTours={guideData.available_tours || []}
              hasVehicle={guideData.has_vehicle}
            />
            <GuideBookings guideId={guideData.id} />
          </>
        )}
      </div>
    </div>
  )
}

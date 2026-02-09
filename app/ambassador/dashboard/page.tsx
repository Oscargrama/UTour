import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import AmbassadorHeader from "@/components/ambassador-header"
import AmbassadorStats from "@/components/ambassador-stats"
import AmbassadorBookings from "@/components/ambassador-bookings"
import AmbassadorReferralCode from "@/components/ambassador-referral-code"

export default async function AmbassadorDashboardPage() {
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

  // Get user and ambassador data
  const { data: userData } = await supabase.from("users").select("*").eq("email", session.user.email).single()

  if (!userData || userData.role !== "ambassador") {
    redirect("/login")
  }

  const { data: ambassadorData } = await supabase.from("ambassadors").select("*").eq("user_id", userData.id).single()

  if (!ambassadorData) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AmbassadorHeader ambassadorName={userData.full_name} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AmbassadorReferralCode username={ambassadorData.username} referralCode={ambassadorData.referral_code} />

        <AmbassadorStats ambassadorId={ambassadorData.id} totalEarnings={ambassadorData.total_earnings} />

        <AmbassadorBookings ambassadorId={ambassadorData.id} />
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AmbassadorHeader from "@/components/ambassador-header"
import AmbassadorBookingForm from "@/components/ambassador-booking-form"

export default async function AmbassadorBookPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
  const { data: ambassadorData } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  if (!userData || userData.role !== "ambassador" || !ambassadorData) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AmbassadorHeader ambassadorName={userData.full_name} />

      <div className="max-w-3xl mx-auto p-6">
        <AmbassadorBookingForm ambassadorId={ambassadorData.id} />
      </div>
    </div>
  )
}

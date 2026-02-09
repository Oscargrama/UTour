import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin-header"
import AmbassadorManagement from "@/components/ambassador-management"

export default async function AdminAmbassadorsPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto p-6">
        <AmbassadorManagement />
      </div>
    </div>
  )
}

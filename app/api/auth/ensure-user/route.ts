import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export async function POST() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ ensured: false, reason: "Not authenticated" }, { status: 401 })
    }

    const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
    const service = createServiceClient(supabaseUrl, serviceRoleKey)

    const { data: existingUser } = await service.from("users").select("id, role").eq("id", user.id).maybeSingle()

    const fullName = (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "Usuario"

    if (existingUser) {
      const { error: updateError } = await service
        .from("users")
        .update({
          email: user.email,
          full_name: fullName,
        })
        .eq("id", user.id)

      if (updateError) {
        return NextResponse.json({ ensured: false, error: updateError.message }, { status: 500 })
      }
    } else {
      const { error: insertError } = await service.from("users").insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: "user",
      })

      if (insertError) {
        return NextResponse.json({ ensured: false, error: insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ensured: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ensured: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

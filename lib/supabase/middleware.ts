import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Middleware executing for:", request.nextUrl.pathname)
  console.log("[v0] SUPABASE_URL available:", !!supabaseUrl)
  console.log("[v0] SUPABASE_ANON_KEY available:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase env vars not available in middleware, allowing request")
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User authenticated in middleware:", !!user)
    if (user) {
      console.log("[v0] User email:", user.email)
    }

    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/guide") ||
      request.nextUrl.pathname.startsWith("/ambassador")

    console.log("[v0] Is protected route:", isProtectedRoute)

    if (isProtectedRoute && !user) {
      console.log("[v0] Redirecting unauthenticated user to login")
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.log("[v0] Auth check error in middleware:", error)
  }

  return supabaseResponse
}

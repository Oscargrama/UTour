import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

type BookingPayload = {
  name: string
  email: string
  phone: string
  tour_type: string
  date: string
  number_of_people: number
  language?: "spanish" | "english"
  has_minors?: boolean
  message?: string
  ambassador_id?: string | null
  referral_code?: string | null
  booking_mode?: "full_group" | "join_group"
}

type CreatePreferenceBody = {
  bookingData: BookingPayload
  total_price: number
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  if (error && typeof error === "object") {
    try {
      const record = error as Record<string, unknown>
      if (typeof record.message === "string" && record.message) return record.message
      if (typeof record.error === "string" && record.error) return record.error
      if (record.cause && typeof record.cause === "object") {
        const cause = record.cause as Record<string, unknown>
        if (typeof cause.message === "string" && cause.message) return cause.message
      }
      return JSON.stringify(record)
    } catch {
      return "Unserializable error object"
    }
  }
  return "Unknown error"
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function normalizeBaseUrl(candidate: string | undefined | null) {
  if (!candidate) return null
  try {
    const url = new URL(candidate)
    if (!["http:", "https:"].includes(url.protocol)) return null
    return `${url.origin}${url.pathname}`.replace(/\/+$/, "")
  } catch {
    return null
  }
}

function isLocalhostUrl(url: string) {
  try {
    const host = new URL(url).hostname
    return host === "localhost" || host === "127.0.0.1"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { bookingData, total_price }: CreatePreferenceBody = await request.json()

    if (!bookingData || typeof total_price !== "number" || total_price <= 0) {
      return NextResponse.json(
        { error: "Invalid payload. Expected bookingData and a positive total_price." },
        { status: 400 },
      )
    }

    const requiredFields: (keyof BookingPayload)[] = [
      "name",
      "email",
      "phone",
      "tour_type",
      "date",
      "number_of_people",
    ]
    const missingFields = requiredFields.filter((field) => {
      const value = bookingData[field]
      return value === undefined || value === null || value === ""
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required booking fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    const supabaseAnonKey = getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
    const mpAccessToken = getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")

    const requestOrigin = new URL(request.url).origin
    const envAppUrl = normalizeBaseUrl(process.env.APP_URL) || normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL)
    const requestBaseUrl = normalizeBaseUrl(requestOrigin)
    const appUrl = envAppUrl && !isLocalhostUrl(envAppUrl) ? envAppUrl : requestBaseUrl
    if (!appUrl) throw new Error("Unable to determine a valid APP_URL for Mercado Pago back_urls")
    const notificationUrl = process.env.MERCADO_PAGO_WEBHOOK_URL || `${appUrl}/api/payments/webhook`

    const cookieStore = await cookies()
    const userClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op in this route handler; we only need to read session cookies.
        },
      },
    })
    const {
      data: { user },
    } = await userClient.auth.getUser()

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Ensure users row exists before writing bookings.user_id (FK -> users.id).
    if (user?.id) {
      const fullName = (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "Usuario"
      const { error: ensureUserError } = await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          role: "user",
        },
        { onConflict: "id" },
      )
      if (ensureUserError) {
        console.warn("[payments/create-preference] Could not upsert users row, continuing without hard failure:", ensureUserError.message)
      }
    }

    const bookingInsertBase = {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      tour_type: bookingData.tour_type,
      date: bookingData.date,
      number_of_people: bookingData.number_of_people,
      language: bookingData.language ?? "spanish",
      has_minors: bookingData.has_minors ?? false,
      message: bookingData.message ?? null,
      ambassador_id: bookingData.ambassador_id ?? null,
      referral_code: bookingData.referral_code ?? null,
      booking_mode: bookingData.booking_mode ?? "full_group",
      total_price,
      status: "pending",
      payment_status: "pending",
    }

    let { data: createdBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        ...bookingInsertBase,
        user_id: user?.id ?? null,
      })
      .select("id")
      .single()

    const isMissingUserIdColumn =
      bookingError &&
      (bookingError.code === "PGRST204" || bookingError.message.includes("user_id column of 'bookings'"))

    if (isMissingUserIdColumn) {
      console.warn("[payments/create-preference] bookings.user_id missing, retrying without user_id")
      const retry = await supabase.from("bookings").insert(bookingInsertBase).select("id").single()
      createdBooking = retry.data
      bookingError = retry.error
    }

    const isUserIdFkViolation = bookingError?.code === "23503" && bookingError?.message?.includes("bookings_user_id_fkey")
    if (isUserIdFkViolation) {
      console.warn("[payments/create-preference] bookings.user_id FK failed, retrying with user_id=null")
      const retryWithoutUser = await supabase
        .from("bookings")
        .insert({ ...bookingInsertBase, user_id: null })
        .select("id")
        .single()
      createdBooking = retryWithoutUser.data
      bookingError = retryWithoutUser.error
    }

    if (bookingError || !createdBooking) {
      return NextResponse.json(
        {
          error: "Failed to create booking",
          details: bookingError?.message ?? "Unknown booking creation error",
        },
        { status: 500 },
      )
    }

    const mpClient = new MercadoPagoConfig({ accessToken: mpAccessToken })
    const preferenceClient = new Preference(mpClient)

    const preferenceBody: Record<string, unknown> = {
      items: [
        {
          id: createdBooking.id,
          title: `Reserva UTour - ${bookingData.tour_type}`,
          quantity: 1,
          unit_price: Number(total_price),
          currency_id: "COP",
        },
      ],
      external_reference: createdBooking.id,
      payer: {
        name: bookingData.name,
        email: bookingData.email,
      },
      metadata: {
        booking_id: createdBooking.id,
      },
    }

    // Keep all payment methods by default. Enable this only for specific tests.
    if (process.env.MERCADO_PAGO_EXCLUDE_ACCOUNT_MONEY === "true") {
      preferenceBody.payment_methods = {
        excluded_payment_types: [{ id: "account_money" }],
      }
    }

    preferenceBody.back_urls = {
      success: `${appUrl}/checkout/result?status=approved&booking_id=${createdBooking.id}`,
      pending: `${appUrl}/checkout/result?status=pending&booking_id=${createdBooking.id}`,
      failure: `${appUrl}/checkout/result?status=rejected&booking_id=${createdBooking.id}`,
    }
    preferenceBody.auto_return = "approved"

    preferenceBody.notification_url = notificationUrl

    const preference = await preferenceClient.create({ body: preferenceBody })

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ preference_id: preference.id })
      .eq("id", createdBooking.id)

    if (updateError) {
      return NextResponse.json(
        {
          error: "Preference created but failed to save preference_id in booking",
          booking_id: createdBooking.id,
          preference_id: preference.id,
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    const shouldUseSandbox = process.env.MERCADO_PAGO_USE_SANDBOX === "true"
    const checkoutUrl =
      shouldUseSandbox && preference.sandbox_init_point ? preference.sandbox_init_point : preference.init_point

    return NextResponse.json({
      booking_id: createdBooking.id,
      preference_id: preference.id,
      checkout_url: checkoutUrl,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error) {
    const details = getErrorDetails(error)
    console.error("[payments/create-preference] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create Mercado Pago preference",
        details,
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@supabase/supabase-js"

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
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
    const mpAccessToken = getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
    const notificationUrl =
      process.env.MERCADO_PAGO_WEBHOOK_URL || (appUrl ? `${appUrl}/api/payments/webhook` : undefined)

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: createdBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
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
      })
      .select("id")
      .single()

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
          title: `Reserva YouTour - ${bookingData.tour_type}`,
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

    if (appUrl) {
      preferenceBody.back_urls = {
        success: `${appUrl}/book?payment=success&booking_id=${createdBooking.id}`,
        pending: `${appUrl}/book?payment=pending&booking_id=${createdBooking.id}`,
        failure: `${appUrl}/book?payment=failure&booking_id=${createdBooking.id}`,
      }
      preferenceBody.auto_return = "approved"
    }

    if (notificationUrl) {
      preferenceBody.notification_url = notificationUrl
    }

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

    return NextResponse.json({
      booking_id: createdBooking.id,
      preference_id: preference.id,
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

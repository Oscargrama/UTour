import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { createClient } from "@supabase/supabase-js"
import { createHmac, timingSafeEqual } from "node:crypto"

type MercadoPagoWebhookPayload = {
  action?: string
  api_version?: string
  data?: {
    id?: string
  }
  date_created?: string
  id?: number
  live_mode?: boolean
  type?: string
  user_id?: string | number
}

type SignatureParts = {
  ts: string
  v1: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function parseSignatureHeader(signatureHeader: string | null): SignatureParts | null {
  if (!signatureHeader) return null

  const parts = signatureHeader
    .split(",")
    .map((part) => part.trim())
    .reduce<Record<string, string>>((acc, part) => {
      const [key, value] = part.split("=")
      if (key && value) acc[key] = value
      return acc
    }, {})

  if (!parts.ts || !parts.v1) return null
  return { ts: parts.ts, v1: parts.v1 }
}

function safeCompareHex(a: string, b: string) {
  try {
    const aBuffer = Buffer.from(a, "hex")
    const bBuffer = Buffer.from(b, "hex")
    if (aBuffer.length !== bBuffer.length) return false
    return timingSafeEqual(aBuffer, bBuffer)
  } catch {
    return false
  }
}

function isValidMercadoPagoSignature(params: {
  signatureHeader: string | null
  dataId: string
  secret: string
}) {
  const parsed = parseSignatureHeader(params.signatureHeader)
  if (!parsed || !params.dataId) return false

  const manifest = `id:${params.dataId};ts:${parsed.ts};`
  const expected = createHmac("sha256", params.secret).update(manifest).digest("hex")

  return safeCompareHex(expected, parsed.v1)
}

function mapPaymentStatusToBookingStatus(paymentStatus: string) {
  if (paymentStatus === "approved") return "confirmed"
  if (paymentStatus === "rejected") return "cancelled"
  return "pending"
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MercadoPagoWebhookPayload
    const url = new URL(request.url)
    const queryType = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? ""
    const queryPaymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? ""

    const eventType = payload.type ?? queryType
    const paymentId = payload.data?.id ?? queryPaymentId

    const webhookSecret = getRequiredEnv("MERCADO_PAGO_WEBHOOK_SECRET")
    const signatureHeader = request.headers.get("x-signature")
    const dataId = url.searchParams.get("data.id") ?? paymentId

    const validSignature = isValidMercadoPagoSignature({
      signatureHeader,
      dataId,
      secret: webhookSecret,
    })

    if (!validSignature) {
      return NextResponse.json(
        {
          received: false,
          error: "Invalid Mercado Pago signature",
        },
        { status: 401 },
      )
    }

    if (eventType !== "payment" || !paymentId) {
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "Unsupported notification type or missing payment id",
        },
        { status: 200 },
      )
    }

    const mpAccessToken = getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")
    const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")

    const mpClient = new MercadoPagoConfig({ accessToken: mpAccessToken })
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })

    const paymentStatus = payment.status ?? "pending"
    const preferenceId =
      payment.preference_id ??
      (typeof payment.metadata?.preference_id === "string" ? payment.metadata.preference_id : null)

    if (!preferenceId) {
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "Payment has no preference_id",
          payment_id: paymentId,
        },
        { status: 200 },
      )
    }

    const bookingStatus = mapPaymentStatusToBookingStatus(paymentStatus)
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, mp_payment_id")
      .eq("preference_id", preferenceId)
      .maybeSingle()

    if (bookingError) {
      return NextResponse.json(
        {
          received: true,
          updated: false,
          reason: "Failed to load booking",
          details: bookingError.message,
          preference_id: preferenceId,
        },
        { status: 200 },
      )
    }

    if (!booking) {
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "No booking found for preference_id",
          preference_id: preferenceId,
        },
        { status: 200 },
      )
    }

    if (booking.mp_payment_id === paymentId) {
      return NextResponse.json(
        {
          received: true,
          duplicate: true,
          updated: false,
          payment_id: paymentId,
          preference_id: preferenceId,
        },
        { status: 200 },
      )
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: bookingStatus,
        mp_payment_id: paymentId,
      })
      .eq("id", booking.id)

    if (updateError) {
      return NextResponse.json(
        {
          received: true,
          updated: false,
          reason: "Failed to update booking",
          details: updateError.message,
          preference_id: preferenceId,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        received: true,
        updated: true,
        payment_id: paymentId,
        preference_id: preferenceId,
        payment_status: paymentStatus,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        received: true,
        updated: false,
        reason: "Webhook processing error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    )
  }
}

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

function buildSignatureCandidates(params: { dataId: string; ts: string; requestIdHeader: string | null }) {
  const base = `id:${params.dataId};ts:${params.ts};`
  if (!params.requestIdHeader) return [base]
  return [base, `id:${params.dataId};request-id:${params.requestIdHeader};ts:${params.ts};`]
}

function uniqueNonEmpty(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => !!value && value.trim().length > 0))]
}

function isValidMercadoPagoSignature(params: {
  signatureHeader: string | null
  requestIdHeader: string | null
  dataIdCandidates: string[]
  secret: string
}) {
  const parsed = parseSignatureHeader(params.signatureHeader)
  if (!parsed || params.dataIdCandidates.length === 0) return false

  return params.dataIdCandidates.some((dataId) => {
    const manifests = buildSignatureCandidates({
      dataId,
      ts: parsed.ts,
      requestIdHeader: params.requestIdHeader,
    })
    return manifests.some((manifest) => {
      const expected = createHmac("sha256", params.secret).update(manifest).digest("hex")
      return safeCompareHex(expected, parsed.v1)
    })
  })
}

function mapPaymentStatusToBookingStatus(paymentStatus: string) {
  if (paymentStatus === "approved") return "confirmed"
  if (paymentStatus === "rejected") return "cancelled"
  return "pending"
}

export async function POST(request: Request) {
  try {
    const strictSignature = process.env.MERCADO_PAGO_STRICT_SIGNATURE !== "false"
    const payload = (await request.json()) as MercadoPagoWebhookPayload
    const url = new URL(request.url)
    const queryType = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? ""
    const queryDataId = url.searchParams.get("data.id")
    const queryId = url.searchParams.get("id")
    const bodyPaymentId = payload.data?.id ?? ""

    const eventType = payload.type ?? queryType
    const paymentId = queryDataId || queryId || bodyPaymentId
    const dataIdCandidates = uniqueNonEmpty([queryDataId, queryId, bodyPaymentId])

    if (eventType !== "payment") {
      console.log("[payments/webhook] Ignored event type", { eventType })
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "Unsupported notification type",
        },
        { status: 200 },
      )
    }

    if (!paymentId) {
      console.log("[payments/webhook] Missing payment id", { query: url.search, payload })
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "Missing payment id",
        },
        { status: 200 },
      )
    }

    const webhookSecret = getRequiredEnv("MERCADO_PAGO_WEBHOOK_SECRET")
    const signatureHeader = request.headers.get("x-signature")
    const requestIdHeader = request.headers.get("x-request-id")

    const validSignature = isValidMercadoPagoSignature({
      signatureHeader,
      requestIdHeader,
      dataIdCandidates,
      secret: webhookSecret,
    })

    if (!validSignature) {
      const parsedSignature = parseSignatureHeader(signatureHeader)
      const manifests = parsedSignature
        ? dataIdCandidates.flatMap((dataId) =>
            buildSignatureCandidates({
              dataId,
              ts: parsedSignature.ts,
              requestIdHeader,
            }),
          )
        : []
      const expectedHashes = manifests.map((manifest) =>
        createHmac("sha256", webhookSecret).update(manifest).digest("hex").slice(0, 12),
      )
      console.log("[payments/webhook] Invalid signature", {
        strict_signature: strictSignature,
        signature_present: !!signatureHeader,
        signature_prefix: parsedSignature?.v1?.slice(0, 12) ?? null,
        request_id: requestIdHeader,
        event_type: eventType,
        payment_id: paymentId,
        data_id_candidates: dataIdCandidates,
        manifest_candidates: manifests,
        expected_hash_prefixes: expectedHashes,
      })
      if (!strictSignature) {
        console.log("[payments/webhook] Proceeding despite invalid signature (strict mode disabled)")
      } else {
        return NextResponse.json(
          {
            received: false,
            error: "Invalid Mercado Pago signature",
          },
          { status: 401 },
        )
      }
    }

    const mpAccessToken = getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")
    const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")

    const mpClient = new MercadoPagoConfig({ accessToken: mpAccessToken })
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: paymentId })
    console.log("[payments/webhook] Payment fetched", {
      payment_id: paymentId,
      payment_status: payment.status,
      preference_id: payment.preference_id,
    })

    const paymentStatus = payment.status ?? "pending"
    const preferenceId =
      payment.preference_id ??
      (typeof payment.metadata?.preference_id === "string" ? payment.metadata.preference_id : null)

    if (!preferenceId) {
      console.log("[payments/webhook] Payment without preference_id", {
        payment_id: paymentId,
        payment_status: paymentStatus,
      })
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
      console.error("[payments/webhook] Failed to load booking", {
        preference_id: preferenceId,
        error: bookingError.message,
      })
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
      console.log("[payments/webhook] No booking for preference_id", { preference_id: preferenceId, payment_id: paymentId })
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
      console.log("[payments/webhook] Duplicate payment event", {
        booking_id: booking.id,
        payment_id: paymentId,
      })
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
      console.error("[payments/webhook] Failed to update booking", {
        booking_id: booking.id,
        preference_id: preferenceId,
        payment_id: paymentId,
        error: updateError.message,
      })
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

    console.log("[payments/webhook] Booking updated", {
      booking_id: booking.id,
      payment_id: paymentId,
      payment_status: paymentStatus,
      booking_status: bookingStatus,
      preference_id: preferenceId,
    })
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
    console.error("[payments/webhook] Processing error", error)
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

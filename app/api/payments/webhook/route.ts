import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { createClient } from "@supabase/supabase-js"
import { createHmac, timingSafeEqual } from "node:crypto"
import { Resend } from "resend"

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

function formatTourName(tourType: string) {
  return tourType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

async function sendBookingStatusEmail(params: {
  to: string
  name: string
  bookingReference: string | null
  tourType: string
  date: string
  numberOfPeople: number
  totalPrice: number | null
  paymentStatus: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  const replyTo = process.env.RESEND_REPLY_TO || "d.oinfante@gmail.com"
  if (!apiKey) {
    console.warn("[payments/webhook] RESEND_API_KEY missing; skipping email send")
    return
  }
  if (!from) {
    console.warn("[payments/webhook] RESEND_FROM missing; skipping email send")
    return
  }

  const resend = new Resend(apiKey)

  const humanTour = formatTourName(params.tourType)
  const humanDate = new Date(`${params.date}T00:00:00`).toLocaleDateString("es-CO")
  const totalText = params.totalPrice !== null ? `$${Number(params.totalPrice).toLocaleString("es-CO")} COP` : null
  const supportUrl =
    "https://api.whatsapp.com/send/?phone=573146726226&text=Hola%20UTour,%20necesito%20ayuda%20con%20mi%20reserva"

  let subject = "Estado de tu reserva en UTour"
  let heading = "Actualizamos tu reserva"
  let body =
    "Recibimos una actualización de tu pago. Revisa los detalles y cualquier novedad te la confirmamos por este medio."

  if (params.paymentStatus === "approved") {
    subject = "Pago confirmado - UTour"
    heading = "Tu pago fue confirmado"
    body = "Tu reserva quedó confirmada y ya está en gestión operativa."
  } else if (params.paymentStatus === "rejected") {
    subject = "Pago no completado - UTour"
    heading = "No se pudo confirmar tu pago"
    body = "Tu reserva no se confirmó porque el pago fue rechazado. Si quieres, te ayudamos a intentarlo de nuevo."
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#1f2937;">
      <h2 style="margin:0 0 12px 0;color:#1f3684;">${heading}</h2>
      <p style="margin:0 0 18px 0;color:#42527f;">Hola ${params.name}, ${body}</p>
      <div style="border:1px solid #dbe6ff;border-radius:14px;padding:16px;background:#f8fbff;">
        <p style="margin:0 0 8px 0;"><strong>Referencia:</strong> ${params.bookingReference || "-"}</p>
        <p style="margin:0 0 8px 0;"><strong>Tour:</strong> ${humanTour}</p>
        <p style="margin:0 0 8px 0;"><strong>Fecha:</strong> ${humanDate}</p>
        <p style="margin:0 0 8px 0;"><strong>Personas:</strong> ${params.numberOfPeople}</p>
        ${totalText ? `<p style="margin:0 0 8px 0;"><strong>Total:</strong> ${totalText}</p>` : ""}
        <p style="margin:0;"><strong>Pago:</strong> ${params.paymentStatus}</p>
      </div>
      <p style="margin:16px 0 0 0;">
        <a href="${supportUrl}" style="color:#1f85d4;text-decoration:none;">Contactar soporte por WhatsApp</a>
      </p>
    </div>
  `

  await resend.emails.send({
    from,
    to: [params.to],
    replyTo,
    subject,
    html,
    text: `${heading}\n\nReferencia: ${params.bookingReference || "-"}\nTour: ${humanTour}\nFecha: ${humanDate}\nPago: ${params.paymentStatus}`,
  })

  console.log("[payments/webhook] Booking status email sent", {
    to: params.to,
    payment_status: params.paymentStatus,
    booking_reference: params.bookingReference,
  })
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
      console.warn("[payments/webhook] Invalid signature", {
        strict_signature: strictSignature,
        signature_prefix: parsedSignature?.v1?.slice(0, 12) ?? null,
        event_type: eventType,
        payment_id: paymentId,
      })
      if (strictSignature) {
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

    const paymentStatus = payment.status ?? "pending"
    const preferenceId =
      payment.preference_id ??
      (typeof payment.metadata?.preference_id === "string" ? payment.metadata.preference_id : null)
    const bookingIdFallback =
      (typeof payment.external_reference === "string" ? payment.external_reference : null) ??
      (typeof payment.metadata?.booking_id === "string" ? payment.metadata.booking_id : null)

    if (!preferenceId && !bookingIdFallback) {
      console.warn("[payments/webhook] Payment missing reference data", {
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
    const bookingQuery = supabase
      .from("bookings")
      .select(
        "id, mp_payment_id, payment_status, preference_id, booking_reference, name, email, tour_type, date, number_of_people, total_price",
      )
    const { data: booking, error: bookingError } = preferenceId
      ? await bookingQuery.eq("preference_id", preferenceId).maybeSingle()
      : await bookingQuery.eq("id", bookingIdFallback!).maybeSingle()

    if (bookingError) {
      console.error("[payments/webhook] Failed to load booking", {
        preference_id: preferenceId,
        booking_id_fallback: bookingIdFallback,
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
      console.warn("[payments/webhook] No booking match", {
        preference_id: preferenceId,
        booking_id_fallback: bookingIdFallback,
        payment_id: paymentId,
      })
      return NextResponse.json(
        {
          received: true,
          ignored: true,
          reason: "No booking found for payment reference",
          preference_id: preferenceId,
          booking_id_fallback: bookingIdFallback,
        },
        { status: 200 },
      )
    }

    if (booking.mp_payment_id === paymentId && booking.payment_status === paymentStatus) {
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

    const updatePayload: Record<string, unknown> = {
      payment_status: paymentStatus,
      status: bookingStatus,
      mp_payment_id: paymentId,
    }
    if (preferenceId && !booking.preference_id) {
      updatePayload.preference_id = preferenceId
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update(updatePayload)
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

    // Non-blocking customer email notification.
    try {
      await sendBookingStatusEmail({
        to: booking.email,
        name: booking.name,
        bookingReference: booking.booking_reference,
        tourType: booking.tour_type,
        date: booking.date,
        numberOfPeople: booking.number_of_people,
        totalPrice: booking.total_price,
        paymentStatus,
      })
    } catch (emailError) {
      console.error("[payments/webhook] Failed to send booking status email", emailError)
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

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

type ResultStatus = "approved" | "pending" | "rejected"

type BookingRecord = {
  id: string
  booking_reference: string | null
  tour_type: string
  date: string
  number_of_people: number
  total_price: number | null
  payment_status: string | null
  status: string | null
}

function normalizeStatus(raw: string | null): ResultStatus {
  if (raw === "approved") return "approved"
  if (raw === "rejected" || raw === "failure") return "rejected"
  return "pending"
}

function getTitle(status: ResultStatus) {
  if (status === "approved") return "Pago confirmado"
  if (status === "rejected") return "Pago no completado"
  return "Pago en revisión"
}

function getDescription(status: ResultStatus) {
  if (status === "approved") return "Tu reserva quedó confirmada. Ya puedes revisar los detalles abajo."
  if (status === "rejected") return "No pudimos confirmar el pago. Puedes intentarlo nuevamente."
  return "Estamos validando tu pago. Te recomendamos revisar esta página en unos segundos."
}

async function getBookingById(bookingId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return null

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { data } = await supabase
    .from("bookings")
    .select("id, booking_reference, tour_type, date, number_of_people, total_price, payment_status, status")
    .eq("id", bookingId)
    .maybeSingle()

  return data as BookingRecord | null
}

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const bookingId = typeof params.booking_id === "string" ? params.booking_id : ""
  const incomingStatus = typeof params.status === "string" ? params.status : null

  const booking = bookingId ? await getBookingById(bookingId) : null
  const status = normalizeStatus((booking?.payment_status ?? incomingStatus) || "pending")

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#fefce8]">
      <Header />
      <main className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#1f2937]" style={{ fontFamily: "var(--font-heading)" }}>
              {getTitle(status)}
            </h1>
            <p className="mt-3 text-muted-foreground">{getDescription(status)}</p>

            {booking ? (
              <div className="mt-8 rounded-xl border bg-[#fff9eb] p-5 text-sm text-[#1f2937]">
                <p>
                  <strong>Referencia:</strong> {booking.booking_reference || booking.id}
                </p>
                <p>
                  <strong>Tour:</strong> {booking.tour_type}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(booking.date).toLocaleDateString("es-CO")}
                </p>
                <p>
                  <strong>Personas:</strong> {booking.number_of_people}
                </p>
                {booking.total_price !== null && (
                  <p>
                    <strong>Total:</strong> ${Number(booking.total_price).toLocaleString("es-CO")} COP
                  </p>
                )}
                <p>
                  <strong>Pago:</strong> {booking.payment_status || "pending"}
                </p>
                <p>
                  <strong>Reserva:</strong> {booking.status || "pending"}
                </p>
              </div>
            ) : (
              <p className="mt-8 rounded-xl border bg-[#fff9eb] p-5 text-sm text-[#1f2937]">
                No encontramos la reserva asociada. Si acabas de pagar, espera unos segundos y recarga.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="rounded-lg bg-[#f59e0b] px-5 py-2.5 text-sm font-semibold text-white">
                Volver a reservas
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=573146726226&text=Hola%20UTour,%20necesito%20ayuda%20con%20mi%20reserva"
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold"
                target="_blank"
              >
                Contactar soporte
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  )
}

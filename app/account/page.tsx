import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CalendarDays,
  CircleDollarSign,
  Compass,
  Headset,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Ticket,
  UserRound,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

type Booking = {
  id: string
  tour_type: string
  date: string
  number_of_people: number
  total_price: number | null
  payment_status: string | null
  status: string | null
  booking_reference: string | null
  created_at: string
}

function paymentBadge(status: string | null) {
  if (status === "approved") return "bg-[#e9fbff] text-[#0b7f96] border-[#b9ecf6]"
  if (status === "rejected") return "bg-[#ffeef1] text-[#b42341] border-[#ffc8d3]"
  return "bg-[#f5f8ff] text-[#1f3684] border-[#d5e1ff]"
}

function bookingBadge(status: string | null) {
  if (status === "confirmed") return "bg-[#eefaf2] text-[#0f8a45] border-[#c9efd8]"
  if (status === "cancelled") return "bg-[#fff1f2] text-[#be123c] border-[#fecdd3]"
  return "bg-[#f5f8ff] text-[#1f3684] border-[#d5e1ff]"
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: bookingsByUserId } = await supabase
    .from("bookings")
    .select("id, tour_type, date, number_of_people, total_price, payment_status, status, booking_reference, created_at, user_id, email")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const bookings =
    bookingsByUserId && bookingsByUserId.length > 0
      ? bookingsByUserId
      : (
          await supabase
            .from("bookings")
            .select(
              "id, tour_type, date, number_of_people, total_price, payment_status, status, booking_reference, created_at, user_id, email",
            )
            .eq("email", user.email || "")
            .order("created_at", { ascending: false })
            .limit(20)
        ).data

  const normalizedBookings = (bookings || []) as Booking[]
  const displayName = (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "viajero"

  const nextBooking = normalizedBookings
    .filter((booking) => new Date(`${booking.date}T00:00:00`) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  const pendingPayments = normalizedBookings.filter((booking) => booking.payment_status !== "approved").length
  const confirmedTrips = normalizedBookings.filter((booking) => booking.status === "confirmed").length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#eef3ff]">
      <Header />
      <main className="py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-[28px] border border-[#dbe5ff] bg-white/80 p-4 shadow-[0_35px_80px_-40px_rgba(31,54,132,0.45)] md:p-6">
            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
              <aside className="rounded-3xl border border-[#dfe6ff] bg-[#f8fbff] p-4">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A2CE8] via-[#555BDF] to-[#38CBE1] text-white">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Cuenta UTour</p>
                    <p className="font-bold text-[#1f3684]">{displayName}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <div className="inline-flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#1f3684] shadow-sm">
                    <LayoutDashboard className="h-4 w-4 text-[#1f85d4]" />
                    Resumen
                  </div>
                  <div className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#42527f]">
                    <Ticket className="h-4 w-4 text-[#1f85d4]" />
                    Mis reservas
                  </div>
                  <div className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#42527f]">
                    <CircleDollarSign className="h-4 w-4 text-[#1f85d4]" />
                    Pagos
                  </div>
                  <div className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#42527f]">
                    <Heart className="h-4 w-4 text-[#1f85d4]" />
                    Favoritos
                  </div>
                  <div className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#42527f]">
                    <Headset className="h-4 w-4 text-[#1f85d4]" />
                    Soporte
                  </div>
                </nav>

                <div className="mt-6 rounded-2xl border border-[#d9e6ff] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Asistencia</p>
                  <p className="mt-1 text-sm text-[#42527f]">¿Necesitas ayuda con tu reserva?</p>
                  <a
                    href="https://api.whatsapp.com/send/?phone=573146726226&text=Hola%20UTour,%20necesito%20ayuda%20con%20mi%20reserva"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#c9d8ff] px-3 py-1.5 text-xs font-semibold text-[#1f3684]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#1f85d4]" />
                    Soporte WhatsApp
                  </a>
                </div>

                <Link
                  href="/auth/signout"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d8e2ff] bg-white px-3 py-2 text-sm font-semibold text-[#42527f]"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Link>
              </aside>

              <section className="space-y-5">
                <div className="rounded-3xl border border-[#dfe6ff] bg-white p-5">
                  <p className="text-sm font-semibold text-[#6a79a8]">Hola, {displayName}</p>
                  <h1 className="mt-1 text-3xl font-bold text-[#1f3684]" style={{ fontFamily: "var(--font-heading)" }}>
                    Bienvenido de nuevo
                  </h1>
                  <p className="mt-2 text-sm text-[#42527f]">Gestiona tus experiencias, pagos y próximas aventuras desde un solo lugar.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-3xl border border-[#dfe6ff] bg-gradient-to-br from-[#eff3ff] to-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Próxima experiencia</p>
                    {nextBooking ? (
                      <>
                        <h2 className="mt-2 text-xl font-bold text-[#1f3684]">{nextBooking.tour_type}</h2>
                        <p className="mt-1 text-sm text-[#42527f]">
                          {new Date(`${nextBooking.date}T00:00:00`).toLocaleDateString("es-CO")} · {nextBooking.number_of_people} personas
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentBadge(nextBooking.payment_status)}`}>
                            Pago: {nextBooking.payment_status || "pending"}
                          </span>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${bookingBadge(nextBooking.status)}`}>
                            Estado: {nextBooking.status || "pending"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-[#42527f]">No tienes experiencias futuras programadas.</p>
                    )}
                  </article>

                  <article className="rounded-3xl border border-[#dfe6ff] bg-gradient-to-br from-[#f4edff] to-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Resumen rápido</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs text-[#6a79a8]">Reservas</p>
                        <p className="text-2xl font-bold text-[#1f3684]">{normalizedBookings.length}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs text-[#6a79a8]">Confirmadas</p>
                        <p className="text-2xl font-bold text-[#1f3684]">{confirmedTrips}</p>
                      </div>
                      <div className="col-span-2 rounded-2xl bg-white p-3">
                        <p className="text-xs text-[#6a79a8]">Pagos pendientes</p>
                        <p className="text-2xl font-bold text-[#1f3684]">{pendingPayments}</p>
                      </div>
                    </div>
                  </article>
                </div>

                <article className="rounded-3xl border border-[#dfe6ff] bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1f3684]">Mis reservas</h2>
                    <Link href="/book" className="brand-cta-btn rounded-full px-4 py-1.5 text-xs font-semibold text-white">
                      Nueva reserva
                    </Link>
                  </div>

                  {normalizedBookings.length === 0 ? (
                    <p className="text-sm text-[#42527f]">Aún no tienes reservas registradas.</p>
                  ) : (
                    <div className="space-y-3">
                      {normalizedBookings.slice(0, 6).map((booking) => (
                        <div key={booking.id} className="rounded-2xl border border-[#e3ebff] bg-[#fbfcff] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">
                                Ref: {booking.booking_reference || booking.id}
                              </p>
                              <p className="mt-1 text-base font-bold text-[#1f3684]">{booking.tour_type}</p>
                              <p className="mt-1 text-sm text-[#42527f]">
                                {new Date(`${booking.date}T00:00:00`).toLocaleDateString("es-CO")} · {booking.number_of_people} personas
                              </p>
                            </div>
                            <div className="text-right">
                              {booking.total_price !== null ? (
                                <p className="text-base font-bold text-[#1f3684]">${Number(booking.total_price).toLocaleString("es-CO")} COP</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentBadge(booking.payment_status)}`}>
                              Pago: {booking.payment_status || "pending"}
                            </span>
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${bookingBadge(booking.status)}`}>
                              Estado: {booking.status || "pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </section>

              <aside className="space-y-5">
                <article className="rounded-3xl border border-[#dfe6ff] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Agenda</p>
                  <h3 className="mt-1 text-lg font-bold text-[#1f3684]">Próximas fechas</h3>
                  <div className="mt-4 space-y-3">
                    {normalizedBookings.slice(0, 4).map((booking) => (
                      <div key={booking.id} className="rounded-2xl border border-[#e3ebff] bg-[#fbfcff] p-3">
                        <p className="text-xs font-semibold text-[#1f85d4]">
                          {new Date(`${booking.date}T00:00:00`).toLocaleDateString("es-CO")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#1f3684] line-clamp-2">{booking.tour_type}</p>
                      </div>
                    ))}
                    {normalizedBookings.length === 0 ? (
                      <p className="text-sm text-[#42527f]">Aún no tienes actividades en agenda.</p>
                    ) : null}
                  </div>
                </article>

                <article className="rounded-3xl border border-[#dfe6ff] bg-gradient-to-br from-[#1f3684] via-[#1f85d4] to-[#38cbe1] p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Explora más</p>
                  <h3 className="mt-1 text-xl font-bold">¿Listo para tu siguiente aventura?</h3>
                  <p className="mt-2 text-sm text-white/85">Descubre nuevas experiencias privadas y semiprivadas para tu próximo viaje.</p>
                  <Link
                    href="/#tours"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f3684]"
                  >
                    <Compass className="h-4 w-4" />
                    Ver experiencias
                  </Link>
                </article>

                <article className="rounded-3xl border border-[#dfe6ff] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6a79a8]">Recordatorio</p>
                  <p className="mt-2 text-sm text-[#42527f]">Te enviaremos confirmaciones y recordatorios automáticos antes de cada experiencia.</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#1f3684]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#1f85d4]" />
                    Operación activa
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

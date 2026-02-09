"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

type Booking = {
  id: string
  name: string
  email: string
  phone: string
  tour_type: string
  date: string
  number_of_people: number
  status: string
  booking_reference?: string
  language?: string
  has_minors?: boolean
  total_price?: number
}

export function BookingsCalendar({ bookings }: { bookings: Booking[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return bookings.filter((booking) => booking.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
    completed: "bg-blue-500",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Reservas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[180px] text-center font-semibold">
              {monthNames[month]} {year}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Header days */}
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold text-sm py-2 text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const date = new Date(year, month, day)
            const dayBookings = getBookingsForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <div
                key={day}
                className={`
                  aspect-square border rounded-lg p-2 relative overflow-hidden
                  ${isToday ? "border-[#f59e0b] bg-[#fef3c7]" : "border-gray-200"}
                  ${dayBookings.length > 0 ? "bg-green-50" : "bg-white"}
                `}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                {dayBookings.length > 0 && (
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className="text-xs p-1 rounded bg-white border border-gray-200 truncate"
                        title={`${booking.name} - ${booking.tour_type}`}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              statusColors[booking.status as keyof typeof statusColors]
                            }`}
                          />
                          <span className="truncate">{booking.name}</span>
                        </div>
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-center text-muted-foreground">+{dayBookings.length - 2} más</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Cancelada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Completada</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

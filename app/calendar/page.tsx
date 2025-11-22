"use client"
import { useEffect, useState } from "react"
import type React from "react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { it } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface Booking {
  id: string
  suite_name: string
  full_name: string
  email: string
  phone?: string
  check_in_date: string
  check_out_date: string
  num_guests: number
  arrangement: string
  message?: string
  created_at: string
}

const CALENDAR_PASSWORD = "orla2025"

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    // Check if already authenticated in session storage
    const auth = sessionStorage.getItem("calendar_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    try {
      const bookingsData = localStorage.getItem("bookings")
      if (bookingsData) {
        const parsed = JSON.parse(bookingsData)
        setBookings(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.log("[v0] Error parsing bookings from localStorage:", error)
      setBookings([])
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === CALENDAR_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("calendar_authenticated", "true")
      setPasswordError(false)
      setPasswordInput("")
    } else {
      setPasswordError(true)
    }
  }

  const generateGoogleCalendarLink = (booking: Booking) => {
    try {
      const checkIn = parseISO(booking.check_in_date)
      const checkOut = parseISO(booking.check_out_date)

      // Format dates for Google Calendar (YYYYMMDD format)
      const startDate = format(checkIn, "yyyyMMdd")
      const endDate = format(checkOut, "yyyyMMdd")

      // Create event text with details
      const eventText = `${booking.suite_name} - ${booking.full_name}`
      const eventDetails = `
Arrangiamento: ${booking.arrangement}
Ospiti: ${booking.num_guests}
Email: ${booking.email}
${booking.phone ? `Telefono: ${booking.phone}` : ""}
${booking.message ? `Note: ${booking.message}` : ""}
      `.trim()

      // Build Google Calendar URL
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: eventText,
        details: eventDetails,
        dates: `${startDate}/${endDate}`,
        ctz: "Europe/Rome",
      })

      return `https://calendar.google.com/calendar/render?${params.toString()}`
    } catch (error) {
      console.log("[v0] Error generating Google Calendar link:", error)
      return "#"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen beach-background flex items-center justify-center">
        <Header />
        <div className="max-w-md w-full mx-auto px-6 pt-20">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-center elysian-primary">Accesso Calendario</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <p className="text-white/80 text-sm text-center">
                  Inserisci la password per visualizzare le prenotazioni
                </p>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError(false)
                  }}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent"
                  autoFocus
                />
                {passwordError && <p className="text-red-500 text-sm">Password non corretta</p>}
                <button
                  type="submit"
                  className="w-full bg-elysian-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Accedi
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen beach-background flex items-center justify-center">
        <Header />
        <div className="text-center text-white text-xl pt-20">Caricamento...</div>
        <Footer />
      </div>
    )
  }

  // Get days in month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      try {
        const checkIn = parseISO(booking.check_in_date)
        const checkOut = parseISO(booking.check_out_date)
        return date >= checkIn && date < checkOut
      } catch (error) {
        console.log("[v0] Error filtering booking:", error)
        return false
      }
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="min-h-screen beach-background">
      <Header />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold elysian-secondary text-balance">Calendario Prenotazioni</h1>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                sessionStorage.removeItem("calendar_authenticated")
              }}
              className="px-4 py-2 bg-elysian-primary text-elysian-secondary rounded-lg hover:bg-opacity-90 transition-all"
            >
              Esci
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="glass-panel">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <button onClick={previousMonth} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <CardTitle className="text-2xl text-white">
                      {format(currentDate, "MMMM yyyy", { locale: it })}
                    </CardTitle>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
                      <div key={day} className="text-center text-white/60 text-sm font-semibold p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}

                    {/* Days of month */}
                    {daysInMonth.map((day) => {
                      const dayBookings = getBookingsForDate(day)
                      const isToday = isSameDay(day, new Date())

                      return (
                        <div
                          key={day.toISOString()}
                          className={`min-h-20 p-2 rounded-lg border-2 transition-all ${
                            isToday
                              ? "border-elysian-primary bg-elysian-primary/10"
                              : dayBookings.length > 0
                                ? "border-green-500 bg-green-500/10"
                                : "border-white/10 bg-white/5"
                          }`}
                        >
                          <p className="text-white font-semibold text-sm mb-1">{format(day, "d")}</p>
                          <div className="space-y-1">
                            {dayBookings.slice(0, 2).map((booking) => (
                              <div
                                key={booking.id}
                                className="text-xs bg-elysian-primary/70 text-white px-2 py-1 rounded truncate"
                                title={booking.suite_name}
                              >
                                {booking.suite_name}
                              </div>
                            ))}
                            {dayBookings.length > 2 && (
                              <p className="text-xs text-white/60">+{dayBookings.length - 2} altri</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings list */}
            <div>
              <Card className="glass-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Prenotazioni Prossime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bookings.length === 0 ? (
                      <p className="text-white/60 text-sm">Nessuna prenotazione</p>
                    ) : (
                      bookings.slice(0, 10).map((booking) => {
                        try {
                          const checkIn = parseISO(booking.check_in_date)
                          const checkOut = parseISO(booking.check_out_date)
                          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

                          return (
                            <div
                              key={booking.id}
                              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                            >
                              <p className="font-semibold elysian-primary text-sm">{booking.suite_name}</p>
                              <p className="text-white text-sm mt-1">{booking.full_name}</p>
                              <p className="text-white/60 text-xs">{booking.arrangement}</p>
                              <p className="text-white/60 text-xs mt-2">
                                {format(checkIn, "dd MMM", { locale: it })} -{" "}
                                {format(checkOut, "dd MMM", { locale: it })}
                              </p>
                              <p className="text-white/60 text-xs">
                                {nights} notte{nights !== 1 ? "i" : ""} • {booking.num_guests} ospiti
                              </p>
                              <a
                                href={generateGoogleCalendarLink(booking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-all"
                              >
                                <CalendarIcon className="w-3 h-3" />
                                Aggiungi a Google
                              </a>
                            </div>
                          )
                        } catch (error) {
                          console.log("[v0] Error rendering booking:", error)
                          return null
                        }
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

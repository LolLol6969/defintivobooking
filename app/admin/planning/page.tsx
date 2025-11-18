"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/src/lib/supabase/client"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Booking {
  id: string
  suite_name: string
  full_name: string
  email: string
  phone?: string
  check_in_date: string
  check_out_date: string
  num_guests: number
  message?: string
  created_at: string
}

export default function PlanningPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  const ADMIN_PASSWORD = "orla2025"

  useEffect(() => {
    if (!isAuthenticated) return
    fetchBookings()
  }, [isAuthenticated])

  async function fetchBookings() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("check_in_date", { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      setBookings(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordInput("")
    } else {
      alert("Password non corretta!")
      setPasswordInput("")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen beach-background flex items-center justify-center">
        <Header />
        <div className="max-w-md w-full mx-auto px-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-center elysian-primary">Accesso Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Inserisci password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-elysian-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-elysian-primary text-elysian-secondary py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
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

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.suite_name === filter)

  const uniqueSuites = Array.from(new Set(bookings.map(b => b.suite_name)))

  return (
    <div className="min-h-screen beach-background">
      <Header />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center elysian-secondary mb-8 text-balance">
            Planning Prenotazioni
          </h1>

          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === "all"
                  ? "bg-elysian-primary text-elysian-secondary"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Tutte le Suite
            </button>
            {uniqueSuites.map((suite) => (
              <button
                key={suite}
                onClick={() => setFilter(suite)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === suite
                    ? "bg-elysian-primary text-elysian-secondary"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {suite}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-white text-xl">Caricamento...</div>
          ) : error ? (
            <div className="text-center text-red-500 text-xl">Errore: {error}</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center text-white text-xl">Nessuna prenotazione trovata</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBookings.map((booking) => {
                const checkIn = parseISO(booking.check_in_date)
                const checkOut = parseISO(booking.check_out_date)
                const nights = Math.ceil(
                  (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <Card key={booking.id} className="glass-panel overflow-hidden hover:shadow-xl transition-all">
                    <CardHeader className="bg-gradient-to-r from-elysian-primary/20 to-transparent pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-elysian-secondary">
                            {booking.suite_name}
                          </CardTitle>
                          <p className="text-sm text-white mt-1">{booking.full_name}</p>
                        </div>
                        <span className="bg-elysian-primary text-elysian-secondary px-3 py-1 rounded-full text-xs font-bold">
                          {nights} notte{nights !== 1 ? "i" : ""}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-white/60 text-xs">CHECK-IN</p>
                          <p className="text-white font-semibold">
                            {format(checkIn, "dd MMM yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">CHECK-OUT</p>
                          <p className="text-white font-semibold">
                            {format(checkOut, "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/60 mb-1">OSPITI: {booking.num_guests}</p>
                        <p className="text-xs text-white/60 mb-1">EMAIL: {booking.email}</p>
                        {booking.phone && (
                          <p className="text-xs text-white/60 mb-1">TEL: {booking.phone}</p>
                        )}
                      </div>

                      {booking.message && (
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-white/60 mb-1">NOTE</p>
                          <p className="text-sm text-white italic">{booking.message}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/10 text-xs text-white/50">
                        Prenotato: {format(parseISO(booking.created_at), "dd MMM yyyy HH:mm")}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

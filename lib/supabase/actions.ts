"use server"

import { supabase } from "@/src/lib/supabase/client"

export interface BookingData {
  suite_name: string
  full_name: string
  email: string
  phone?: string
  check_in_date: Date
  check_out_date: Date
  num_guests: number
  message?: string
}

export interface SubmitBookingResponse {
  success: boolean
  data?: any
  error?: string
}

export interface FetchBookingsResponse {
  success: boolean
  data?: any[]
  error?: string
}

// Submit a new booking
export async function submitBooking(bookingData: BookingData): Promise<SubmitBookingResponse> {
  try {
    const checkInDate =
      bookingData.check_in_date instanceof Date
        ? bookingData.check_in_date.toISOString().split("T")[0]
        : bookingData.check_in_date

    const checkOutDate =
      bookingData.check_out_date instanceof Date
        ? bookingData.check_out_date.toISOString().split("T")[0]
        : bookingData.check_out_date

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          suite_name: bookingData.suite_name,
          full_name: bookingData.full_name,
          email: bookingData.email,
          phone: bookingData.phone || null,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          num_guests: bookingData.num_guests,
          message: bookingData.message || null,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Supabase insert error:", error.message)
      return { success: false, error: error.message }
    }

    const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
    if (webhookUrl && data && data.length > 0) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            suite_name: bookingData.suite_name,
            full_name: bookingData.full_name,
            email: bookingData.email,
            phone: bookingData.phone,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            num_guests: bookingData.num_guests,
            message: bookingData.message,
            booking_id: data[0].id,
          }),
        })
      } catch (webhookError) {
        console.warn("[v0] Make.com webhook error:", webhookError)
        // Non interrompiamo la prenotazione se il webhook fallisce
      }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("[v0] submitBooking error:", err.message)
    return { success: false, error: err.message }
  }
}

// Fetch all bookings
export async function fetchBookings(): Promise<FetchBookingsResponse> {
  try {
    const { data, error } = await supabase.from("bookings").select("*").order("check_in_date", { ascending: true })

    if (error) {
      console.error("[v0] Supabase fetch error:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("[v0] fetchBookings error:", err.message)
    return { success: false, error: err.message }
  }
}

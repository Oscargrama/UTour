import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getTourById } from "@/lib/tours-content"

type SubmitBody = {
  tourId?: string
  name?: string
  country?: string
  rating?: number
  comment?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody

    const tourId = (body.tourId || "").trim()
    const name = (body.name || "").trim()
    const country = (body.country || "").trim()
    const comment = (body.comment || "").trim()
    const rating = Number(body.rating)

    if (!tourId || !name || !country || !comment || !Number.isFinite(rating)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    const tour = getTourById(tourId)
    if (!tour) {
      return NextResponse.json({ error: "Invalid tour" }, { status: 400 })
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split("T")[0]

    const payloadWithExtendedFields = {
      name,
      country,
      rating,
      comment,
      tour_type: tourId,
      tour_id: tourId,
      date: today,
      approved: false,
    }

    const { error: extendedError } = await supabase.from("testimonials").insert([payloadWithExtendedFields])

    if (!extendedError) {
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const fallbackPayload = {
      name: `${name} (${country})`,
      rating,
      comment,
      tour_type: tourId,
      date: today,
      approved: false,
    }

    const { error: fallbackError } = await supabase.from("testimonials").insert([fallbackPayload])

    if (fallbackError) {
      console.error("[testimonials/submit] Insert failed:", fallbackError)
      return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("[testimonials/submit] Unexpected error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

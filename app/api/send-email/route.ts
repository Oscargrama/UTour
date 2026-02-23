import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json(
        {
          error: "Missing RESEND_API_KEY",
        },
        { status: 500 },
      )
    }

    const resend = new Resend(resendApiKey)
    const body = await request.json()
    const { to, subject, html, text } = body

    console.log("Sending email to:", to)

    const { data, error } = await resend.emails.send({
      from: "UTour <onboarding@resend.dev>", // Resend default sender
      to: [to],
      subject,
      html,
      text,
      replyTo: "d.oinfante@gmail.com",
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    console.log("Email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: data?.id,
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

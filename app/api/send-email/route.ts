import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/8b92589e-f5b9-4055-9401-c94eea722f4a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'send-email/route.ts:entry',message:'send-email POST called',data:{},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const resendFrom = process.env.RESEND_FROM
    const resendReplyTo = process.env.RESEND_REPLY_TO || "d.oinfante@gmail.com"
    if (!resendApiKey) {
      return NextResponse.json(
        {
          error: "Missing RESEND_API_KEY",
        },
        { status: 500 },
      )
    }
    if (!resendFrom) {
      return NextResponse.json(
        {
          error: "Missing RESEND_FROM",
          details: "Define RESEND_FROM, por ejemplo: UTour <reservas@delabmarketing.com>",
        },
        { status: 500 },
      )
    }

    const resend = new Resend(resendApiKey)
    const body = await request.json()
    const { to, subject, html, text } = body
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8b92589e-f5b9-4055-9401-c94eea722f4a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'send-email/route.ts:beforeResend',message:'about to call resend.emails.send',data:{to,subjectLength:subject?.length,hasHtml:!!html},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    console.log("Sending email to:", to)

    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: [to],
      subject,
      html,
      text,
      replyTo: resendReplyTo,
    })

    if (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8b92589e-f5b9-4055-9401-c94eea722f4a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'send-email/route.ts:resendError',message:'Resend API returned error',data:{error:String(error),to},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      console.error("Resend error:", error)
      throw error
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8b92589e-f5b9-4055-9401-c94eea722f4a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'send-email/route.ts:resendSuccess',message:'resend.emails.send succeeded',data:{id:data?.id,to},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    console.log("Email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: data?.id,
    })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8b92589e-f5b9-4055-9401-c94eea722f4a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'send-email/route.ts:catch',message:'send-email threw',data:{error:String(error)},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
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

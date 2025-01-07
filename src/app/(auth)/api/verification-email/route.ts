import { siteConfig } from "@/config/site"
import { env } from "@/data/env/server"
import { VerificationEmail } from "@/features/email/components/verification-email"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(env.RESEND_API_KEY)

const bodySchema = z.object({
  email: z.string(),
  code: z.string(),
})

export async function POST(request: Request): Promise<Response> {
  const res = await request.json()

  const validatedBody = bodySchema.safeParse(res)
  if (!validatedBody.success) {
    return Response.json({ error: validatedBody.error }, { status: 400 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${siteConfig.title} <onboarding@luca-felix.com>`,
      to: [validatedBody.data.email, "delivered@luca-felix.com"],
      subject: "Your verification code",
      react: VerificationEmail({ code: validatedBody.data.code }),
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}

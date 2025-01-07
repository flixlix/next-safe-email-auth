import { siteConfig } from "@/config/site"
import { env } from "@/data/env/server"
import { PasswordReset } from "@/features/email/components/password-reset"
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
      from: `${siteConfig.title} <password-reset@luca-felix.com>`,
      to: [validatedBody.data.email, "delivered@luca-felix.com"],
      subject: "Password Reset Code",
      react: PasswordReset({ code: validatedBody.data.code }),
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}

import TwoFactorResetForm from "@/features/auth/2fa/reset/components/form"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session === null) {
    redirect("/login")
  }
  if (!user.emailVerified) {
    redirect("/verify-email")
  }
  if (!user.registered2FA) {
    redirect("/2fa/totp/setup")
  }
  if (session.twoFactorVerified) {
    redirect("/")
  }
  return <TwoFactorResetForm />
}

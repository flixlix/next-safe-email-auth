import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import LoginForm from "@/features/auth/login/components/form"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session !== null) {
    if (!user.emailVerified) {
      redirect("/verify-email")
    }
    if (!user.registered2FA) {
      redirect("/2fa/totp/setup")
    }
    if (!session.twoFactorVerified) {
      redirect(get2FARedirect(user))
    }
    redirect("/")
  }
  return <LoginForm />
}

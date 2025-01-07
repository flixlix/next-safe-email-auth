import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import PasswordResetForm from "@/features/auth/reset-password/2fa/components/form"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentPasswordResetSession()
  if (session === null) {
    redirect("/forgot-password")
  }
  if (!session.emailVerified) {
    redirect("/reset-password/verify-email")
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    redirect("/reset-password/2fa")
  }
  return <PasswordResetForm />
}

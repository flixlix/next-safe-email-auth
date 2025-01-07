import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import PasswordResetEmailVerificationForm from "@/features/auth/reset-password/verify-email/components/form"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session } = await getCurrentPasswordResetSession()
  if (session === null) {
    redirect("/forgot-password")
  }
  if (session.emailVerified) {
    if (!session.twoFactorVerified) {
      redirect("/reset-password/2fa")
    }
    redirect("/reset-password")
  }
  return <PasswordResetEmailVerificationForm session={session} />
}

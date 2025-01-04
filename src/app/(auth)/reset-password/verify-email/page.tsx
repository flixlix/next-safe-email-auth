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
    return redirect("/forgot-password")
  }
  if (session.emailVerified) {
    if (!session.twoFactorVerified) {
      return redirect("/reset-password/2fa")
    }
    return redirect("/reset-password")
  }
  return (
    <>
      <h1>Verify your email address</h1>
      <p>We sent an 8-digit code to {session.email}.</p>
      <PasswordResetEmailVerificationForm />
    </>
  )
}

import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import PasswordResetRecoveryCodeForm from "@/features/auth/reset-password/2fa/recovery-code/components/form"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentPasswordResetSession()

  if (session === null) {
    return redirect("/forgot-password")
  }
  if (!session.emailVerified) {
    return redirect("/reset-password/verify-email")
  }
  if (!user.registered2FA) {
    return redirect("/reset-password")
  }
  if (session.twoFactorVerified) {
    return redirect("/reset-password")
  }
  return (
    <>
      <h1>Use your recovery code</h1>
      <PasswordResetRecoveryCodeForm />
    </>
  )
}

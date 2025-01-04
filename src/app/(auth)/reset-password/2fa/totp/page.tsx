import { getPasswordReset2FARedirect } from "@/features/auth/lib/server/2fa"
import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import PasswordResetTOTPForm from "@/features/auth/reset-password/2fa/totp/components/form"
import Link from "next/link"
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
  if (!user.registered2FA) {
    redirect("/reset-password")
  }
  if (session.twoFactorVerified) {
    redirect("/reset-password")
  }
  if (!user.registeredTOTP) {
    redirect(getPasswordReset2FARedirect(user))
  }
  return (
    <>
      <h1>Authenticate with authenticator app</h1>
      <p>Enter the code from your app.</p>
      <PasswordResetTOTPForm />
      <Link href="/reset-password/2fa/recovery-code">Use recovery code</Link>
      {user.registeredSecurityKey && <Link href="/reset-password/2fa/security-key">Use security keys</Link>}
      {user.registeredPasskey && <Link href="/reset-password/2fa/passkey">Use passkeys</Link>}
    </>
  )
}

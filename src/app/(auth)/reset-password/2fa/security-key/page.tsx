import { getPasswordReset2FARedirect } from "@/features/auth/lib/server/2fa"
import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getUserSecurityKeyCredentials } from "@/features/auth/lib/server/webauthn"
import Verify2FAWithSecurityKeyButton from "@/features/auth/reset-password/2fa/security-key/components/verify-button"
import { encodeBase64 } from "@oslojs/encoding"
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
  if (!user.registeredSecurityKey) {
    redirect(getPasswordReset2FARedirect(user))
  }
  const credentials = await getUserSecurityKeyCredentials(user.id)
  return (
    <>
      <h1>Authenticate with security keys</h1>
      <Verify2FAWithSecurityKeyButton
        encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))}
      />
      <Link href="/reset-password/2fa/recovery-code">Use recovery code</Link>
      {user.registeredTOTP && <Link href="/reset-password/2fa/totp">Use authenticator apps</Link>}
      {user.registeredPasskey && <Link href="/reset-password/2fa/passkey">Use passkeys</Link>}
    </>
  )
}

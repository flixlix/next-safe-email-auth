import { getPasswordReset2FARedirect } from "@/features/auth/lib/server/2fa"
import { getCurrentPasswordResetSession } from "@/features/auth/lib/server/password-reset"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getUserPasskeyCredentials } from "@/features/auth/lib/server/webauthn"
import Verify2FAWithPasskeyButton from "@/features/auth/reset-password/2fa/passkey/components/verify-passkey-button"
import { encodeBase64 } from "@oslojs/encoding"
import Link from "next/link"
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
  if (!user.registeredPasskey) {
    return redirect(getPasswordReset2FARedirect(user))
  }
  const credentials = await getUserPasskeyCredentials(user.id)
  return (
    <>
      <h1>Authenticate with passkeys</h1>
      <Verify2FAWithPasskeyButton encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))} />
      <Link href="/reset-password/2fa/recovery-code">Use recovery code</Link>
      {user.registeredTOTP && <Link href="/reset-password/2fa/totp">Use authenticator apps</Link>}
      {user.registeredSecurityKey && <Link href="/reset-password/2fa/security-key">Use security keys</Link>}
    </>
  )
}

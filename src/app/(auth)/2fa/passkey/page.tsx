import Verify2FAWithPasskeyButton from "@/features/auth/2fa/passkey/components/verify-passkey-button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserPasskeyCredentials } from "@/features/auth/lib/server/webauthn"
import { encodeBase64 } from "@oslojs/encoding"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session === null || user === null) {
    redirect("/login")
  }
  if (!user.emailVerified) {
    redirect("/verify-email")
  }
  if (!user.registered2FA) {
    redirect("/")
  }
  if (session.twoFactorVerified) {
    redirect("/")
  }
  if (!user.registeredPasskey) {
    redirect(get2FARedirect(user))
  }
  const credentials = await getUserPasskeyCredentials(user.id)
  return (
    <>
      <h1>Authenticate with passkeys</h1>
      <Verify2FAWithPasskeyButton encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))} />
      <Link href="/2fa/reset">Use recovery code</Link>
      {user.registeredTOTP && <Link href="/2fa/totp">Use authenticator apps</Link>}
      {user.registeredSecurityKey && <Link href="/2fa/security-key">Use security keys</Link>}
    </>
  )
}

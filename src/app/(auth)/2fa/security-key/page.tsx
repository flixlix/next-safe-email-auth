import { Verify2FAWithSecurityKeyButton } from "@/features/auth/2fa/security-key/components"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserSecurityKeyCredentials } from "@/features/auth/lib/server/webauthn"
import { encodeBase64 } from "@oslojs/encoding"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session === null || user === null) {
    return redirect("/login")
  }
  if (!user.emailVerified) {
    return redirect("/verify-email")
  }
  if (!user.registered2FA) {
    return redirect("/")
  }
  if (session.twoFactorVerified) {
    return redirect("/")
  }
  if (!user.registeredSecurityKey) {
    return redirect(get2FARedirect(user))
  }
  const credentials = await getUserSecurityKeyCredentials(user.id)
  return (
    <>
      <h1>Authenticate with security keys</h1>
      <Verify2FAWithSecurityKeyButton
        encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))}
      />
      <Link href="/2fa/reset">Use recovery code</Link>
      {user.registeredTOTP && <Link href="/2fa/totp">Use authenticator apps</Link>}
      {user.registeredPasskey && <Link href="/2fa/passkey">Use passkeys</Link>}
    </>
  )
}

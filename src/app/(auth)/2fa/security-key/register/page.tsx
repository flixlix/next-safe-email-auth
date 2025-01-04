import RegisterSecurityKey from "@/features/auth/2fa/security-key/register/components/register-key"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserSecurityKeyCredentials } from "@/features/auth/lib/server/webauthn"
import { bigEndian } from "@oslojs/binary"
import { encodeBase64 } from "@oslojs/encoding"
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
  if (user.registered2FA && !session.twoFactorVerified) {
    redirect(get2FARedirect(user))
  }

  const credentials = await getUserSecurityKeyCredentials(user.id)

  const credentialUserId = new Uint8Array(8)
  bigEndian.putUint64(credentialUserId, BigInt(user.id), 0)
  return (
    <>
      <h1>Register security key</h1>
      <RegisterSecurityKey
        encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))}
        user={user}
        encodedCredentialUserId={encodeBase64(credentialUserId)}
      />
    </>
  )
}

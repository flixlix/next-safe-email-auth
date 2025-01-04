import RegisterPasskeyForm from "@/features/auth/2fa/passkey/register/components/form"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserPasskeyCredentials } from "@/features/auth/lib/server/webauthn"
import { bigEndian } from "@oslojs/binary"
import { encodeBase64 } from "@oslojs/encoding"
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
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect(get2FARedirect(user))
  }

  const credentials = await getUserPasskeyCredentials(user.id)

  const credentialUserId = new Uint8Array(8)
  bigEndian.putUint64(credentialUserId, BigInt(user.id), 0)
  return (
    <>
      <h1>Register passkey</h1>
      <RegisterPasskeyForm
        encodedCredentialIds={credentials.map((credential) => encodeBase64(credential.id))}
        user={user}
        encodedCredentialUserId={encodeBase64(credentialUserId)}
      />
    </>
  )
}

import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
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
  if (user.registered2FA) {
    return redirect("/")
  }
  return (
    <>
      <h1>Set up two-factor authentication</h1>
      <ul>
        <li>
          <Link href="/2fa/totp/setup">Authenticator apps</Link>
        </li>
        <li>
          <Link href="/2fa/passkey/register">Passkeys</Link>
        </li>
        <li>
          <Link href="/2fa/security-key/register">Security keys</Link>
        </li>
      </ul>
    </>
  )
}

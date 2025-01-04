import { LogoutButton } from "@/features/auth/components/logout-button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session === null) {
    return redirect("/login")
  }
  if (!user.emailVerified) {
    return redirect("/verify-email")
  }
  if (!user.registered2FA) {
    return redirect("/2fa/setup")
  }
  if (!session.twoFactorVerified) {
    return redirect(get2FARedirect(user))
  }
  return (
    <>
      <header>
        <Link href="/">Home</Link>
        <Link href="/settings">Settings</Link>
      </header>
      <main>
        <h1>Hi {user.username}!</h1>
        <LogoutButton />
      </main>
    </>
  )
}

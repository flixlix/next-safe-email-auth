import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import LoginForm from "@/features/auth/login/components/form"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/verify-email")
    }
    if (!user.registered2FA) {
      return redirect("/2fa/setup")
    }
    if (!session.twoFactorVerified) {
      return redirect(get2FARedirect(user))
    }
    return redirect("/")
  }
  return (
    <>
      <h1>Sign in</h1>
      <LoginForm />
      <Link href="/signup">Create an account</Link>
      <Link href="/forgot-password">Forgot password?</Link>
    </>
  )
}

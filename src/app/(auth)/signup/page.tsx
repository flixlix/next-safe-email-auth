import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import SignUpForm from "@/features/auth/signup/components/form"
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
      <h1>Create an account</h1>
      <p>Your username must be at least 3 characters long and your password must be at least 8 characters long.</p>
      <SignUpForm />
      <Link href="/login">Sign in</Link>
    </>
  )
}

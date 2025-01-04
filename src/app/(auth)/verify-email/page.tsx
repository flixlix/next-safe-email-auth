import { getCurrentUserEmailVerificationRequest } from "@/features/auth/lib/server/email-verification"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import EmailVerificationForm from "@/features/auth/verify-email/components/email-verify-form"
import ResendEmailVerificationCodeForm from "@/features/auth/verify-email/components/resend-email-verify-form"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { user } = await getCurrentSession()
  if (user === null) {
    return redirect("/login")
  }

  // TODO: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest = await getCurrentUserEmailVerificationRequest()
  if (verificationRequest === null && user.emailVerified) {
    return redirect("/")
  }
  return (
    <>
      <h1>Verify your email address</h1>
      <p>We sent an 8-digit code to {verificationRequest?.email ?? user.email}.</p>
      <EmailVerificationForm />
      <ResendEmailVerificationCodeForm />
      <Link href="/settings">Change your email</Link>
    </>
  )
}

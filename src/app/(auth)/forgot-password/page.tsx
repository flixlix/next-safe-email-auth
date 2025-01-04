import ForgotPasswordForm from "@/features/auth/forgot-password/components/form"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import Link from "next/link"

export default function Page() {
  if (!globalGETRateLimit()) {
    return "Too many requests"
  }

  return (
    <>
      <h1>Forgot your password?</h1>
      <ForgotPasswordForm />
      <Link href="/login">Sign in</Link>
    </>
  )
}

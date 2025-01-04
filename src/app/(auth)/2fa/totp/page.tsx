import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import TwoFactorVerificationForm from "@/features/auth/2fa/totp/components/form"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { Bandage, BookCheck, KeyRound } from "lucide-react"
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
  if (session.twoFactorVerified) {
    return redirect("/")
  }
  return (
    <>
      <TwoFactorVerificationForm />
      <Separator className="mb-6" />
      <Button asChild variant="outline" className="w-full">
        <Link href="/2fa/reset">
          <Bandage />
          Use recovery code
        </Link>
      </Button>
      {user.registeredPasskey && (
        <Button asChild variant="outline" className="w-full">
          <Link href="/2fa/passkey">
            <BookCheck />
            Use passkeys
          </Link>
        </Button>
      )}
      {user.registeredSecurityKey && (
        <Button asChild variant="outline" className="w-full">
          <Link href="/2fa/security-key">
            <KeyRound />
            Use security keys
          </Link>
        </Button>
      )}
    </>
  )
}

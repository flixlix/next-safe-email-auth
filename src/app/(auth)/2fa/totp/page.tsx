import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import TwoFactorVerificationForm from "@/features/auth/2fa/totp/components/form"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { Bandage } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests"
  }

  const { session, user } = await getCurrentSession()
  if (session === null) {
    redirect("/login")
  }
  if (!user.emailVerified) {
    redirect("/verify-email")
  }
  if (!user.registered2FA) {
    redirect("/2fa/totp/setup")
  }
  if (session.twoFactorVerified) {
    redirect("/")
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
    </>
  )
}

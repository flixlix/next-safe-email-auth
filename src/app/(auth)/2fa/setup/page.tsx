import { Button } from "@/components/ui/button"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { BookCheck, KeyRound, Smartphone } from "lucide-react"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start text-start">
        <h1 className="text-2xl font-bold">Set up two-factor authentication</h1>
        <p className="text-balance text-muted-foreground">Choose a method to secure your account.</p>
      </div>
      <ul className="flex flex-col gap-4">
        <li>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/2fa/totp/setup">
              <Smartphone />
              Authenticator apps
            </Link>
          </Button>
        </li>
        <li>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/2fa/passkey/register">
              <BookCheck />
              Passkeys
            </Link>
          </Button>
        </li>
        <li>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/2fa/security-key/register">
              <KeyRound />
              Security keys
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  )
}

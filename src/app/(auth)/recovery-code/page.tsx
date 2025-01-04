import Link from "next/link"

import { Button } from "@/components/ui/button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserRecoverCode } from "@/features/auth/lib/server/user"
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
  if (!session.twoFactorVerified) {
    redirect(get2FARedirect(user))
  }
  const recoveryCode = await getUserRecoverCode(user.id)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start text-start">
        <h1 className="text-2xl font-bold">Recovery code</h1>
        <p className="text-balance text-muted-foreground">
          You can use this recovery code if you lose access to your second factors.
        </p>
      </div>
      <div className="grid gap-2">
        <p>Your recovery code is:</p>
        <code className="bg-muted p-2 font-mono text-sm text-muted-foreground">{recoveryCode}</code>
      </div>
      <Button className="w-full" asChild>
        <Link href="/">Finish</Link>
      </Button>
    </div>
  )
}

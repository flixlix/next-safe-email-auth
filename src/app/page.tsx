import { Button } from "@/components/ui/button"
import LogoutButton from "@/features/auth/components/logout-button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { Settings } from "lucide-react"
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
    <div className="container flex min-h-screen flex-col gap-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/">Home</Link>

        <Button size="icon" variant="outline" asChild>
          <Link href="/settings">
            <span className="sr-only">Settings</span>
            <Settings />
          </Link>
        </Button>
      </header>
      <main className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Hi {user.username}!</h1>
        <LogoutButton />
      </main>
    </div>
  )
}

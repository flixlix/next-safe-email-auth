import mountains from "@/assets/mountains.avif"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { HelperText } from "@/components/ui/helper-text"
import LogoutButton from "@/features/auth/components/logout-button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { Settings } from "lucide-react"
import Image from "next/image"
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
  if (!session.twoFactorVerified) {
    redirect(get2FARedirect(user))
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden shadow-sm md:min-h-[480px]">
          <div className="grid p-0 md:min-h-[480px] md:grid-cols-2">
            <div className="relative hidden bg-muted md:block">
              <Image
                src={mountains}
                // src={oilPainting}
                placeholder="blur"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale md:min-h-[480px]"
                alt="nice oil painting"
                width={383}
                height={700}
              />
            </div>
            <div className="my-auto flex h-full flex-col">
              <CardHeader>
                <header className="flex items-center justify-between">
                  <Link href="/">Home</Link>

                  <LogoutButton />
                  <Button size="icon" variant="outline" asChild>
                    <Link href="/settings">
                      <span className="sr-only">Settings</span>
                      <Settings />
                    </Link>
                  </Button>
                </header>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Hi {user.username}!</h1>
                <p className="mb-4 text-muted-foreground">Welcome back to your account.</p>
                <HelperText>Account ID: {user.id}</HelperText>
                <HelperText>Username: {user.username}</HelperText>
                <HelperText>Email: {user.email}</HelperText>
                <HelperText>Email verified: {user.emailVerified ? "Yes" : "No"}</HelperText>
                <HelperText>Two-factor authentication: {user.registered2FA ? "Enabled" : "Disabled"}</HelperText>
                <HelperText>Two-factor verified: {session.twoFactorVerified ? "Yes" : "No"}</HelperText>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

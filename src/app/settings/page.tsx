import { Button } from "@/components/ui/button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserRecoverCode } from "@/features/auth/lib/server/user"
import DisconnectTOTPButton from "@/features/auth/settings/components/disconnect-totp-button"
import RecoveryCodeSection from "@/features/auth/settings/components/recovery-code-section"
import UpdateEmailForm from "@/features/auth/settings/components/update-email-form"
import UpdatePasswordForm from "@/features/auth/settings/components/update-password-form"
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
  if (user.registered2FA && !session.twoFactorVerified) {
    redirect(get2FARedirect(user))
  }
  let recoveryCode: string | null = null
  if (user.registered2FA) {
    recoveryCode = await getUserRecoverCode(user.id)
  }

  return (
    <div className="container flex min-h-screen flex-col gap-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/">Home</Link>
      </header>
      <main className="container flex max-w-screen-sm flex-col gap-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Update email</h2>
          <p className="text-muted-foreground">Your email: {user.email}</p>
          <UpdateEmailForm />
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Update password</h2>
          <UpdatePasswordForm />
        </section>
        <section className="flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold">Authenticator app</h2>
          {user.registeredTOTP ? (
            <>
              <Button asChild>
                <Link href="/2fa/totp/setup">Update TOTP</Link>
              </Button>
              <DisconnectTOTPButton />
            </>
          ) : (
            <Button asChild>
              <Link href="/2fa/totp/setup">Set up TOTP</Link>
            </Button>
          )}
        </section>
        {recoveryCode !== null && <RecoveryCodeSection recoveryCode={recoveryCode} />}
      </main>
    </div>
  )
}

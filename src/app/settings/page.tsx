import { Button } from "@/components/ui/button"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { getUserRecoverCode } from "@/features/auth/lib/server/user"
import { getUserPasskeyCredentials, getUserSecurityKeyCredentials } from "@/features/auth/lib/server/webauthn"
import DisconnectTOTPButton from "@/features/auth/settings/components/disconnect-totp-button"
import PasskeyCredentialListItem from "@/features/auth/settings/components/passkey-list"
import RecoveryCodeSection from "@/features/auth/settings/components/recovery-code-section"
import SecurityKeyCredentialListItem from "@/features/auth/settings/components/security-key-list"
import UpdateEmailForm from "@/features/auth/settings/components/update-email-form"
import UpdatePasswordForm from "@/features/auth/settings/components/update-password-form"
import { encodeBase64 } from "@oslojs/encoding"
import { Plus } from "lucide-react"
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
  const passkeyCredentials = await getUserPasskeyCredentials(user.id)
  const securityKeyCredentials = await getUserSecurityKeyCredentials(user.id)
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
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Passkeys</h2>
          <p className="text-muted-foreground">
            Passkeys are WebAuthn credentials that validate your identity using your device.
          </p>
          <ul>
            {passkeyCredentials.map((credential) => {
              return (
                <PasskeyCredentialListItem
                  encodedId={encodeBase64(credential.id)}
                  name={credential.name}
                  key={encodeBase64(credential.id)}
                />
              )
            })}
          </ul>
          <Button asChild className="me-auto">
            <Link href="/2fa/passkey/register">
              <Plus />
              Add
            </Link>
          </Button>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Security keys</h2>
          <p className="text-muted-foreground">
            Security keys are WebAuthn credentials that can only be used for two-factor authentication.
          </p>
          <ul>
            {securityKeyCredentials.map((credential) => {
              return (
                <SecurityKeyCredentialListItem
                  encodedId={encodeBase64(credential.id)}
                  name={credential.name}
                  key={encodeBase64(credential.id)}
                />
              )
            })}
          </ul>
          <Button asChild className="me-auto">
            <Link href="/2fa/security-key/register">
              <Plus />
              Add
            </Link>
          </Button>
        </section>
        {recoveryCode !== null && <RecoveryCodeSection recoveryCode={recoveryCode} />}
      </main>
    </div>
  )
}

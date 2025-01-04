import TwoFactorSetUpForm from "@/features/auth/2fa/totp/setup/components/form"
import { get2FARedirect } from "@/features/auth/lib/server/2fa"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"
import { getCurrentSession } from "@/features/auth/lib/server/session"
import { generateRandomOTP } from "@/features/auth/lib/server/utils"
import { encodeBase64 } from "@oslojs/encoding"
import { createTOTPKeyURI } from "@oslojs/otp"
import { redirect } from "next/navigation"
import { renderSVG } from "uqr"

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
  if (user.registered2FA && !session.twoFactorVerified) {
    redirect(get2FARedirect(user))
  }

  const totpKey = new Uint8Array(20)
  crypto.getRandomValues(totpKey)
  const encodedTOTPKey = encodeBase64(totpKey)
  const keyURI = createTOTPKeyURI(generateRandomOTP(), user.username, totpKey, 30, 6)
  const qrcode = renderSVG(keyURI)
  return <TwoFactorSetUpForm qrcode={qrcode} encodedTOTPKey={encodedTOTPKey} />
}

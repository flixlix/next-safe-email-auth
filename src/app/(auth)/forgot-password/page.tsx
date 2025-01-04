import ForgotPasswordForm from "@/features/auth/forgot-password/components/form"
import { globalGETRateLimit } from "@/features/auth/lib/server/request"

export default function Page() {
  if (!globalGETRateLimit()) {
    return "Too many requests"
  }

  return <ForgotPasswordForm />
}

import { siteConfig } from "@/config/site"
import * as React from "react"

interface PasswordResetProps {
  code: string
}

export const PasswordReset: React.FC<Readonly<PasswordResetProps>> = ({ code }) => (
  <div>
    <h1>Welcome to {siteConfig.title}!</h1>
    <p>Your verification code is: {code}</p>
  </div>
)

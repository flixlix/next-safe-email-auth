import { siteConfig } from "@/config/site"
import * as React from "react"

interface VerificationEmailProps {
  code: string
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({ code }) => (
  <div>
    <h1>Welcome to {siteConfig.title}!</h1>
    <p>Your verification code is: {code}</p>
  </div>
)

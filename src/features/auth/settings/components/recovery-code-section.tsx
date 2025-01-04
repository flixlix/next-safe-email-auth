"use client"

import { useState } from "react"
import { regenerateRecoveryCodeAction } from "../actions/regenerate-security-code"

export default function RecoveryCodeSection(props: { recoveryCode: string }) {
  const [recoveryCode, setRecoveryCode] = useState(props.recoveryCode)
  return (
    <section>
      <h1>Recovery code</h1>
      <p>Your recovery code is: {recoveryCode}</p>
      <button
        onClick={async () => {
          const result = await regenerateRecoveryCodeAction()
          if (result.recoveryCode !== null) {
            setRecoveryCode(result.recoveryCode)
          }
        }}
      >
        Generate new code
      </button>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { regenerateRecoveryCodeAction } from "../actions/regenerate-recovery-code"

export default function RecoveryCodeSection(props: { recoveryCode: string }) {
  const [recoveryCode, setRecoveryCode] = useState(props.recoveryCode)
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Recovery code</h2>
      <p className="text-muted-foreground">
        Your recovery code is:{" "}
        <code className="max-w-full overflow-x-scroll bg-muted p-1 text-sm text-muted-foreground">{recoveryCode}</code>
      </p>
      <Button
        className="me-auto"
        onClick={async () => {
          const result = await regenerateRecoveryCodeAction()
          if (result.recoveryCode !== null) {
            setRecoveryCode(result.recoveryCode)
          }
        }}
      >
        Generate new code
      </Button>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { disconnectTOTPAction } from "../actions/disconnect-totp"

const initialDisconnectTOTPState = {
  message: "",
}

export default function DisconnectTOTPButton() {
  const [state, formAction, pending] = useActionState(disconnectTOTPAction, initialDisconnectTOTPState)
  return (
    <form action={formAction}>
      <Button disabled={pending} type="submit" variant="destructive">
        Disconnect
      </Button>
      <p className="text-sm font-medium text-destructive">{state.message}</p>
    </form>
  )
}

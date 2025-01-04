"use client"

import { useActionState } from "react"
import { disconnectTOTPAction } from "../actions/disconnect-totp"

const initialDisconnectTOTPState = {
  message: "",
}

export default function DisconnectTOTPButton() {
  const [state, formAction] = useActionState(disconnectTOTPAction, initialDisconnectTOTPState)
  return (
    <form action={formAction}>
      <button>Disconnect</button>
      <p>{state.message}</p>
    </form>
  )
}

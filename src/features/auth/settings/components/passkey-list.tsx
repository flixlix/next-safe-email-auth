"use client"

import { useActionState } from "react"
import { deletePasskeyAction } from "../actions/delete-passkey"

const initialPasskeyState = {
  message: "",
}

export default function PasskeyCredentialListItem(props: { encodedId: string; name: string }) {
  const [state, formAction] = useActionState(deletePasskeyAction, initialPasskeyState)
  return (
    <li>
      <p>{props.name}</p>
      <form action={formAction}>
        <input type="hidden" name="credential_id" value={props.encodedId} />
        <button> Delete </button>
        <p>{state.message}</p>
      </form>
    </li>
  )
}

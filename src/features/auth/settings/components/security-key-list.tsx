"use client"

import { useActionState } from "react"
import { deleteSecurityKeyAction } from "../actions/delete-security-key"

const initialSecurityKeyState = {
  message: "",
}

export default function SecurityKeyCredentialListItem(props: { encodedId: string; name: string }) {
  const [state, formAction] = useActionState(deleteSecurityKeyAction, initialSecurityKeyState)
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

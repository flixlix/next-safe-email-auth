"use client"

import { useActionState } from "react"
import { logoutAction } from "../actions/logout"

const initialState = {
  message: "",
}

export default function LogoutButton() {
  const [, action] = useActionState(logoutAction, initialState)
  return (
    <form action={action}>
      <button>Sign out</button>
    </form>
  )
}

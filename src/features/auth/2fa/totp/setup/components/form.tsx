"use client"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useActionState, useRef } from "react"
import { setup2FAAction } from "../actions/setup-2fa"

const initial2FASetUpState = {
  message: "",
}

export default function TwoFactorSetUpForm({ qrcode, ...props }: { encodedTOTPKey: string; qrcode: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(setup2FAAction, initial2FASetUpState)

  return (
    <form action={action} ref={formRef}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start text-start">
          <h1 className="text-2xl font-bold">Set up authenticator app</h1>
          <p className="text-balance text-muted-foreground">Scan the QR code using your authenticator app.</p>
        </div>
        <div
          className="mx-auto"
          style={{
            width: "200px",
            height: "200px",
          }}
          dangerouslySetInnerHTML={{
            __html: qrcode,
          }}
        ></div>
        <input className="mx-auto" name="key" value={props.encodedTOTPKey} hidden required readOnly />
        <div className="grid justify-center gap-2">
          <Label htmlFor="form-totp.code">Verify the code from the app</Label>
          <InputOTP
            id="form-totp.code"
            name="code"
            maxLength={6}
            required
            pattern={REGEXP_ONLY_DIGITS}
            onComplete={() => formRef.current?.requestSubmit()}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Submit
        </Button>
        {state.message ? <p className="text-sm font-medium text-destructive">{state.message}</p> : null}
      </div>
    </form>
  )
}

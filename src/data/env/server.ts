import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    ENCRYPTION_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    DOMAIN: z.string(),
  },
  experimental__runtimeEnv: process.env,
})

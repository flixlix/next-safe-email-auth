import { customType } from "drizzle-orm/pg-core"

export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea"
  },
  toDriver(value: Buffer) {
    return value
  },
  fromDriver(value: unknown) {
    return value as Buffer
  },
})

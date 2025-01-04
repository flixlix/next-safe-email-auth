import { siteConfig } from "@/config/site"
import { pgTableCreator } from "drizzle-orm/pg-core"

export const pgTable = pgTableCreator((name) => `${siteConfig.name}_${name}`)

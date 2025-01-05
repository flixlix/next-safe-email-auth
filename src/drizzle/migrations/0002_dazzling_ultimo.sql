DROP TABLE "next-safe-email-auth_passkey_credential" CASCADE;--> statement-breakpoint
DROP TABLE "next-safe-email-auth_security_key_credential" CASCADE;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_user" DROP COLUMN "recoveryCode";
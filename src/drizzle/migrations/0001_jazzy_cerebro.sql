ALTER TABLE "next-safe-email-auth_passkey_credential" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_passkey_credential" ALTER COLUMN "public_key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_security_key_credential" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_security_key_credential" ALTER COLUMN "public_key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_totp_credential" ALTER COLUMN "key" SET DATA TYPE text;
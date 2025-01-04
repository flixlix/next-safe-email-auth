CREATE TABLE "next-safe-email-auth_email_verification_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_passkey_credential" (
	"id" "bytea" PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"algorithm" integer NOT NULL,
	"public_key" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_password_reset_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_security_key_credential" (
	"id" "bytea" PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"algorithm" integer NOT NULL,
	"public_key" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_totp_credential" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"key" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "next-safe-email-auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"passwordHash" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"recoveryCode" "bytea" NOT NULL,
	CONSTRAINT "next-safe-email-auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_email_verification_request" ADD CONSTRAINT "next-safe-email-auth_email_verification_request_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_passkey_credential" ADD CONSTRAINT "next-safe-email-auth_passkey_credential_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_password_reset_session" ADD CONSTRAINT "next-safe-email-auth_password_reset_session_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_security_key_credential" ADD CONSTRAINT "next-safe-email-auth_security_key_credential_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_totp_credential" ADD CONSTRAINT "next-safe-email-auth_totp_credential_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-safe-email-auth_session" ADD CONSTRAINT "next-safe-email-auth_session_user_id_next-safe-email-auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."next-safe-email-auth_user"("id") ON DELETE cascade ON UPDATE no action;
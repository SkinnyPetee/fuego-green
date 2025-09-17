CREATE TYPE "public"."accountType" AS ENUM('individual', 'business');--> statement-breakpoint
CREATE TYPE "public"."contactMedium" AS ENUM('email', 'phone');--> statement-breakpoint
CREATE TYPE "public"."organizationType" AS ENUM('corporation', 'llc', 'partnership', 'sole proprietorship', 'non-profit', 'other');--> statement-breakpoint
CREATE TYPE "public"."title" AS ENUM('mr', 'ms', 'mrs', 'dr', 'prof', 'other');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountType" "accountType" NOT NULL,
	"organizationName" text,
	"organizationType" "organizationType",
	"title" "title" NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"address" text NOT NULL,
	"phone_number" varchar(10) NOT NULL,
	"contactMedium" "contactMedium" NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "accounts_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "org_name_required_if_business" CHECK (("accounts"."accountType" = 'individual') OR ("accounts"."accountType" = 'business' AND "accounts"."organizationName" IS NOT NULL)),
	CONSTRAINT "org_type_required_if_business" CHECK (("accounts"."accountType" = 'individual') OR ("accounts"."accountType" = 'business' AND "accounts"."organizationType" IS NOT NULL)),
	CONSTRAINT "phone_format" CHECK ("accounts"."phone_number" ~ '^[0-9]{10}$')
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
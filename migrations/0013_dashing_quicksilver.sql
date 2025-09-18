CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"pan" varchar(10) NOT NULL,
	"phone" varchar(10) NOT NULL,
	"email" varchar(255) NOT NULL,
	"registration_number" text NOT NULL,
	"business_address" text NOT NULL,
	CONSTRAINT "business_name_min_length" CHECK (length("businesses"."business_name") >= 2),
	CONSTRAINT "pan_length" CHECK (length("businesses"."pan") = 10),
	CONSTRAINT "phone_length" CHECK (length("businesses"."pan") = 10),
	CONSTRAINT "business_address_min_length" CHECK (length("businesses"."business_address") >= 2)
);
--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "accountType" TO "account_type";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "organizationName" TO "organization_name";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "organizationType" TO "organization_type";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "contactMedium" TO "contact_medium";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "org_name_required_if_business";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "org_type_required_if_business";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "org_name_required_if_business" CHECK (("accounts"."account_type" = 'individual') OR ("accounts"."account_type" = 'business' AND "accounts"."organization_name" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "org_type_required_if_business" CHECK (("accounts"."account_type" = 'individual') OR ("accounts"."account_type" = 'business' AND "accounts"."organization_type" IS NOT NULL));
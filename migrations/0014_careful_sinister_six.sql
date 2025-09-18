CREATE TYPE "public"."businessSize" AS ENUM('small', 'medium', 'large', 'enterprise');--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "business_size" "businessSize" NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "tan" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "gstin" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "account_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "tan_length" CHECK (length("businesses"."tan") = 10);--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "gstin_length" CHECK (length("businesses"."gstin") = 15);
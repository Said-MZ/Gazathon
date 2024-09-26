DO $$ BEGIN
 CREATE TYPE "public"."hospital_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hospital" ADD COLUMN "status" "hospital_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "hospital" ADD COLUMN "submitted_by" text;
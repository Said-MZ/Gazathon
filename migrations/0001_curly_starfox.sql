DO $$ BEGIN
 CREATE TYPE "public"."request_status" AS ENUM('pending', 'approved', 'rejected', 'fulfilled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('increase', 'decrease');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hospital" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"capacity" integer,
	"specialties" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medicine" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"generic_name" text,
	"dosage" text,
	"form" text,
	"price" integer NOT NULL,
	"stock" integer NOT NULL,
	"min_stock" integer,
	"expiration_date" timestamp NOT NULL,
	"batch_number" text,
	"hospital_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medicine_request" (
	"id" text PRIMARY KEY NOT NULL,
	"requesting_hospital_id" text NOT NULL,
	"providing_hospital_id" text NOT NULL,
	"medicine_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"status" "request_status" DEFAULT 'pending',
	"requested_at" timestamp DEFAULT now(),
	"fulfilled_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "permission_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"medicine_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"reason" text,
	"performed_by" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_permission" (
	"user_id" text NOT NULL,
	"permission_id" text NOT NULL,
	CONSTRAINT "user_permission_user_id_permission_id_pk" PRIMARY KEY("user_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hospital_role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hospital_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medicine" ADD CONSTRAINT "medicine_hospital_id_hospital_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospital"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medicine_request" ADD CONSTRAINT "medicine_request_requesting_hospital_id_hospital_id_fk" FOREIGN KEY ("requesting_hospital_id") REFERENCES "public"."hospital"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medicine_request" ADD CONSTRAINT "medicine_request_providing_hospital_id_hospital_id_fk" FOREIGN KEY ("providing_hospital_id") REFERENCES "public"."hospital"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medicine_request" ADD CONSTRAINT "medicine_request_medicine_id_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_medicine_id_medicine_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicine"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_performed_by_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_hospital_id_hospital_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospital"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE "admin_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"permissions" text[] DEFAULT '{}'::text[] NOT NULL,
	"token_hash" text NOT NULL,
	"invited_by_id" text NOT NULL,
	"accepted_by_id" text,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_id_admin_profiles_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_accepted_by_id_user_id_fk" FOREIGN KEY ("accepted_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_invites_token_hash_unique" ON "admin_invites" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "idx_admin_invites_email" ON "admin_invites" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "idx_admin_invites_invited_by" ON "admin_invites" USING btree ("invited_by_id");
--> statement-breakpoint
CREATE INDEX "idx_admin_invites_accepted_by" ON "admin_invites" USING btree ("accepted_by_id");

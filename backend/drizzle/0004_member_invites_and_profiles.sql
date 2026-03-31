CREATE TABLE "member_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"username" text NOT NULL,
	"bio" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "member_profiles_username_unique" ON "member_profiles" USING btree ("username");
--> statement-breakpoint
CREATE INDEX "idx_member_profiles_email" ON "member_profiles" USING btree ("email");
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "member_profile_id" text;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_profile_id_member_profiles_id_fk" FOREIGN KEY ("member_profile_id") REFERENCES "public"."member_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "team_members_member_profile_unique" ON "team_members" USING btree ("member_profile_id");
--> statement-breakpoint
CREATE TABLE "member_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"member_type" text DEFAULT 'team' NOT NULL,
	"token_hash" text NOT NULL,
	"invited_by_id" text NOT NULL,
	"accepted_by_id" text,
	"linked_team_member_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_invites" ADD CONSTRAINT "member_invites_invited_by_id_admin_profiles_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "member_invites" ADD CONSTRAINT "member_invites_accepted_by_id_user_id_fk" FOREIGN KEY ("accepted_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "member_invites" ADD CONSTRAINT "member_invites_linked_team_member_id_team_members_id_fk" FOREIGN KEY ("linked_team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "member_invites_token_hash_unique" ON "member_invites" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "idx_member_invites_email" ON "member_invites" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "idx_member_invites_invited_by" ON "member_invites" USING btree ("invited_by_id");
--> statement-breakpoint
CREATE INDEX "idx_member_invites_accepted_by" ON "member_invites" USING btree ("accepted_by_id");

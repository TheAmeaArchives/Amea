import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    emailUniqueIdx: uniqueIndex("user_email_unique").on(table.email),
  }),
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tokenUniqueIdx: uniqueIndex("session_token_unique").on(table.token),
    userIdIdx: index("session_user_id_idx").on(table.userId),
  }),
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    providerAccountUniqueIdx: uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }),
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  }),
);

export const adminProfiles = pgTable("admin_profiles", {
  id: text("id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminInvites = pgTable(
  "admin_invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    role: text("role").notNull(),
    permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
    tokenHash: text("token_hash").notNull(),
    invitedById: text("invited_by_id")
      .notNull()
      .references(() => adminProfiles.id, { onDelete: "cascade" }),
    acceptedById: text("accepted_by_id").references(() => user.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashUniqueIdx: uniqueIndex("admin_invites_token_hash_unique").on(table.tokenHash),
    emailIdx: index("idx_admin_invites_email").on(table.email),
    invitedByIdx: index("idx_admin_invites_invited_by").on(table.invitedById),
    acceptedByIdx: index("idx_admin_invites_accepted_by").on(table.acceptedById),
  }),
);

export const memberProfiles = pgTable(
  "member_profiles",
  {
    id: text("id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    username: text("username").notNull(),
    bio: text("bio"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    usernameUniqueIdx: uniqueIndex("member_profiles_username_unique").on(table.username),
    emailIdx: index("idx_member_profiles_email").on(table.email),
  }),
);

export const memberInvites = pgTable(
  "member_invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    role: text("role").notNull(),
    memberType: text("member_type").notNull().default("team"),
    tokenHash: text("token_hash").notNull(),
    invitedById: text("invited_by_id")
      .notNull()
      .references(() => adminProfiles.id, { onDelete: "cascade" }),
    acceptedById: text("accepted_by_id").references(() => user.id, { onDelete: "set null" }),
    linkedTeamMemberId: uuid("linked_team_member_id").references(() => teamMembers.id, {
      onDelete: "set null",
    }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashUniqueIdx: uniqueIndex("member_invites_token_hash_unique").on(table.tokenHash),
    emailIdx: index("idx_member_invites_email").on(table.email),
    invitedByIdx: index("idx_member_invites_invited_by").on(table.invitedById),
    acceptedByIdx: index("idx_member_invites_accepted_by").on(table.acceptedById),
  }),
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: jsonb("content").$type<unknown>(),
    coverImageUrl: text("cover_image_url"),
    published: boolean("published").notNull().default(false),
    authorId: text("author_id").references(() => adminProfiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("idx_blog_posts_slug").on(table.slug),
    publishedIdx: index("idx_blog_posts_published").on(table.published),
  }),
);

export const experiments = pgTable(
  "experiments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    content: jsonb("content").$type<unknown>(),
    imageUrl: text("image_url"),
    curator: text("curator"),
    editor: text("editor"),
    chamber: text("chamber").notNull().default("i"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("idx_experiments_slug").on(table.slug),
    publishedIdx: index("idx_experiments_published").on(table.published),
  }),
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberProfileId: text("member_profile_id").references(() => memberProfiles.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    role: text("role"),
    bio: text("bio"),
    imageUrl: text("image_url"),
    memberType: text("member_type").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    memberProfileUniqueIdx: uniqueIndex("team_members_member_profile_unique").on(table.memberProfileId),
    memberTypeIdx: index("idx_team_members_type").on(table.memberType),
    orderIdx: index("idx_team_members_order").on(table.orderIndex),
  }),
);

export const contributors = pgTable("contributors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contributorArticles = pgTable("contributor_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  contributorId: uuid("contributor_id")
    .notNull()
    .references(() => contributors.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    videoUrl: text("video_url"),
    featured: boolean("featured").notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("idx_gallery_items_order").on(table.orderIndex),
  }),
);

export const programs = pgTable(
  "programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    iconType: text("icon_type"),
    featured: boolean("featured").notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("idx_programs_order").on(table.orderIndex),
  }),
);

export const supporters = pgTable(
  "supporters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("idx_supporters_order").on(table.orderIndex),
  }),
);

export const chamberStats = pgTable("chamber_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  chamber: text("chamber").notNull().default("ii"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chamberBeliefs = pgTable("chamber_beliefs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  chamber: text("chamber").notNull().default("ii"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chamberContent = pgTable("chamber_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  chamber: text("chamber").notNull(),
  section: text("section").notNull(),
  content: text("content"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteContentEntries = pgTable(
  "site_content",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    value: text("value"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    keyUniqueIdx: uniqueIndex("idx_site_content_key").on(table.key),
  }),
);

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    readIdx: index("idx_contact_submissions_read").on(table.read),
  }),
);

export const volunteerSubmissions = pgTable("volunteer_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const contributorRelations = relations(contributors, ({ many }) => ({
  articles: many(contributorArticles),
}));

export const contributorArticleRelations = relations(contributorArticles, ({ one }) => ({
  contributor: one(contributors, {
    fields: [contributorArticles.contributorId],
    references: [contributors.id],
  }),
}));

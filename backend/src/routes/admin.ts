import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, asc, desc, eq, isNull, ne, or, sql } from "drizzle-orm";
import type { Request } from "express";
import { Router } from "express";
import multer, { MulterError } from "multer";
import { z } from "zod";
import { env } from "../config/env.js";
import { db } from "../db/index.js";
import {
  adminInvites,
  adminProfiles,
  blogPosts,
  chamberBeliefs,
  chamberContent,
  chamberStats,
  contactSubmissions,
  contributors,
  experiments,
  galleryItems,
  memberInvites,
  memberProfiles,
  programs,
  siteContentEntries,
  supporters,
  teamMembers,
  user,
  volunteerSubmissions,
} from "../db/schema.js";
import { auth } from "../auth/index.js";
import { fromNodeHeaders } from "better-auth/node";
import { sendTransactionalEmail } from "../email/transactional.js";
import {
  adminPermissions,
  requireAnyAdminPermission,
  requireAdminPermission,
  requireAdminProfile,
  requireSession,
  requireSuperAdmin,
  type AuthenticatedRequest,
} from "../middleware/admin-auth.js";
import { isS3StorageConfigured, uploadImageToS3 } from "../storage/s3.js";
import { parseInteger, sendData, sendError } from "../utils/http.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.UPLOAD_VIDEO_MAX_BYTES,
  },
});

const imageUploadPermissions = [
  "blog",
  "experiments",
  "team",
  "gallery",
  "programs",
  "supporters",
  "site_content",
  "chambers",
] as const;

const videoUploadPermissions = ["gallery"] as const;

const adminProfileSchema = z.object({
  id: z.string().trim().min(1).optional(),
  email: z.string().trim().email(),
  full_name: z.string().trim().min(1),
  name: z.string().trim().min(1).optional(),
  role: z.enum(["super_admin", "admin"]),
  permissions: z.array(z.string()).optional(),
  avatar_url: z.string().trim().optional().nullable(),
  is_active: z.boolean().optional(),
});

const adminProfileUpdateSchema = z.object({
  email: z.string().trim().email().optional(),
  full_name: z.string().trim().min(1).optional(),
  role: z.enum(["super_admin", "admin"]).optional(),
  permissions: z.array(z.string()).optional(),
  avatar_url: z.string().trim().optional().nullable(),
  is_active: z.boolean().optional(),
});

const adminInviteSchema = z.object({
  email: z.string().trim().email(),
  full_name: z.string().trim().min(1),
  role: z.enum(["super_admin", "admin"]),
  permissions: z.array(z.string()).optional(),
  expires_in_days: z.coerce.number().int().min(1).max(30).optional(),
});

const memberInviteSchema = z.object({
  email: z.string().trim().email(),
  full_name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  member_type: z.enum(["team", "collaborator"]).optional(),
  expires_in_days: z.coerce.number().int().min(1).max(30).optional(),
});

const activeToggleSchema = z.object({
  is_active: z.boolean(),
});

const publishToggleSchema = z.object({
  published: z.boolean(),
});

const featuredToggleSchema = z.object({
  featured: z.boolean().optional(),
});

const readToggleSchema = z.object({
  read: z.boolean(),
});

const volunteerStatusSchema = z.object({
  status: z.enum(["pending", "contacted", "accepted", "rejected"]),
});

const blogPayloadSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.unknown().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  published: z.boolean().optional(),
  author_id: z.string().optional().nullable(),
});

const experimentPayloadSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  content: z.unknown().optional().nullable(),
  image_url: z.string().optional().nullable(),
  curator: z.string().optional().nullable(),
  editor: z.string().optional().nullable(),
  chamber: z.string().trim().min(1).optional(),
  published: z.boolean().optional(),
});

const teamMemberPayloadSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  member_type: z.enum(["team", "collaborator"]),
  order_index: z.number().int().optional(),
});

const contributorPayloadSchema = z.object({
  name: z.string().trim().min(1),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

const supporterPayloadSchema = z.object({
  name: z.string().trim().min(1),
  logo_url: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
  order_index: z.number().int().optional(),
});

const chamberStatPayloadSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
  chamber: z.string().trim().min(1).optional(),
  order_index: z.number().int().optional(),
});

const chamberBeliefPayloadSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().optional().nullable(),
  chamber: z.string().trim().min(1).optional(),
  order_index: z.number().int().optional(),
});

const chamberContentPayloadSchema = z.object({
  chamber: z.string().trim().min(1),
  section: z.string().trim().min(1),
  content: z.string().optional().nullable(),
});

const programPayloadSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  icon_type: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  order_index: z.number().int().optional(),
});

const galleryPayloadSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  order_index: z.number().int().optional(),
});

const siteContentPayloadSchema = z.object({
  value: z.string().optional().nullable(),
});

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

function resolveInviteBaseUrl(): string {
  if (env.BETTER_AUTH_URL) {
    const authUrl = new URL(env.BETTER_AUTH_URL);
    return authUrl.origin;
  }

  const host = env.HOST === "0.0.0.0" ? "127.0.0.1" : env.HOST;
  return `http://${host}:3000`;
}

function buildInviteLink(token: string): string {
  const baseUrl = resolveInviteBaseUrl().replace(/\/$/, "");
  return `${baseUrl}/invite/${encodeURIComponent(token)}`;
}

function buildMemberInviteLink(token: string): string {
  const baseUrl = resolveInviteBaseUrl().replace(/\/$/, "");
  return `${baseUrl}/join/${encodeURIComponent(token)}`;
}

function getInviteStatus(invite: typeof adminInvites.$inferSelect): "pending" | "accepted" | "revoked" | "expired" {
  if (invite.acceptedAt) return "accepted";
  if (invite.revokedAt) return "revoked";
  if (invite.expiresAt.getTime() <= Date.now()) return "expired";
  return "pending";
}

function serializeAdminInvite(invite: typeof adminInvites.$inferSelect) {
  return {
    id: invite.id,
    email: invite.email,
    full_name: invite.fullName,
    role: invite.role,
    permissions: invite.permissions,
    invited_by_id: invite.invitedById,
    accepted_by_id: invite.acceptedById,
    expires_at: invite.expiresAt.toISOString(),
    accepted_at: invite.acceptedAt?.toISOString() ?? null,
    revoked_at: invite.revokedAt?.toISOString() ?? null,
    created_at: invite.createdAt.toISOString(),
    updated_at: invite.updatedAt.toISOString(),
    status: getInviteStatus(invite),
  };
}

function getMemberInviteStatus(invite: typeof memberInvites.$inferSelect): "pending" | "accepted" | "revoked" | "expired" {
  if (invite.acceptedAt) return "accepted";
  if (invite.revokedAt) return "revoked";
  if (invite.expiresAt.getTime() <= Date.now()) return "expired";
  return "pending";
}

function serializeMemberInvite(invite: typeof memberInvites.$inferSelect) {
  return {
    id: invite.id,
    email: invite.email,
    full_name: invite.fullName,
    role: invite.role,
    member_type: invite.memberType as "team" | "collaborator",
    invited_by_id: invite.invitedById,
    accepted_by_id: invite.acceptedById,
    linked_team_member_id: invite.linkedTeamMemberId,
    expires_at: invite.expiresAt.toISOString(),
    accepted_at: invite.acceptedAt?.toISOString() ?? null,
    revoked_at: invite.revokedAt?.toISOString() ?? null,
    created_at: invite.createdAt.toISOString(),
    updated_at: invite.updatedAt.toISOString(),
    status: getMemberInviteStatus(invite),
  };
}

async function findInviteByToken(token: string): Promise<typeof adminInvites.$inferSelect | null> {
  const [invite] = await db
    .select()
    .from(adminInvites)
    .where(eq(adminInvites.tokenHash, hashInviteToken(token)))
    .limit(1);

  return invite ?? null;
}

async function findMemberInviteByToken(token: string): Promise<typeof memberInvites.$inferSelect | null> {
  const [invite] = await db
    .select()
    .from(memberInvites)
    .where(eq(memberInvites.tokenHash, hashInviteToken(token)))
    .limit(1);

  return invite ?? null;
}

async function ensureInvitedUserExists(input: { email: string; fullName: string }): Promise<void> {
  const normalizedEmail = normalizeEmail(input.email);
  const [existingUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(sql`lower(${user.email}) = ${normalizedEmail}`)
    .limit(1);

  if (existingUser) {
    return;
  }

  await db.insert(user).values({
    id: randomUUID(),
    name: input.fullName,
    email: normalizedEmail,
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

function slugifyUsernameSeed(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "member";
}

async function generateUniqueMemberUsername(fullName: string, email: string): Promise<string> {
  const emailSeed = email.split("@")[0] ?? "";
  const base = slugifyUsernameSeed(fullName || emailSeed || "member");

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}_${attempt + 1}`;
    const [existing] = await db
      .select({ id: memberProfiles.id })
      .from(memberProfiles)
      .where(eq(memberProfiles.username, candidate))
      .limit(1);

    if (!existing) {
      return candidate;
    }
  }

  return `${base}_${randomUUID().slice(0, 8)}`;
}

async function sendAdminInviteEmail(input: {
  email: string;
  fullName: string;
  role: "super_admin" | "admin";
  inviteLink: string;
  expiresAt: Date;
}): Promise<void> {
  await sendTransactionalEmail({
    to: input.email,
    subject: "You’ve been invited to join the AMEA admin platform",
    text: [
      `You’ve been invited to join the AMEA admin platform as a ${input.role === "super_admin" ? "Super Admin" : "Admin"}.`,
      `Open this link to accept the invite: ${input.inviteLink}`,
      `This invite expires on ${input.expiresAt.toUTCString()}.`,
    ].join("\n\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin: 0 0 12px;">You’ve been invited to join AMEA</h2>
        <p style="margin: 0 0 12px;">${input.fullName}, you’ve been invited to join the admin platform as a <strong>${input.role === "super_admin" ? "Super Admin" : "Admin"}</strong>.</p>
        <p style="margin: 0 0 20px;">
          <a href="${input.inviteLink}" style="display: inline-block; padding: 12px 18px; background: #111827; color: #fff; text-decoration: none; border-radius: 8px;">
            Accept invite
          </a>
        </p>
        <p style="margin: 0 0 8px;">If the button doesn’t work, open this link:</p>
        <p style="margin: 0 0 16px; word-break: break-all;">
          <a href="${input.inviteLink}">${input.inviteLink}</a>
        </p>
        <p style="margin: 0; color: #4b5563;">This invite expires on ${input.expiresAt.toUTCString()}.</p>
      </div>
    `,
  });
}

async function sendMemberInviteEmail(input: {
  email: string;
  fullName: string;
  role: string;
  inviteLink: string;
  expiresAt: Date;
}): Promise<void> {
  await sendTransactionalEmail({
    to: input.email,
    subject: "You’ve been invited to join the AMEA platform",
    text: [
      `You’ve been invited to join the AMEA platform as ${input.fullName}.`,
      `Role: ${input.role}.`,
      `Open this link to accept the invite: ${input.inviteLink}`,
      `This invite expires on ${input.expiresAt.toUTCString()}.`,
    ].join("\n\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin: 0 0 12px;">You’ve been invited to join AMEA</h2>
        <p style="margin: 0 0 12px;">${input.fullName}, you’ve been invited to join the platform.</p>
        <p style="margin: 0 0 12px;">Your team role is <strong>${input.role}</strong>.</p>
        <p style="margin: 0 0 20px;">
          <a href="${input.inviteLink}" style="display: inline-block; padding: 12px 18px; background: #111827; color: #fff; text-decoration: none; border-radius: 8px;">
            Accept invite
          </a>
        </p>
        <p style="margin: 0 0 8px;">If the button doesn’t work, open this link:</p>
        <p style="margin: 0 0 16px; word-break: break-all;">
          <a href="${input.inviteLink}">${input.inviteLink}</a>
        </p>
        <p style="margin: 0; color: #4b5563;">This invite expires on ${input.expiresAt.toUTCString()}.</p>
      </div>
    `,
  });
}

function parseUnknownContent(value: unknown): unknown | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return trimmed;
    }
  }

  return value;
}

function cleanVideoUrl(input: string | null): string | null {
  if (!input || input.trim() === "") {
    return null;
  }

  const trimmed = input.trim();

  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    if (srcMatch?.[1]) {
      return srcMatch[1];
    }
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

function toPermissionList(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item): item is string => item.length > 0 && adminPermissions.includes(item as never));
}

function parseBodyWithNumericCoercion(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {};
  }

  const source = body as Record<string, unknown>;

  return {
    ...source,
    order_index: parseInteger(source.order_index, 0),
    published: parseBoolean(source.published, false),
    featured: parseBoolean(source.featured, false),
    is_active: parseBoolean(source.is_active, true),
    read: parseBoolean(source.read, false),
  };
}

function getAuthenticatedUserId(req: Request): string | null {
  const authReq = req as AuthenticatedRequest;
  return authReq.authUser?.id ?? null;
}

function getAuthenticatedAdmin(req: Request) {
  const authReq = req as AuthenticatedRequest;
  return authReq.adminProfile ?? null;
}

function pathParam(req: Request, key: string): string {
  const value = req.params?.[key];
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return typeof value === "string" ? value : "";
}

function normalizeUploadFolder(folder: unknown, fallbackFolder: string): string {
  if (typeof folder !== "string") {
    return fallbackFolder;
  }

  const normalized = folder
    .trim()
    .replace(/\\/g, "/")
    .replace(/(^\/+|\/+$)/g, "")
    .replace(/\.\.+/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "");

  return normalized.length > 0 ? normalized : fallbackFolder;
}

function getUploadsBaseUrl(req: Request): string {
  if (env.UPLOAD_PUBLIC_BASE_URL) {
    return env.UPLOAD_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  const forwardedProto = req.header("x-forwarded-proto");
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost ?? req.header("host") ?? `127.0.0.1:${env.PORT}`;
  const protocol = forwardedProto ?? req.protocol;

  return `${protocol}://${host}/uploads`;
}

function getUploadsRootDir(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIRECTORY);
}

async function saveLocalUploadFile(req: Request, file: Express.Multer.File, fallbackFolder: string): Promise<{
  key: string;
  url: string;
  mimeType: string;
  size: number;
}> {
  const rootDir = getUploadsRootDir();
  const folder = normalizeUploadFolder(req.body.folder, fallbackFolder);
  const ext = path.extname(file.originalname || "");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  const key = `${folder}/${filename}`;
  const absolutePath = path.resolve(rootDir, key);

  if (!(absolutePath === rootDir || absolutePath.startsWith(`${rootDir}${path.sep}`))) {
    throw new Error("Invalid upload path.");
  }

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, file.buffer);

  const encodedPath = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return {
    key,
    url: `${getUploadsBaseUrl(req)}/${encodedPath}`,
    mimeType: file.mimetype,
    size: file.size,
  };
}

async function countAll(): Promise<{
  blogCount: number;
  experimentCount: number;
  teamCount: number;
  galleryCount: number;
  unreadContactCount: number;
  pendingVolunteerCount: number;
}> {
  const [blogRow, experimentRow, teamRow, galleryRow, unreadContactRow, pendingVolunteerRow] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(blogPosts),
    db.select({ count: sql<number>`count(*)::int` }).from(experiments),
    db.select({ count: sql<number>`count(*)::int` }).from(teamMembers),
    db.select({ count: sql<number>`count(*)::int` }).from(galleryItems),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.read, false)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(volunteerSubmissions)
      .where(eq(volunteerSubmissions.status, "pending")),
  ]);

  return {
    blogCount: blogRow[0]?.count ?? 0,
    experimentCount: experimentRow[0]?.count ?? 0,
    teamCount: teamRow[0]?.count ?? 0,
    galleryCount: galleryRow[0]?.count ?? 0,
    unreadContactCount: unreadContactRow[0]?.count ?? 0,
    pendingVolunteerCount: pendingVolunteerRow[0]?.count ?? 0,
  };
}

export const adminRouter = Router();

adminRouter.get("/public/admin-invites/:token", async (req, res) => {
  const invite = await findInviteByToken(pathParam(req, "token"));
  if (!invite) {
    sendError(res, 404, "NOT_FOUND", "Invite not found.");
    return;
  }

  sendData(res, {
    ...serializeAdminInvite(invite),
    invitee_email: invite.email,
  });
});

adminRouter.post("/public/admin-invites/:token/accept", async (req, res) => {
  const invite = await findInviteByToken(pathParam(req, "token"));
  if (!invite) {
    sendError(res, 404, "NOT_FOUND", "Invite not found.");
    return;
  }

  const status = getInviteStatus(invite);
  if (status === "revoked") {
    sendError(res, 410, "INVITE_REVOKED", "This invite has been revoked.");
    return;
  }

  if (status === "accepted") {
    sendError(res, 409, "INVITE_ACCEPTED", "This invite has already been accepted.");
    return;
  }

  if (status === "expired") {
    sendError(res, 410, "INVITE_EXPIRED", "This invite has expired.");
    return;
  }

  const sessionResult = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const sessionUser = sessionResult?.user;
  if (!sessionUser) {
    sendError(res, 401, "UNAUTHORIZED", "You must sign in with the invited email first.");
    return;
  }

  const sessionEmail = normalizeEmail(sessionUser.email ?? "");
  if (sessionEmail !== normalizeEmail(invite.email)) {
    sendError(
      res,
      403,
      "INVITE_EMAIL_MISMATCH",
      "This invite must be accepted with the invited email address.",
    );
    return;
  }

  const acceptedAt = new Date();

  const createdProfile = await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        name: invite.fullName,
        email: normalizeEmail(invite.email),
        updatedAt: acceptedAt,
      })
      .where(eq(user.id, sessionUser.id));

    const [profile] = await tx
      .insert(adminProfiles)
      .values({
        id: sessionUser.id,
        email: normalizeEmail(invite.email),
        fullName: invite.fullName,
        role: invite.role,
        permissions: invite.role === "super_admin" ? [] : invite.permissions,
        avatarUrl: sessionUser.image ?? null,
        isActive: true,
        createdAt: acceptedAt,
        updatedAt: acceptedAt,
      })
      .onConflictDoUpdate({
        target: adminProfiles.id,
        set: {
          email: normalizeEmail(invite.email),
          fullName: invite.fullName,
          role: invite.role,
          permissions: invite.role === "super_admin" ? [] : invite.permissions,
          avatarUrl: sessionUser.image ?? null,
          isActive: true,
          updatedAt: acceptedAt,
        },
      })
      .returning();

    await tx
      .update(adminInvites)
      .set({
        acceptedAt,
        acceptedById: sessionUser.id,
        updatedAt: acceptedAt,
      })
      .where(eq(adminInvites.id, invite.id));

    return profile;
  });

  sendData(res, createdProfile);
});

adminRouter.get("/public/member-invites/:token", async (req, res) => {
  const invite = await findMemberInviteByToken(pathParam(req, "token"));
  if (!invite) {
    sendError(res, 404, "NOT_FOUND", "Invite not found.");
    return;
  }

  sendData(res, {
    ...serializeMemberInvite(invite),
    invitee_email: invite.email,
  });
});

adminRouter.post("/public/member-invites/:token/accept", async (req, res) => {
  const invite = await findMemberInviteByToken(pathParam(req, "token"));
  if (!invite) {
    sendError(res, 404, "NOT_FOUND", "Invite not found.");
    return;
  }

  const status = getMemberInviteStatus(invite);
  if (status === "revoked") {
    sendError(res, 410, "INVITE_REVOKED", "This invite has been revoked.");
    return;
  }

  if (status === "accepted") {
    sendError(res, 409, "INVITE_ACCEPTED", "This invite has already been accepted.");
    return;
  }

  if (status === "expired") {
    sendError(res, 410, "INVITE_EXPIRED", "This invite has expired.");
    return;
  }

  const sessionResult = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const sessionUser = sessionResult?.user;
  if (!sessionUser) {
    sendError(res, 401, "UNAUTHORIZED", "You must sign in with the invited email first.");
    return;
  }

  const sessionEmail = normalizeEmail(sessionUser.email ?? "");
  if (sessionEmail !== normalizeEmail(invite.email)) {
    sendError(
      res,
      403,
      "INVITE_EMAIL_MISMATCH",
      "This invite must be accepted with the invited email address.",
    );
    return;
  }

  const acceptedAt = new Date();
  const username = await generateUniqueMemberUsername(invite.fullName, invite.email);

  const result = await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        name: invite.fullName,
        email: normalizeEmail(invite.email),
        updatedAt: acceptedAt,
      })
      .where(eq(user.id, sessionUser.id));

    const [memberProfile] = await tx
      .insert(memberProfiles)
      .values({
        id: sessionUser.id,
        email: normalizeEmail(invite.email),
        fullName: invite.fullName,
        username,
        bio: null,
        imageUrl: sessionUser.image ?? null,
        isActive: true,
        createdAt: acceptedAt,
        updatedAt: acceptedAt,
      })
      .onConflictDoUpdate({
        target: memberProfiles.id,
        set: {
          email: normalizeEmail(invite.email),
          fullName: invite.fullName,
          isActive: true,
          updatedAt: acceptedAt,
        },
      })
      .returning();

    let linkedTeamMemberId = invite.linkedTeamMemberId;

    if (linkedTeamMemberId) {
      await tx
        .update(teamMembers)
        .set({
          memberProfileId: memberProfile.id,
          name: invite.fullName,
          role: invite.role,
          updatedAt: acceptedAt,
        })
        .where(eq(teamMembers.id, linkedTeamMemberId));
    } else {
      const [teamMember] = await tx
        .insert(teamMembers)
        .values({
          memberProfileId: memberProfile.id,
          name: invite.fullName,
          role: invite.role,
          bio: null,
          imageUrl: memberProfile.imageUrl,
          memberType: invite.memberType,
          orderIndex: 0,
          createdAt: acceptedAt,
          updatedAt: acceptedAt,
        })
        .returning();

      linkedTeamMemberId = teamMember.id;
    }

    await tx
      .update(memberInvites)
      .set({
        acceptedAt,
        acceptedById: sessionUser.id,
        linkedTeamMemberId,
        updatedAt: acceptedAt,
      })
      .where(eq(memberInvites.id, invite.id));

    return {
      memberProfile,
      linked_team_member_id: linkedTeamMemberId,
    };
  });

  sendData(res, result);
});

adminRouter.use(requireSession);
adminRouter.use(requireAdminProfile);

adminRouter.get("/current-admin/profile", (req, res) => {
  const profile = getAuthenticatedAdmin(req);
  if (!profile) {
    sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
    return;
  }

  sendData(res, profile);
});

adminRouter.get("/dashboard/stats", async (_req, res) => {
  sendData(res, await countAll());
});

adminRouter.get("/admin-profiles/current", (req, res) => {
  const profile = getAuthenticatedAdmin(req);
  if (!profile) {
    sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
    return;
  }

  sendData(res, profile);
});

adminRouter.get("/admin-profiles", requireSuperAdmin, async (_req, res) => {
  const rows = await db.select().from(adminProfiles).orderBy(asc(adminProfiles.createdAt));
  sendData(res, rows);
});

adminRouter.patch("/admin-profiles/:id", requireSuperAdmin, async (req, res) => {
  const parsed = adminProfileUpdateSchema.safeParse({
    ...req.body,
    is_active:
      req.body?.is_active === undefined ? undefined : parseBoolean(req.body?.is_active, true),
    permissions: req.body?.permissions === undefined ? undefined : toPermissionList(req.body.permissions),
  });

  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid admin profile payload.");
    return;
  }

  const updates: Partial<typeof adminProfiles.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.data.email !== undefined) updates.email = normalizeEmail(parsed.data.email);
  if (parsed.data.full_name !== undefined) updates.fullName = parsed.data.full_name;
  if (parsed.data.role !== undefined) updates.role = parsed.data.role;
  if (parsed.data.permissions !== undefined) updates.permissions = toPermissionList(parsed.data.permissions);
  if (parsed.data.avatar_url !== undefined) updates.avatarUrl = parseOptionalString(parsed.data.avatar_url);
  if (parsed.data.is_active !== undefined) updates.isActive = parsed.data.is_active;

  const [updated] = await db
    .update(adminProfiles)
    .set(updates)
    .where(eq(adminProfiles.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Admin profile not found.");
    return;
  }

  if (updates.email !== undefined) {
    await db
      .update(user)
      .set({
        email: updates.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, updated.id));
  }

  sendData(res, updated);
});

adminRouter.get("/admin-invites", requireSuperAdmin, async (_req, res) => {
  const rows = await db.select().from(adminInvites).orderBy(desc(adminInvites.createdAt));
  sendData(
    res,
    rows.map((invite) => serializeAdminInvite(invite)),
  );
});

adminRouter.post("/admin-invites", requireSuperAdmin, async (req, res) => {
  const parsed = adminInviteSchema.safeParse({
    ...req.body,
    permissions: toPermissionList(req.body?.permissions),
    expires_in_days: req.body?.expires_in_days,
  });

  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid admin invite payload.");
    return;
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const existingAdmin = await db
    .select({ id: adminProfiles.id })
    .from(adminProfiles)
    .where(sql`lower(${adminProfiles.email}) = ${normalizedEmail}`)
    .limit(1);

  if (existingAdmin[0]) {
    sendError(res, 409, "CONFLICT", "This email already has an admin account.");
    return;
  }

  const pendingInvite = await db
    .select({ id: adminInvites.id })
    .from(adminInvites)
    .where(
      and(
        sql`lower(${adminInvites.email}) = ${normalizedEmail}`,
        isNull(adminInvites.acceptedAt),
        isNull(adminInvites.revokedAt),
        sql`${adminInvites.expiresAt} > now()`,
      ),
    )
    .limit(1);

  if (pendingInvite[0]) {
    sendError(res, 409, "CONFLICT", "This email already has a pending invite.");
    return;
  }

  const requesterId = getAuthenticatedUserId(req);
  if (!requesterId) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const expiresInDays = parsed.data.expires_in_days ?? 7;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  const token = createInviteToken();
  const inviteLink = buildInviteLink(token);
  let createdInviteId: string | null = null;

  try {
    await ensureInvitedUserExists({
      email: normalizedEmail,
      fullName: parsed.data.full_name,
    });

    const [created] = await db
      .insert(adminInvites)
      .values({
        email: normalizedEmail,
        fullName: parsed.data.full_name,
        role: parsed.data.role,
        permissions: parsed.data.role === "super_admin" ? [] : toPermissionList(parsed.data.permissions),
        tokenHash: hashInviteToken(token),
        invitedById: requesterId,
        expiresAt,
        updatedAt: new Date(),
      })
      .returning();
    createdInviteId = created.id;

    await sendAdminInviteEmail({
      email: normalizedEmail,
      fullName: parsed.data.full_name,
      role: parsed.data.role,
      inviteLink,
      expiresAt,
    });

    sendData(res, serializeAdminInvite(created), 201);
  } catch (error) {
    console.error("Failed to create admin invite:", error);
    if (createdInviteId) {
      await db.delete(adminInvites).where(eq(adminInvites.id, createdInviteId));
    }
    sendError(res, 500, "INVITE_ERROR", "Failed to create and send the admin invite.");
  }
});

adminRouter.post("/admin-invites/:id/revoke", requireSuperAdmin, async (req, res) => {
  const [updated] = await db
    .update(adminInvites)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminInvites.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Admin invite not found.");
    return;
  }

  sendData(res, serializeAdminInvite(updated));
});

adminRouter.get("/member-invites", requireAdminPermission("team"), async (_req, res) => {
  const rows = await db.select().from(memberInvites).orderBy(desc(memberInvites.createdAt));
  sendData(
    res,
    rows.map((invite) => serializeMemberInvite(invite)),
  );
});

adminRouter.post("/member-invites", requireAdminPermission("team"), async (req, res) => {
  const parsed = memberInviteSchema.safeParse({
    ...req.body,
    expires_in_days: req.body?.expires_in_days,
  });

  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid member invite payload.");
    return;
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const existingProfile = await db
    .select({ id: memberProfiles.id })
    .from(memberProfiles)
    .where(sql`lower(${memberProfiles.email}) = ${normalizedEmail}`)
    .limit(1);

  if (existingProfile[0]) {
    sendError(res, 409, "CONFLICT", "This email already has a member account.");
    return;
  }

  const existingPendingInvite = await db
    .select({ id: memberInvites.id })
    .from(memberInvites)
    .where(
      and(
        sql`lower(${memberInvites.email}) = ${normalizedEmail}`,
        isNull(memberInvites.acceptedAt),
        isNull(memberInvites.revokedAt),
        sql`${memberInvites.expiresAt} > now()`,
      ),
    )
    .limit(1);

  if (existingPendingInvite[0]) {
    sendError(res, 409, "CONFLICT", "This email already has a pending member invite.");
    return;
  }

  const requesterId = getAuthenticatedUserId(req);
  if (!requesterId) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const expiresInDays = parsed.data.expires_in_days ?? 7;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  const token = createInviteToken();
  const inviteLink = buildMemberInviteLink(token);
  let createdInviteId: string | null = null;

  try {
    await ensureInvitedUserExists({
      email: normalizedEmail,
      fullName: parsed.data.full_name,
    });

    const [created] = await db
      .insert(memberInvites)
      .values({
        email: normalizedEmail,
        fullName: parsed.data.full_name,
        role: parsed.data.role,
        memberType: parsed.data.member_type ?? "team",
        tokenHash: hashInviteToken(token),
        invitedById: requesterId,
        expiresAt,
        updatedAt: new Date(),
      })
      .returning();

    createdInviteId = created.id;

    await sendMemberInviteEmail({
      email: normalizedEmail,
      fullName: parsed.data.full_name,
      role: parsed.data.role,
      inviteLink,
      expiresAt,
    });

    sendData(res, serializeMemberInvite(created), 201);
  } catch (error) {
    console.error("Failed to create member invite:", error);
    if (createdInviteId) {
      await db.delete(memberInvites).where(eq(memberInvites.id, createdInviteId));
    }
    sendError(res, 500, "INVITE_ERROR", "Failed to create and send the member invite.");
  }
});

adminRouter.post("/member-invites/:id/revoke", requireAdminPermission("team"), async (req, res) => {
  const [updated] = await db
    .update(memberInvites)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(memberInvites.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Member invite not found.");
    return;
  }

  sendData(res, serializeMemberInvite(updated));
});

adminRouter.patch("/admin-profiles/:id/active", requireSuperAdmin, async (req, res) => {
  const parsed = activeToggleSchema.safeParse({
    is_active: parseBoolean(req.body?.is_active, false),
  });

  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "is_active must be provided.");
    return;
  }

  const requesterId = getAuthenticatedUserId(req);
  if (!parsed.data.is_active && requesterId === pathParam(req, "id")) {
    sendError(res, 400, "INVALID_REQUEST", "Cannot deactivate yourself.");
    return;
  }

  const [updated] = await db
    .update(adminProfiles)
    .set({
      isActive: parsed.data.is_active,
      updatedAt: new Date(),
    })
    .where(eq(adminProfiles.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Admin profile not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.get("/blog-posts", requireAdminPermission("blog"), async (_req, res) => {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  sendData(res, rows);
});

adminRouter.post("/blog-posts", requireAdminPermission("blog"), async (req, res) => {
  const parsed = blogPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid blog post payload.");
    return;
  }

  const profile = getAuthenticatedAdmin(req);

  const [created] = await db
    .insert(blogPosts)
    .values({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parseOptionalString(parsed.data.excerpt),
      content: parseUnknownContent(parsed.data.content),
      coverImageUrl: parseOptionalString(parsed.data.cover_image_url),
      published: parsed.data.published ?? false,
      authorId: parsed.data.author_id ?? profile?.id ?? null,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.get("/blog-posts/:id", requireAdminPermission("blog"), async (req, res) => {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, pathParam(req, "id"))).limit(1);
  if (!row) {
    sendError(res, 404, "NOT_FOUND", "Blog post not found.");
    return;
  }

  sendData(res, row);
});

adminRouter.patch("/blog-posts/:id", requireAdminPermission("blog"), async (req, res) => {
  const parsed = blogPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid blog post payload.");
    return;
  }

  const updates: Partial<typeof blogPosts.$inferInsert> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.slug !== undefined) updates.slug = parsed.data.slug;
  if (parsed.data.excerpt !== undefined) updates.excerpt = parseOptionalString(parsed.data.excerpt);
  if (parsed.data.content !== undefined) updates.content = parseUnknownContent(parsed.data.content);
  if (parsed.data.cover_image_url !== undefined) {
    updates.coverImageUrl = parseOptionalString(parsed.data.cover_image_url);
  }
  if (parsed.data.published !== undefined) updates.published = parsed.data.published;
  if (parsed.data.author_id !== undefined) updates.authorId = parsed.data.author_id;

  const [updated] = await db
    .update(blogPosts)
    .set(updates)
    .where(eq(blogPosts.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Blog post not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.patch("/blog-posts/:id/published", requireAdminPermission("blog"), async (req, res) => {
  const parsed = publishToggleSchema.safeParse({
    published: parseBoolean(req.body?.published, false),
  });

  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "published must be provided.");
    return;
  }

  const [updated] = await db
    .update(blogPosts)
    .set({
      published: parsed.data.published,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Blog post not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/blog-posts/:id", requireAdminPermission("blog"), async (req, res) => {
  const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, pathParam(req, "id"))).returning();

  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Blog post not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/experiments", requireAdminPermission("experiments"), async (_req, res) => {
  const rows = await db.select().from(experiments).orderBy(desc(experiments.createdAt));
  sendData(res, rows);
});

adminRouter.post("/experiments", requireAdminPermission("experiments"), async (req, res) => {
  const parsed = experimentPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid experiment payload.");
    return;
  }

  const [created] = await db
    .insert(experiments)
    .values({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parseOptionalString(parsed.data.description),
      content: parseUnknownContent(parsed.data.content),
      imageUrl: parseOptionalString(parsed.data.image_url),
      curator: parseOptionalString(parsed.data.curator),
      editor: parseOptionalString(parsed.data.editor),
      chamber: parseOptionalString(parsed.data.chamber) ?? "i",
      published: parsed.data.published ?? false,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.get("/experiments/:id", requireAdminPermission("experiments"), async (req, res) => {
  const [row] = await db.select().from(experiments).where(eq(experiments.id, pathParam(req, "id"))).limit(1);
  if (!row) {
    sendError(res, 404, "NOT_FOUND", "Experiment not found.");
    return;
  }

  sendData(res, row);
});

adminRouter.patch("/experiments/:id", requireAdminPermission("experiments"), async (req, res) => {
  const parsed = experimentPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid experiment payload.");
    return;
  }

  const updates: Partial<typeof experiments.$inferInsert> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.slug !== undefined) updates.slug = parsed.data.slug;
  if (parsed.data.description !== undefined) updates.description = parseOptionalString(parsed.data.description);
  if (parsed.data.content !== undefined) updates.content = parseUnknownContent(parsed.data.content);
  if (parsed.data.image_url !== undefined) updates.imageUrl = parseOptionalString(parsed.data.image_url);
  if (parsed.data.curator !== undefined) updates.curator = parseOptionalString(parsed.data.curator);
  if (parsed.data.editor !== undefined) updates.editor = parseOptionalString(parsed.data.editor);
  if (parsed.data.chamber !== undefined) updates.chamber = parseOptionalString(parsed.data.chamber) ?? "i";
  if (parsed.data.published !== undefined) updates.published = parsed.data.published;

  const [updated] = await db
    .update(experiments)
    .set(updates)
    .where(eq(experiments.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Experiment not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.patch(
  "/experiments/:id/published",
  requireAdminPermission("experiments"),
  async (req, res) => {
    const parsed = publishToggleSchema.safeParse({
      published: parseBoolean(req.body?.published, false),
    });

    if (!parsed.success) {
      sendError(res, 400, "INVALID_REQUEST", "published must be provided.");
      return;
    }

    const [updated] = await db
      .update(experiments)
      .set({
        published: parsed.data.published,
        updatedAt: new Date(),
      })
      .where(eq(experiments.id, pathParam(req, "id")))
      .returning();

    if (!updated) {
      sendError(res, 404, "NOT_FOUND", "Experiment not found.");
      return;
    }

    sendData(res, updated);
  },
);

adminRouter.delete("/experiments/:id", requireAdminPermission("experiments"), async (req, res) => {
  const [deleted] = await db.delete(experiments).where(eq(experiments.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Experiment not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/team-members", requireAdminPermission("team"), async (req, res) => {
  const memberType = typeof req.query.member_type === "string" ? req.query.member_type : undefined;

  const rows = memberType
    ? await db
        .select({
          id: teamMembers.id,
          member_profile_id: teamMembers.memberProfileId,
          name: teamMembers.name,
          role: teamMembers.role,
          bio: sql<string | null>`coalesce(${memberProfiles.bio}, ${teamMembers.bio})`,
          image_url: sql<string | null>`coalesce(${memberProfiles.imageUrl}, ${teamMembers.imageUrl})`,
          member_type: teamMembers.memberType,
          order_index: teamMembers.orderIndex,
          created_at: teamMembers.createdAt,
          updated_at: teamMembers.updatedAt,
        })
        .from(teamMembers)
        .leftJoin(memberProfiles, eq(teamMembers.memberProfileId, memberProfiles.id))
        .where(eq(teamMembers.memberType, memberType))
        .orderBy(asc(teamMembers.orderIndex))
    : await db
        .select({
          id: teamMembers.id,
          member_profile_id: teamMembers.memberProfileId,
          name: teamMembers.name,
          role: teamMembers.role,
          bio: sql<string | null>`coalesce(${memberProfiles.bio}, ${teamMembers.bio})`,
          image_url: sql<string | null>`coalesce(${memberProfiles.imageUrl}, ${teamMembers.imageUrl})`,
          member_type: teamMembers.memberType,
          order_index: teamMembers.orderIndex,
          created_at: teamMembers.createdAt,
          updated_at: teamMembers.updatedAt,
        })
        .from(teamMembers)
        .leftJoin(memberProfiles, eq(teamMembers.memberProfileId, memberProfiles.id))
        .orderBy(asc(teamMembers.orderIndex));

  sendData(res, rows);
});

adminRouter.post("/team-members", requireAdminPermission("team"), async (req, res) => {
  const parsed = teamMemberPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid team member payload.");
    return;
  }

  const [created] = await db
    .insert(teamMembers)
    .values({
      name: parsed.data.name,
      role: parseOptionalString(parsed.data.role),
      bio: parseOptionalString(parsed.data.bio),
      imageUrl: parseOptionalString(parsed.data.image_url),
      memberType: parsed.data.member_type,
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/team-members/:id", requireAdminPermission("team"), async (req, res) => {
  const parsed = teamMemberPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid team member payload.");
    return;
  }

  const updates: Partial<typeof teamMembers.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.role !== undefined) updates.role = parseOptionalString(parsed.data.role);
  if (parsed.data.bio !== undefined) updates.bio = parseOptionalString(parsed.data.bio);
  if (parsed.data.image_url !== undefined) updates.imageUrl = parseOptionalString(parsed.data.image_url);
  if (parsed.data.member_type !== undefined) updates.memberType = parsed.data.member_type;
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(teamMembers)
    .set(updates)
    .where(eq(teamMembers.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Team member not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/team-members/:id", requireAdminPermission("team"), async (req, res) => {
  const [deleted] = await db.delete(teamMembers).where(eq(teamMembers.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Team member not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/contributors", requireAdminPermission("team"), async (_req, res) => {
  const rows = await db.select().from(contributors).orderBy(asc(contributors.name));
  sendData(res, rows);
});

adminRouter.post("/contributors", requireAdminPermission("team"), async (req, res) => {
  const parsed = contributorPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid contributor payload.");
    return;
  }

  const [created] = await db
    .insert(contributors)
    .values({
      name: parsed.data.name,
      location: parseOptionalString(parsed.data.location),
      bio: parseOptionalString(parsed.data.bio),
      imageUrl: parseOptionalString(parsed.data.image_url),
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/contributors/:id", requireAdminPermission("team"), async (req, res) => {
  const parsed = contributorPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid contributor payload.");
    return;
  }

  const updates: Partial<typeof contributors.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.location !== undefined) updates.location = parseOptionalString(parsed.data.location);
  if (parsed.data.bio !== undefined) updates.bio = parseOptionalString(parsed.data.bio);
  if (parsed.data.image_url !== undefined) updates.imageUrl = parseOptionalString(parsed.data.image_url);

  const [updated] = await db
    .update(contributors)
    .set(updates)
    .where(eq(contributors.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Contributor not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/contributors/:id", requireAdminPermission("team"), async (req, res) => {
  const [deleted] = await db.delete(contributors).where(eq(contributors.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Contributor not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/supporters", requireAdminPermission("supporters"), async (_req, res) => {
  const rows = await db.select().from(supporters).orderBy(asc(supporters.orderIndex));
  sendData(res, rows);
});

adminRouter.post("/supporters", requireAdminPermission("supporters"), async (req, res) => {
  const parsed = supporterPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid supporter payload.");
    return;
  }

  const [created] = await db
    .insert(supporters)
    .values({
      name: parsed.data.name,
      logoUrl: parseOptionalString(parsed.data.logo_url),
      websiteUrl: parseOptionalString(parsed.data.website_url),
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/supporters/:id", requireAdminPermission("supporters"), async (req, res) => {
  const parsed = supporterPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid supporter payload.");
    return;
  }

  const updates: Partial<typeof supporters.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.logo_url !== undefined) updates.logoUrl = parseOptionalString(parsed.data.logo_url);
  if (parsed.data.website_url !== undefined) updates.websiteUrl = parseOptionalString(parsed.data.website_url);
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(supporters)
    .set(updates)
    .where(eq(supporters.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Supporter not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/supporters/:id", requireAdminPermission("supporters"), async (req, res) => {
  const [deleted] = await db.delete(supporters).where(eq(supporters.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Supporter not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/chambers", requireAdminPermission("chambers"), async (_req, res) => {
  const [statsRows, beliefRows, contentRows] = await Promise.all([
    db.select().from(chamberStats).orderBy(asc(chamberStats.orderIndex)),
    db.select().from(chamberBeliefs).orderBy(asc(chamberBeliefs.orderIndex)),
    db
      .select()
      .from(chamberContent)
      .where(eq(chamberContent.chamber, "iii"))
      .orderBy(asc(chamberContent.section)),
  ]);

  sendData(res, {
    stats: statsRows,
    beliefs: beliefRows,
    content: contentRows,
  });
});

adminRouter.post("/chamber-stats", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberStatPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber stat payload.");
    return;
  }

  const [created] = await db
    .insert(chamberStats)
    .values({
      label: parsed.data.label,
      value: parsed.data.value,
      chamber: parsed.data.chamber ?? "ii",
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/chamber-stats/:id", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberStatPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber stat payload.");
    return;
  }

  const updates: Partial<typeof chamberStats.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.label !== undefined) updates.label = parsed.data.label;
  if (parsed.data.value !== undefined) updates.value = parsed.data.value;
  if (parsed.data.chamber !== undefined) updates.chamber = parsed.data.chamber;
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(chamberStats)
    .set(updates)
    .where(eq(chamberStats.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Chamber stat not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/chamber-stats/:id", requireAdminPermission("chambers"), async (req, res) => {
  const [deleted] = await db.delete(chamberStats).where(eq(chamberStats.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Chamber stat not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.post("/chamber-beliefs", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberBeliefPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber belief payload.");
    return;
  }

  const [created] = await db
    .insert(chamberBeliefs)
    .values({
      title: parsed.data.title,
      content: parseOptionalString(parsed.data.content),
      chamber: parsed.data.chamber ?? "ii",
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/chamber-beliefs/:id", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberBeliefPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber belief payload.");
    return;
  }

  const updates: Partial<typeof chamberBeliefs.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.content !== undefined) updates.content = parseOptionalString(parsed.data.content);
  if (parsed.data.chamber !== undefined) updates.chamber = parsed.data.chamber;
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(chamberBeliefs)
    .set(updates)
    .where(eq(chamberBeliefs.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Chamber belief not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/chamber-beliefs/:id", requireAdminPermission("chambers"), async (req, res) => {
  const [deleted] = await db.delete(chamberBeliefs).where(eq(chamberBeliefs.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Chamber belief not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.post("/chamber-content", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberContentPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber content payload.");
    return;
  }

  const [created] = await db
    .insert(chamberContent)
    .values({
      chamber: parsed.data.chamber,
      section: parsed.data.section,
      content: parseOptionalString(parsed.data.content),
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/chamber-content/:id", requireAdminPermission("chambers"), async (req, res) => {
  const parsed = chamberContentPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid chamber content payload.");
    return;
  }

  const updates: Partial<typeof chamberContent.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.chamber !== undefined) updates.chamber = parsed.data.chamber;
  if (parsed.data.section !== undefined) updates.section = parsed.data.section;
  if (parsed.data.content !== undefined) updates.content = parseOptionalString(parsed.data.content);

  const [updated] = await db
    .update(chamberContent)
    .set(updates)
    .where(eq(chamberContent.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Chamber content not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.get("/programs", requireAdminPermission("programs"), async (_req, res) => {
  const rows = await db.select().from(programs).orderBy(asc(programs.orderIndex));
  sendData(res, rows);
});

adminRouter.post("/programs", requireAdminPermission("programs"), async (req, res) => {
  const parsed = programPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid program payload.");
    return;
  }

  const [created] = await db
    .insert(programs)
    .values({
      title: parsed.data.title,
      description: parseOptionalString(parsed.data.description),
      iconType: parseOptionalString(parsed.data.icon_type),
      featured: parsed.data.featured ?? false,
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/programs/:id", requireAdminPermission("programs"), async (req, res) => {
  const parsed = programPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid program payload.");
    return;
  }

  const updates: Partial<typeof programs.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.description !== undefined) updates.description = parseOptionalString(parsed.data.description);
  if (parsed.data.icon_type !== undefined) updates.iconType = parseOptionalString(parsed.data.icon_type);
  if (parsed.data.featured !== undefined) updates.featured = parsed.data.featured;
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(programs)
    .set(updates)
    .where(eq(programs.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Program not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/programs/:id", requireAdminPermission("programs"), async (req, res) => {
  const [deleted] = await db.delete(programs).where(eq(programs.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Program not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/gallery-items", requireAdminPermission("gallery"), async (_req, res) => {
  const rows = await db.select().from(galleryItems).orderBy(asc(galleryItems.orderIndex));
  sendData(res, rows);
});

adminRouter.post("/gallery-items", requireAdminPermission("gallery"), async (req, res) => {
  const parsed = galleryPayloadSchema.safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid gallery item payload.");
    return;
  }

  const [created] = await db
    .insert(galleryItems)
    .values({
      title: parsed.data.title,
      description: parseOptionalString(parsed.data.description),
      imageUrl: parseOptionalString(parsed.data.image_url),
      videoUrl: cleanVideoUrl(parseOptionalString(parsed.data.video_url)),
      featured: parsed.data.featured ?? false,
      orderIndex: parsed.data.order_index ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  sendData(res, created, 201);
});

adminRouter.patch("/gallery-items/:id", requireAdminPermission("gallery"), async (req, res) => {
  const parsed = galleryPayloadSchema.partial().safeParse(parseBodyWithNumericCoercion(req.body));
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid gallery item payload.");
    return;
  }

  const updates: Partial<typeof galleryItems.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.description !== undefined) updates.description = parseOptionalString(parsed.data.description);
  if (parsed.data.image_url !== undefined) updates.imageUrl = parseOptionalString(parsed.data.image_url);
  if (parsed.data.video_url !== undefined) {
    updates.videoUrl = cleanVideoUrl(parseOptionalString(parsed.data.video_url));
  }
  if (parsed.data.featured !== undefined) updates.featured = parsed.data.featured;
  if (parsed.data.order_index !== undefined) updates.orderIndex = parsed.data.order_index;

  const [updated] = await db
    .update(galleryItems)
    .set(updates)
    .where(eq(galleryItems.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Gallery item not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete("/gallery-items/:id", requireAdminPermission("gallery"), async (req, res) => {
  const [deleted] = await db.delete(galleryItems).where(eq(galleryItems.id, pathParam(req, "id"))).returning();
  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Gallery item not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.patch("/gallery-items/:id/featured", requireAdminPermission("gallery"), async (req, res) => {
  const parsed = featuredToggleSchema.safeParse({
    featured: req.body?.featured === undefined ? true : parseBoolean(req.body.featured, true),
  });

  if (!parsed.success || !parsed.data.featured) {
    sendError(res, 400, "INVALID_REQUEST", "featured must be true for this endpoint.");
    return;
  }

  await db.update(galleryItems).set({ featured: false, updatedAt: new Date() }).where(ne(galleryItems.id, ""));

  const [updated] = await db
    .update(galleryItems)
    .set({ featured: true, updatedAt: new Date() })
    .where(eq(galleryItems.id, pathParam(req, "id")))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Gallery item not found.");
    return;
  }

  sendData(res, updated);
});

adminRouter.delete(
  "/gallery-items/:id/featured",
  requireAdminPermission("gallery"),
  async (req, res) => {
    const [updated] = await db
      .update(galleryItems)
      .set({ featured: false, updatedAt: new Date() })
      .where(eq(galleryItems.id, pathParam(req, "id")))
      .returning();

    if (!updated) {
      sendError(res, 404, "NOT_FOUND", "Gallery item not found.");
      return;
    }

    sendData(res, updated);
  },
);

adminRouter.get("/site-content", requireAdminPermission("site_content"), async (_req, res) => {
  const rows = await db.select().from(siteContentEntries).orderBy(asc(siteContentEntries.key));
  sendData(res, rows);
});

adminRouter.put("/site-content/:key", requireAdminPermission("site_content"), async (req, res) => {
  const parsed = siteContentPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid site content payload.");
    return;
  }

  const key = pathParam(req, "key");
  const value = parsed.data.value ?? "";

  const [upserted] = await db
    .insert(siteContentEntries)
    .values({
      key,
      value,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContentEntries.key,
      set: {
        value,
        updatedAt: new Date(),
      },
    })
    .returning();

  sendData(res, upserted);
});

adminRouter.get("/contact-submissions", requireAdminPermission("contacts"), async (_req, res) => {
  const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  sendData(res, rows);
});

adminRouter.patch(
  "/contact-submissions/:id/read",
  requireAdminPermission("contacts"),
  async (req, res) => {
    const parsed = readToggleSchema.safeParse({
      read: parseBoolean(req.body?.read, false),
    });

    if (!parsed.success) {
      sendError(res, 400, "INVALID_REQUEST", "read must be provided.");
      return;
    }

    const [updated] = await db
      .update(contactSubmissions)
      .set({
        read: parsed.data.read,
      })
      .where(eq(contactSubmissions.id, pathParam(req, "id")))
      .returning();

    if (!updated) {
      sendError(res, 404, "NOT_FOUND", "Contact submission not found.");
      return;
    }

    sendData(res, updated);
  },
);

adminRouter.delete("/contact-submissions/:id", requireAdminPermission("contacts"), async (req, res) => {
  const [deleted] = await db
    .delete(contactSubmissions)
    .where(eq(contactSubmissions.id, pathParam(req, "id")))
    .returning();

  if (!deleted) {
    sendError(res, 404, "NOT_FOUND", "Contact submission not found.");
    return;
  }

  sendData(res, { success: true });
});

adminRouter.get("/volunteer-submissions", requireAdminPermission("volunteers"), async (_req, res) => {
  const rows = await db.select().from(volunteerSubmissions).orderBy(desc(volunteerSubmissions.createdAt));
  sendData(res, rows);
});

adminRouter.patch(
  "/volunteer-submissions/:id/status",
  requireAdminPermission("volunteers"),
  async (req, res) => {
    const parsed = volunteerStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "INVALID_REQUEST", "Invalid volunteer status payload.");
      return;
    }

    const [updated] = await db
      .update(volunteerSubmissions)
      .set({ status: parsed.data.status })
      .where(eq(volunteerSubmissions.id, pathParam(req, "id")))
      .returning();

    if (!updated) {
      sendError(res, 404, "NOT_FOUND", "Volunteer submission not found.");
      return;
    }

    sendData(res, updated);
  },
);

adminRouter.delete(
  "/volunteer-submissions/:id",
  requireAdminPermission("volunteers"),
  async (req, res) => {
    const [deleted] = await db
      .delete(volunteerSubmissions)
      .where(eq(volunteerSubmissions.id, pathParam(req, "id")))
      .returning();

    if (!deleted) {
      sendError(res, 404, "NOT_FOUND", "Volunteer submission not found.");
      return;
    }

    sendData(res, { success: true });
  },
);

adminRouter.post("/uploads/image", requireAnyAdminPermission(imageUploadPermissions), (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
        sendError(
          res,
          413,
          "PAYLOAD_TOO_LARGE",
          `Image file exceeds ${env.UPLOAD_IMAGE_MAX_BYTES} bytes limit.`,
        );
        return;
      }

      sendError(res, 400, "INVALID_UPLOAD", "Invalid image upload payload.");
      return;
    }

    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      sendError(res, 400, "INVALID_REQUEST", "File is required.");
      return;
    }

    if (!file.mimetype.startsWith("image/")) {
      sendError(res, 400, "INVALID_REQUEST", "Uploaded file must be an image.");
      return;
    }

    if (file.size > env.UPLOAD_IMAGE_MAX_BYTES) {
      sendError(
        res,
        413,
        "PAYLOAD_TOO_LARGE",
        `Image file exceeds ${env.UPLOAD_IMAGE_MAX_BYTES} bytes limit.`,
      );
      return;
    }

    try {
      if (!isS3StorageConfigured()) {
        sendError(
          res,
          503,
          "UPLOAD_CONFIGURATION_ERROR",
          "S3 image storage is not configured.",
        );
        return;
      }

      const payload = await uploadImageToS3({
        buffer: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        folder: normalizeUploadFolder(req.body.folder, "uploads"),
        size: file.size,
      });
      sendData(res, payload, 201);
    } catch (error) {
      console.error("Failed to store image upload in S3:", error);
      sendError(res, 500, "UPLOAD_ERROR", "Failed to store image upload.");
    }
  });
});

adminRouter.post("/uploads/video", requireAnyAdminPermission(videoUploadPermissions), (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
        sendError(
          res,
          413,
          "PAYLOAD_TOO_LARGE",
          `Video file exceeds ${env.UPLOAD_VIDEO_MAX_BYTES} bytes limit.`,
        );
        return;
      }

      sendError(res, 400, "INVALID_UPLOAD", "Invalid video upload payload.");
      return;
    }

    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      sendError(res, 400, "INVALID_REQUEST", "File is required.");
      return;
    }

    if (!file.mimetype.startsWith("video/")) {
      sendError(res, 400, "INVALID_REQUEST", "Uploaded file must be a video.");
      return;
    }

    if (file.size > env.UPLOAD_VIDEO_MAX_BYTES) {
      sendError(
        res,
        413,
        "PAYLOAD_TOO_LARGE",
        `Video file exceeds ${env.UPLOAD_VIDEO_MAX_BYTES} bytes limit.`,
      );
      return;
    }

    try {
      const payload = await saveLocalUploadFile(req, file, "videos");
      sendData(res, payload, 201);
    } catch {
      sendError(res, 500, "UPLOAD_ERROR", "Failed to store video upload.");
    }
  });
});

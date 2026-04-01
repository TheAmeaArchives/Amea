import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { Request } from "express";
import { Router } from "express";
import multer, { MulterError } from "multer";
import { z } from "zod";
import { auth } from "../auth/index.js";
import { env } from "../config/env.js";
import { db } from "../db/index.js";
import { memberProfiles, teamMembers, user } from "../db/schema.js";
import { isS3StorageConfigured, uploadImageToS3 } from "../storage/s3.js";
import { sendData, sendError } from "../utils/http.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.UPLOAD_IMAGE_MAX_BYTES,
  },
});

const memberProfileUpdateSchema = z.object({
  full_name: z.string().trim().min(1).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/i, "Username may only contain letters, numbers, and underscores.")
    .optional(),
  bio: z.string().optional().nullable(),
  image_url: z.string().trim().optional().nullable(),
});

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function serializeMemberProfile(profile: typeof memberProfiles.$inferSelect) {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.fullName,
    username: profile.username,
    bio: profile.bio,
    image_url: profile.imageUrl,
    is_active: profile.isActive,
    created_at: profile.createdAt.toISOString(),
    updated_at: profile.updatedAt.toISOString(),
  };
}

async function getSessionUser(req: Request) {
  const sessionResult = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return sessionResult?.user ?? null;
}

export const memberRouter = Router();

memberRouter.get("/profile/current", async (req, res) => {
  const sessionUser = await getSessionUser(req);
  if (!sessionUser) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const [profile] = await db
    .select()
    .from(memberProfiles)
    .where(eq(memberProfiles.id, sessionUser.id))
    .limit(1);

  if (!profile || !profile.isActive) {
    sendError(res, 404, "NOT_FOUND", "Member profile not found.");
    return;
  }

  sendData(res, serializeMemberProfile(profile));
});

memberRouter.patch("/profile/current", async (req, res) => {
  const sessionUser = await getSessionUser(req);
  if (!sessionUser) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const parsed = memberProfileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_REQUEST", "Invalid member profile payload.");
    return;
  }

  const updates: Partial<typeof memberProfiles.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.data.full_name !== undefined) updates.fullName = parsed.data.full_name;
  if (parsed.data.bio !== undefined) updates.bio = parseOptionalString(parsed.data.bio);
  if (parsed.data.image_url !== undefined) updates.imageUrl = parseOptionalString(parsed.data.image_url);

  if (parsed.data.username !== undefined) {
    const requestedUsername = parsed.data.username.trim().toLowerCase();
    const [existingUsername] = await db
      .select({ id: memberProfiles.id })
      .from(memberProfiles)
      .where(eq(memberProfiles.username, requestedUsername))
      .limit(1);

    if (existingUsername && existingUsername.id !== sessionUser.id) {
      sendError(res, 409, "CONFLICT", "Username is already taken.");
      return;
    }

    updates.username = requestedUsername;
  }

  const [updated] = await db
    .update(memberProfiles)
    .set(updates)
    .where(eq(memberProfiles.id, sessionUser.id))
    .returning();

  if (!updated) {
    sendError(res, 404, "NOT_FOUND", "Member profile not found.");
    return;
  }

  await db
    .update(user)
    .set({
      name: updates.fullName ?? updated.fullName,
      email: normalizeEmail(sessionUser.email ?? updated.email),
      image: updates.imageUrl ?? updated.imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(user.id, sessionUser.id));

  await db
    .update(teamMembers)
    .set({
      name: updates.fullName ?? updated.fullName,
      bio: updates.bio ?? updated.bio,
      imageUrl: updates.imageUrl ?? updated.imageUrl,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.memberProfileId, sessionUser.id));

  sendData(res, serializeMemberProfile(updated));
});

memberRouter.post("/uploads/image", (req, res) => {
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

    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
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

    if (!isS3StorageConfigured()) {
      sendError(res, 503, "UPLOAD_CONFIGURATION_ERROR", "S3 image storage is not configured.");
      return;
    }

    try {
      const payload = await uploadImageToS3({
        buffer: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        folder: "members",
        size: file.size,
      });
      sendData(res, payload, 201);
    } catch (uploadError) {
      console.error("Failed to upload member profile image:", uploadError);
      sendError(res, 500, "UPLOAD_ERROR", "Failed to store image upload.");
    }
  });
});

import { APIError } from "@better-auth/core/error";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { eq, sql } from "drizzle-orm";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth/index.js";
import { db } from "../db/index.js";
import { adminInvites, adminProfiles, user } from "../db/schema.js";

async function normalizeEmailRecords(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return;
  }

  const [matchedUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(sql`lower(${user.email}) = ${normalizedEmail}`)
    .limit(1);

  if (matchedUser && matchedUser.email !== normalizedEmail) {
    await db
      .update(user)
      .set({
        email: normalizedEmail,
        updatedAt: new Date(),
      })
      .where(eq(user.id, matchedUser.id));
  }

  const [matchedAdminProfile] = await db
    .select({ id: adminProfiles.id, email: adminProfiles.email })
    .from(adminProfiles)
    .where(sql`lower(${adminProfiles.email}) = ${normalizedEmail}`)
    .limit(1);

  if (matchedAdminProfile && matchedAdminProfile.email !== normalizedEmail) {
    await db
      .update(adminProfiles)
      .set({
        email: normalizedEmail,
        updatedAt: new Date(),
      })
      .where(eq(adminProfiles.id, matchedAdminProfile.id));
  }
}

function normalizeAuthBodyEmails(body: unknown): { email?: string; newEmail?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }

  const candidate = body as Record<string, unknown>;
  const normalized: { email?: string; newEmail?: string } = {};

  if (typeof candidate.email === "string") {
    normalized.email = candidate.email.trim().toLowerCase();
    candidate.email = normalized.email;
  }

  if (typeof candidate.newEmail === "string") {
    normalized.newEmail = candidate.newEmail.trim().toLowerCase();
    candidate.newEmail = normalized.newEmail;
  }

  return normalized;
}

async function bootstrapInitialAdminProfile(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return;
  }

  await db.transaction(async (tx) => {
    const [adminCountRow] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(adminProfiles);

    if ((adminCountRow?.count ?? 0) > 0) {
      return;
    }

    const [pendingInviteCountRow] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(adminInvites)
      .where(
        sql`${adminInvites.acceptedAt} is null and ${adminInvites.revokedAt} is null and ${adminInvites.expiresAt} > now()`,
      );

    if ((pendingInviteCountRow?.count ?? 0) > 0) {
      return;
    }

    const [matchedUser] = await tx
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1);

    if (!matchedUser) {
      return;
    }

    await tx
      .insert(adminProfiles)
      .values({
        id: matchedUser.id,
        email: normalizedEmail,
        fullName: matchedUser.name || normalizedEmail,
        role: "super_admin",
        permissions: [],
        avatarUrl: matchedUser.image ?? null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  });
}

function setResponseHeadersFromAuth(res: Response, authResponse: globalThis.Response): void {
  const headersWithCookies = authResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookie =
    headersWithCookies.getSetCookie?.() ??
    authResponse.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,\s]+=)/g)
      .map((value) => value.trim())
      .filter((value) => value.length > 0) ??
    [];

  if (setCookie.length > 0) {
    res.setHeader("set-cookie", setCookie);
  }

  const cacheControl = authResponse.headers.get("cache-control");
  if (cacheControl) {
    res.setHeader("cache-control", cacheControl);
  }

  const contentType = authResponse.headers.get("content-type");
  if (contentType) {
    res.setHeader("content-type", contentType);
  }
}

async function sendAuthResponse(
  res: Response,
  authResponse: globalThis.Response,
  onSuccess?: (payload: unknown) => Promise<void>,
): Promise<void> {
  setResponseHeadersFromAuth(res, authResponse);
  const responseText = await authResponse.text();

  if (authResponse.ok && onSuccess) {
    try {
      const payload = responseText ? (JSON.parse(responseText) as unknown) : null;
      await onSuccess(payload);
    } catch {
      // Ignore parse failures and return the original auth response unchanged.
    }
  }

  res.status(authResponse.status).send(responseText);
}

function sendAuthError(res: Response, error: unknown): void {
  if (error instanceof APIError) {
    res.status(error.statusCode).json(error.body ?? { message: error.message });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      code: "AUTH_ERROR",
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    code: "AUTH_ERROR",
    message: "Authentication request failed.",
  });
}

const authHandler = toNodeHandler(auth);

export const authRouter = Router();

authRouter.use(async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      const { email, newEmail } = normalizeAuthBodyEmails(req.body);
      if (email) {
        await normalizeEmailRecords(email);
      }
      if (newEmail) {
        await normalizeEmailRecords(newEmail);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

authRouter.post("/email-otp/send-verification-otp", async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (email) {
      await normalizeEmailRecords(email);
      req.body.email = email;
    }

    const authResponse = await auth.api.sendVerificationOTP({
      headers: fromNodeHeaders(req.headers),
      body: req.body,
      asResponse: true,
    });

    await sendAuthResponse(res, authResponse);
  } catch (error) {
    sendAuthError(res, error);
  }
});

authRouter.post("/sign-in/email-otp", async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (email) {
      await normalizeEmailRecords(email);
      req.body.email = email;
    }

    const authResponse = await auth.api.signInEmailOTP({
      headers: fromNodeHeaders(req.headers),
      body: req.body,
      asResponse: true,
    });

    await sendAuthResponse(res, authResponse, async () => {
      if (email) {
        await bootstrapInitialAdminProfile(email);
      }
    });
  } catch (error) {
    sendAuthError(res, error);
  }
});

authRouter.get("/get-session", async (req: Request, res: Response) => {
  try {
    const authResponse = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    await sendAuthResponse(res, authResponse);
  } catch (error) {
    sendAuthError(res, error);
  }
});

authRouter.post("/sign-out", async (req: Request, res: Response) => {
  try {
    const authResponse = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    await sendAuthResponse(res, authResponse);
  } catch (error) {
    sendAuthError(res, error);
  }
});

authRouter.use(async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.path === "/email-otp/send-verification-otp" ||
    req.path === "/sign-in/email-otp" ||
    req.path === "/get-session" ||
    req.path === "/sign-out"
  ) {
    next();
    return;
  }

  try {
    await authHandler(req, res);
  } catch (error) {
    next(error);
  }
});

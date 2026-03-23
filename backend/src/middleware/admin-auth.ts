import { APIError } from "@better-auth/core/error";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import type { NextFunction, Request, Response as ExpressResponse } from "express";
import { auth } from "../auth/index.js";
import { db } from "../db/index.js";
import { adminProfiles } from "../db/schema.js";

export const adminPermissions = [
  "blog",
  "experiments",
  "team",
  "gallery",
  "programs",
  "supporters",
  "contacts",
  "volunteers",
  "site_content",
  "chambers",
] as const;

export type AdminPermission = (typeof adminPermissions)[number];

export type AdminProfileRecord = Omit<InferSelectModel<typeof adminProfiles>, "permissions"> & {
  permissions: string[];
};

export type AuthenticatedRequest = Request & {
  authUser?: {
    id: string;
    email: string | null;
  };
  adminProfile?: AdminProfileRecord;
};

function setResponseHeadersFromAuth(res: ExpressResponse, authResponse: globalThis.Response): void {
  const headersWithCookies = authResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookie = headersWithCookies.getSetCookie?.() ?? [];
  if (setCookie.length > 0) {
    res.setHeader("set-cookie", setCookie);
  }

  const cacheControl = authResponse.headers.get("cache-control");
  if (cacheControl) {
    res.setHeader("cache-control", cacheControl);
  }
}

function sendError(res: ExpressResponse, status: number, code: string, message: string): void {
  res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

function mapAuthErrorToResponse(error: unknown): { status: number; code: string; message: string } {
  if (error instanceof APIError) {
    return {
      status: error.statusCode,
      code: error.body?.code ?? "AUTH_ERROR",
      message: error.body?.message ?? "Authentication request failed.",
    };
  }

  return {
    status: 500,
    code: "AUTH_ERROR",
    message: "Authentication service is currently unavailable.",
  };
}

function normalizePermissions(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((value): value is string => typeof value === "string");
}

export function hasPermission(profile: AdminProfileRecord, permission: AdminPermission): boolean {
  if (!profile.isActive) {
    return false;
  }

  if (profile.role === "super_admin") {
    return true;
  }

  return profile.permissions.includes(permission);
}

export function hasAnyPermission(
  profile: AdminProfileRecord,
  permissions: readonly AdminPermission[],
): boolean {
  return permissions.some((permission) => hasPermission(profile, permission));
}

export async function requireSession(
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  try {
    const authResponse = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    setResponseHeadersFromAuth(res, authResponse);

    if (!authResponse.ok) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
      return;
    }

    const payload = (await authResponse.json()) as
      | {
          user?: {
            id?: string;
            email?: string | null;
          };
        }
      | null;

    if (!payload?.user?.id) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
      return;
    }

    const requestWithAuth = req as AuthenticatedRequest;
    requestWithAuth.authUser = {
      id: payload.user.id,
      email: typeof payload.user.email === "string" ? payload.user.email : null,
    };

    next();
  } catch (error: unknown) {
    const mapped = mapAuthErrorToResponse(error);
    sendError(res, mapped.status, mapped.code, mapped.message);
  }
}

export async function requireAdminProfile(
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
): Promise<void> {
  const requestWithAuth = req as AuthenticatedRequest;

  if (!requestWithAuth.authUser?.id) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication is required.");
    return;
  }

  const [profile] = await db
    .select()
    .from(adminProfiles)
    .where(and(eq(adminProfiles.id, requestWithAuth.authUser.id), eq(adminProfiles.isActive, true)))
    .limit(1);

  if (!profile) {
    sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
    return;
  }

  requestWithAuth.adminProfile = {
    ...profile,
    permissions: normalizePermissions(profile.permissions),
  };

  next();
}

export function requireAdminPermission(permission: AdminPermission) {
  return (req: Request, res: ExpressResponse, next: NextFunction): void => {
    const requestWithAuth = req as AuthenticatedRequest;
    const profile = requestWithAuth.adminProfile;

    if (!profile) {
      sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
      return;
    }

    if (!hasPermission(profile, permission)) {
      sendError(res, 403, "FORBIDDEN", "You are not authorized to perform this action.");
      return;
    }

    next();
  };
}

export function requireAnyAdminPermission(permissions: readonly AdminPermission[]) {
  return (req: Request, res: ExpressResponse, next: NextFunction): void => {
    const requestWithAuth = req as AuthenticatedRequest;
    const profile = requestWithAuth.adminProfile;

    if (!profile) {
      sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
      return;
    }

    if (!hasAnyPermission(profile, permissions)) {
      sendError(res, 403, "FORBIDDEN", "You are not authorized to perform this action.");
      return;
    }

    next();
  };
}

export function requireSuperAdmin(req: Request, res: ExpressResponse, next: NextFunction): void {
  const requestWithAuth = req as AuthenticatedRequest;
  const profile = requestWithAuth.adminProfile;

  if (!profile) {
    sendError(res, 403, "FORBIDDEN", "Active admin profile is required.");
    return;
  }

  if (!(profile.role === "super_admin" && profile.isActive)) {
    sendError(res, 403, "FORBIDDEN", "Super admin access is required.");
    return;
  }

  next();
}

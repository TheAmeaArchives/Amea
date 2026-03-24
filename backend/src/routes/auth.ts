import { APIError } from "@better-auth/core/error";
import { fromNodeHeaders } from "better-auth/node";
import { Router } from "express";
import { z } from "zod";
import { auth, type AuthErrorPayload } from "../auth/index.js";
import { env } from "../config/env.js";

type RateLimitState = {
  count: number;
  resetAt: number;
};

const requestLimiter = new Map<string, RateLimitState>();

const requestOTPBodySchema = z.object({
  email: z.string().email(),
});

const verifyOTPBodySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(10),
  name: z.string().trim().min(1).max(128).optional(),
});

const otpErrorMessages: Record<string, string> = {
  INVALID_OTP: "The one-time passcode is invalid.",
  OTP_EXPIRED: "The one-time passcode has expired. Request a new code.",
  TOO_MANY_ATTEMPTS: "Too many invalid attempts. Request a new code and try again.",
};

function getRequestKey(ipAddress: string, email: string): string {
  return `${ipAddress}:${email.toLowerCase()}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = requestLimiter.get(key);

  if (!current || current.resetAt <= now) {
    requestLimiter.set(key, {
      count: 1,
      resetAt: now + env.AUTH_REQUEST_RATE_LIMIT_WINDOW_SECONDS * 1_000,
    });
    return false;
  }

  current.count += 1;
  return current.count > env.AUTH_REQUEST_RATE_LIMIT_MAX;
}

function setResponseHeadersFromAuth(res: import("express").Response, authResponse: Response): void {
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

async function getErrorPayload(response: Response): Promise<AuthErrorPayload> {
  try {
    const payload = (await response.clone().json()) as AuthErrorPayload;
    if (payload && typeof payload === "object") {
      return payload;
    }
  } catch {
    // Non-JSON errors are normalized by caller.
  }
  return {};
}

function mapSafeMessage(statusCode: number, code?: string): string {
  if (code && otpErrorMessages[code]) {
    return otpErrorMessages[code];
  }

  if (statusCode === 429) {
    return "Too many authentication attempts. Please wait and try again.";
  }

  if (statusCode >= 500) {
    return "Authentication service is currently unavailable.";
  }

  return "Authentication request failed.";
}

async function sendSafeError(res: import("express").Response, response: Response): Promise<void> {
  const payload = await getErrorPayload(response);
  const code = payload.code;
  const message = mapSafeMessage(response.status, code);

  res.status(response.status).json({
    error: {
      code: code ?? (response.status === 429 ? "RATE_LIMITED" : "AUTH_ERROR"),
      message,
    },
  });
}

async function sendGenericError(
  res: import("express").Response,
  error: unknown,
  fallbackStatusCode = 500,
): Promise<void> {
  if (error instanceof APIError) {
    const code = error.body?.code;
    const message = mapSafeMessage(error.statusCode, code);
    res.status(error.statusCode).json({
      error: {
        code: code ?? "AUTH_ERROR",
        message,
      },
    });
    return;
  }

  res.status(fallbackStatusCode).json({
    error: {
      code: "AUTH_ERROR",
      message: mapSafeMessage(fallbackStatusCode),
    },
  });
}

function getClientIP(req: import("express").Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return req.ip || "unknown";
}

export const authRouter = Router();

authRouter.post("/otp/request", async (req, res) => {
  const parsed = requestOTPBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: "INVALID_REQUEST",
        message: "A valid email is required.",
      },
    });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  if (isRateLimited(getRequestKey(getClientIP(req), email))) {
    res.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Too many OTP requests. Please wait and try again.",
      },
    });
    return;
  }

  try {
    const authResponse = await auth.api.sendVerificationOTP({
      headers: fromNodeHeaders(req.headers),
      body: {
        email,
        type: "sign-in",
      },
      asResponse: true,
    });

    if (!authResponse.ok) {
      await sendSafeError(res, authResponse);
      return;
    }

    res.status(200).json({ success: true });
  } catch (error: unknown) {
    await sendGenericError(res, error);
  }
});

authRouter.post("/otp/verify", async (req, res) => {
  const parsed = verifyOTPBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: "INVALID_REQUEST",
        message: "A valid email and OTP are required.",
      },
    });
    return;
  }

  try {
    const authResponse = await auth.api.signInEmailOTP({
      headers: fromNodeHeaders(req.headers),
      body: {
        email: parsed.data.email.toLowerCase(),
        otp: parsed.data.otp,
        name: parsed.data.name,
      },
      asResponse: true,
    });

    setResponseHeadersFromAuth(res, authResponse);

    if (!authResponse.ok) {
      await sendSafeError(res, authResponse);
      return;
    }

    const payload = (await authResponse.json()) as { user: Record<string, unknown> };
    res.status(200).json({
      success: true,
      user: payload.user,
    });
  } catch (error: unknown) {
    await sendGenericError(res, error);
  }
});

authRouter.get("/session", async (req, res) => {
  try {
    const authResponse = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    setResponseHeadersFromAuth(res, authResponse);

    if (!authResponse.ok) {
      await sendSafeError(res, authResponse);
      return;
    }

    const payload = (await authResponse.json()) as
      | {
          session: Record<string, unknown>;
          user: Record<string, unknown>;
        }
      | null;

    if (payload?.session && "token" in payload.session) {
      // Avoid exposing raw session token in API responses.
      delete payload.session.token;
    }

    res.status(200).json(payload);
  } catch (error: unknown) {
    await sendGenericError(res, error);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const authResponse = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    setResponseHeadersFromAuth(res, authResponse);

    if (!authResponse.ok) {
      await sendSafeError(res, authResponse);
      return;
    }

    res.status(200).json({ success: true });
  } catch (error: unknown) {
    await sendGenericError(res, error);
  }
});

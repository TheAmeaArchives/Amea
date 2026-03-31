import "server-only";

import { cookies, headers } from "next/headers";
import { fetchServerData } from "@/lib/backend/server-api";
import { parseSetCookieHeader } from "@/lib/backend/internal-api";
import type { AdminProfile } from "@/lib/types";

async function applySetCookieHeaders(setCookieHeaders: string[]): Promise<void> {
  const cookieStore = await cookies();

  for (const rawSetCookieHeader of setCookieHeaders) {
    const parsedCookie = parseSetCookieHeader(rawSetCookieHeader);
    if (!parsedCookie) {
      continue;
    }

    const isExpired =
      parsedCookie.options.maxAge !== undefined
        ? parsedCookie.options.maxAge <= 0
        : parsedCookie.options.expires !== undefined &&
          parsedCookie.options.expires.getTime() <= Date.now();

    if (isExpired) {
      cookieStore.delete(parsedCookie.name);
      continue;
    }

    cookieStore.set(parsedCookie.name, parsedCookie.value, {
      ...parsedCookie.options,
      domain: undefined,
      path: parsedCookie.options.path ?? "/",
    });
  }
}

async function resolveRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const explicitOrigin = requestHeaders.get("origin");
  if (explicitOrigin) {
    return explicitOrigin;
  }

  const host = requestHeaders.get("host") ?? "127.0.0.1:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  return fetchServerData<AdminProfile>("/api/admin/current-admin/profile");
}

export async function signOutCurrentSession(): Promise<void> {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const origin = await resolveRequestOrigin();
  const response = await fetch(`${origin}/api/auth/sign-out`, {
    method: "POST",
    headers: {
      cookie: cookieStore.toString(),
      origin,
      referer: requestHeaders.get("referer") ?? origin,
      "user-agent": requestHeaders.get("user-agent") ?? "Next.js Server Action",
    },
    cache: "no-store",
  });

  const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.();
  const setCookieHeaders =
    getSetCookie ??
    response.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,\s]+=)/g)
      .map((value) => value.trim())
      .filter((value) => value.length > 0) ??
    [];

  await applySetCookieHeaders(setCookieHeaders);
}

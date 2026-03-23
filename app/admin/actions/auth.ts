"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseSetCookieHeader, requestInternalApi } from "@/lib/backend/internal-api";

function applySetCookieHeadersToStore(setCookieHeaders: string[]): void {
  const cookieStore = cookies();

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
      path: parsedCookie.options.path ?? "/",
    });
  }
}

function clearLegacySupabaseCookies(): void {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  for (const cookie of allCookies) {
    if (cookie.name.includes("supabase") || cookie.name.includes("sb-")) {
      cookieStore.delete(cookie.name);
    }
  }
}

export async function logout() {
  const cookieStore = cookies();
  const requestHeaders = headers();

  const logoutResult = await requestInternalApi({
    path: "/api/v1/auth/logout",
    method: "POST",
    cookieHeader: cookieStore.toString(),
    forwardedFor: requestHeaders.get("x-forwarded-for"),
  });

  applySetCookieHeadersToStore(logoutResult.setCookies);
  clearLegacySupabaseCookies();

  redirect("/admin/login");
}

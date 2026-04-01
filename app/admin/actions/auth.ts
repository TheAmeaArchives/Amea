"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOutCurrentSession } from "@/lib/auth/server";

async function clearLegacySupabaseCookies(): Promise<void> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  for (const cookie of allCookies) {
    // Compatibility: clear stale pre-migration auth cookies to avoid mixed-session behavior
    // for returning users still carrying historical Supabase cookie names.
    if (cookie.name.includes("supabase") || cookie.name.includes("sb-")) {
      cookieStore.delete(cookie.name);
    }
  }
}

export async function logout() {
  await signOutCurrentSession();
  await clearLegacySupabaseCookies();

  redirect("/admin/login");
}

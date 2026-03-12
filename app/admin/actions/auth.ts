"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = createClient();
  
  await supabase.auth.signOut();
  
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  for (const cookie of allCookies) {
    if (cookie.name.includes("supabase") || cookie.name.includes("sb-")) {
      cookieStore.delete(cookie.name);
    }
  }
  
  redirect("/admin/login");
}

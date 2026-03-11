import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { GalleryItem } from "@/lib/types";
import GalleryClient from "./gallery-client";

export default async function GalleryAdminPage() {
  const supabase = createClient();

  // Fetch auth and data in parallel
  const [profile, { data }] = await Promise.all([
    getAdminProfile(),
    supabase.from("gallery_items").select("*").order("order_index"),
  ]);

  if (!profile || !hasPermission(profile, "gallery")) {
    redirect("/admin");
  }

  return <GalleryClient items={(data as GalleryItem[]) ?? []} />;
}

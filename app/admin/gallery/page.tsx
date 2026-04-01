import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { GalleryItem } from "@/lib/types";
import GalleryClient from "./gallery-client";

export default async function GalleryAdminPage() {
  const [profile, data] = await Promise.all([
    getAdminProfile(),
    fetchServerData<GalleryItem[]>("/api/admin/gallery-items"),
  ]);

  if (!profile || !hasPermission(profile, "gallery")) {
    redirect("/admin");
  }

  return <GalleryClient items={data ?? []} />;
}

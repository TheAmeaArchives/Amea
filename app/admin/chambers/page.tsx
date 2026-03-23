import { redirect } from "next/navigation";
import { fetchServerData } from "@/lib/backend/server-api";
import { getAdminProfile, hasPermission } from "@/lib/admin";
import type { ChamberStat, ChamberBelief, ChamberContent } from "@/lib/types";
import ChambersClient from "./chambers-client";

export default async function ChambersAdminPage() {
  const [profile, payload] = await Promise.all([
    getAdminProfile(),
    fetchServerData<{
      stats: ChamberStat[];
      beliefs: ChamberBelief[];
      content: ChamberContent[];
    }>("/api/v1/admin/chambers"),
  ]);

  if (!profile || !hasPermission(profile, "chambers")) {
    redirect("/admin");
  }

  return (
    <ChambersClient
      stats={payload?.stats ?? []}
      beliefs={payload?.beliefs ?? []}
      content={payload?.content ?? []}
    />
  );
}

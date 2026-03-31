import { NextRequest } from "next/server";
import { proxyJsonRoute } from "@/lib/backend/auth-route-proxy";

export async function GET(request: NextRequest) {
  return proxyJsonRoute(request, "/api/admin/current-admin/profile");
}

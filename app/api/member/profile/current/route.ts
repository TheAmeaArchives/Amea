import { NextRequest } from "next/server";
import { proxyJsonRoute } from "@/lib/backend/auth-route-proxy";

export async function GET(request: NextRequest) {
  return proxyJsonRoute(request, "/api/member/profile/current");
}

export async function PATCH(request: NextRequest) {
  return proxyJsonRoute(request, "/api/member/profile/current");
}

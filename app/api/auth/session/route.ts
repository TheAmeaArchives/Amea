import { NextRequest } from "next/server";
import { proxyAuthRoute } from "@/lib/backend/auth-route-proxy";

export async function GET(request: NextRequest) {
  return proxyAuthRoute(request, "/api/v1/auth/session");
}

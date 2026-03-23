import { NextRequest } from "next/server";
import { proxyAuthRoute } from "@/lib/backend/auth-route-proxy";

export async function POST(request: NextRequest) {
  return proxyAuthRoute(request, "/api/v1/auth/otp/request");
}

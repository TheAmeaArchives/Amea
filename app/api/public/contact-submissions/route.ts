import { NextRequest } from "next/server";
import { proxyJsonRoute } from "@/lib/backend/auth-route-proxy";

export async function POST(request: NextRequest) {
  return proxyJsonRoute(request, "/api/public/contact-submissions");
}

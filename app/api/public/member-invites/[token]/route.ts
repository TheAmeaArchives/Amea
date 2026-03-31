import { NextRequest } from "next/server";
import { proxyJsonRoute } from "@/lib/backend/auth-route-proxy";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  return proxyJsonRoute(
    request,
    `/api/admin/public/member-invites/${encodeURIComponent(token)}`,
  );
}

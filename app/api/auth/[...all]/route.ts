import { NextRequest } from "next/server";
import { proxyAuthRoute } from "@/lib/backend/auth-route-proxy";

export const runtime = "nodejs";

function resolveBackendPath(request: NextRequest, segments: string[] | undefined): string {
  const authPath = segments && segments.length > 0 ? `/${segments.join("/")}` : "";
  const search = request.nextUrl.search;
  return `/api/auth${authPath}${search}`;
}

type RouteContext = {
  params: Promise<{
    all?: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;
  return proxyAuthRoute(request, resolveBackendPath(request, all));
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;
  return proxyAuthRoute(request, resolveBackendPath(request, all));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;
  return proxyAuthRoute(request, resolveBackendPath(request, all));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;
  return proxyAuthRoute(request, resolveBackendPath(request, all));
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { all } = await context.params;
  return proxyAuthRoute(request, resolveBackendPath(request, all));
}

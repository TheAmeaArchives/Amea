import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasSessionPayload, requestInternalApi } from "@/lib/backend/internal-api";

function appendSetCookieHeaders(response: NextResponse, setCookies: string[]): void {
  for (const cookieHeader of setCookies) {
    response.headers.append("set-cookie", cookieHeader);
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  response.headers.set("x-url", url.pathname);

  const isAdminRoute = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";

  if (!isAdminRoute) {
    return response;
  }

  const sessionResult = await requestInternalApi({
    path: "/api/v1/auth/session",
    method: "GET",
    cookieHeader: request.headers.get("cookie"),
    forwardedFor: request.headers.get("x-forwarded-for"),
  });

  appendSetCookieHeaders(response, sessionResult.setCookies);
  const session = sessionResult.ok && hasSessionPayload(sessionResult.data);

  if (!session && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    const redirectResponse = NextResponse.redirect(loginUrl);
    appendSetCookieHeaders(redirectResponse, sessionResult.setCookies);
    redirectResponse.headers.set("x-url", url.pathname);
    return redirectResponse;
  }

  if (session && isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    appendSetCookieHeaders(redirectResponse, sessionResult.setCookies);
    redirectResponse.headers.set("x-url", url.pathname);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

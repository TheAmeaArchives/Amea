import { NextRequest, NextResponse } from "next/server";
import { normalizeInternalApiError } from "@/lib/backend/internal-api";

const DEFAULT_INTERNAL_API_BASE_URL = "http://127.0.0.1:4000";
const INTERNAL_API_TOKEN_HEADER = "x-internal-api-token";

function getInternalApiBaseUrl(): string {
  const configured = process.env.INTERNAL_API_BASE_URL?.trim();
  const baseUrl = configured && configured.length > 0 ? configured : DEFAULT_INTERNAL_API_BASE_URL;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getInternalApiToken(): string | undefined {
  const token = process.env.INTERNAL_API_TOKEN?.trim();
  return token && token.length > 0 ? token : undefined;
}

function appendSetCookieHeaders(response: NextResponse, backendResponse: Response): void {
  const responseHeaders = backendResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookieHeaders = responseHeaders.getSetCookie?.() ?? [];
  for (const cookie of setCookieHeaders) {
    response.headers.append("set-cookie", cookie);
  }
}

async function parseBackendPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return normalizeInternalApiError(response.status, null);
  }
}

export async function proxyUploadRoute(request: NextRequest, backendPath: string): Promise<NextResponse> {
  const formData = await request.formData();
  const url = `${getInternalApiBaseUrl()}${backendPath.startsWith("/") ? backendPath : `/${backendPath}`}`;
  const headers = new Headers();

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader && cookieHeader.length > 0) {
    headers.set("cookie", cookieHeader);
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.length > 0) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  const token = getInternalApiToken();
  if (token) {
    headers.set(INTERNAL_API_TOKEN_HEADER, token);
  }

  try {
    const backendResponse = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    });

    const payload = backendResponse.ok
      ? await parseBackendPayload(backendResponse)
      : normalizeInternalApiError(backendResponse.status, await parseBackendPayload(backendResponse));
    const response = NextResponse.json(payload, { status: backendResponse.status });
    appendSetCookieHeaders(response, backendResponse);
    return response;
  } catch {
    return NextResponse.json(normalizeInternalApiError(503, null), { status: 503 });
  }
}


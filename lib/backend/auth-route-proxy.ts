import { NextRequest, NextResponse } from "next/server";
import { normalizeInternalApiError, requestInternalApi } from "@/lib/backend/internal-api";

function appendSetCookieHeaders(response: NextResponse, setCookies: string[]): void {
  for (const cookieHeader of setCookies) {
    response.headers.append("set-cookie", cookieHeader);
  }
}

async function parseRequestBody(request: NextRequest): Promise<
  | {
      body: unknown;
      error: null;
    }
  | {
      body: null;
      error: NextResponse;
    }
> {
  if (request.method === "GET" || request.method === "DELETE") {
    return { body: null, error: null };
  }

  const contentLength = request.headers.get("content-length");
  const contentType = request.headers.get("content-type");
  if (contentLength === "0" || (!contentType && !contentLength)) {
    return { body: null, error: null };
  }

  try {
    return {
      body: await request.json(),
      error: null,
    };
  } catch {
    return {
      body: null,
      error: NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid JSON payload.",
          },
        },
        { status: 400 },
      ),
    };
  }
}

export async function proxyAuthRoute(request: NextRequest, backendPath: string): Promise<NextResponse> {
  const parsedBody = await parseRequestBody(request);
  if (parsedBody.error) {
    return parsedBody.error;
  }

  const result = await requestInternalApi({
    path: backendPath,
    method: request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body: parsedBody.body ?? undefined,
    cookieHeader: request.headers.get("cookie"),
    forwardedFor: request.headers.get("x-forwarded-for"),
  });

  const payload = result.ok ? result.data : normalizeInternalApiError(result.status, result.data);
  const response = NextResponse.json(payload, { status: result.status });

  appendSetCookieHeaders(response, result.setCookies);
  return response;
}

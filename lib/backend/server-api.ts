import { cookies, headers } from "next/headers";
import {
  createForwardedHeaders,
  normalizeInternalApiError,
  requestInternalApi,
} from "@/lib/backend/internal-api";

type InternalApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ServerApiRequestOptions = {
  path: string;
  method?: InternalApiMethod;
  body?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapDataPayload<T>(payload: unknown): T | null {
  if (isRecord(payload) && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data as T;
  }

  return (payload as T) ?? null;
}

function toErrorMessage(status: number, payload: unknown): string {
  return normalizeInternalApiError(status, payload).error.message;
}

async function getRequestMetadata(): Promise<{
  cookieHeader: string | null;
  forwardedFor: string | null;
  forwardedHeaders: Record<string, string>;
}> {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const host = requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const port =
    requestHeaders.get("x-forwarded-port") ??
    (host?.includes(":") ? host.split(":").at(-1) ?? null : proto === "https" ? "443" : "80");

  return {
    cookieHeader: cookieStore.toString(),
    forwardedFor: requestHeaders.get("x-forwarded-for"),
    forwardedHeaders: createForwardedHeaders({
      origin: requestHeaders.get("origin"),
      referer: requestHeaders.get("referer"),
      host,
      proto,
      port,
      userAgent: requestHeaders.get("user-agent"),
    }),
  };
}

export async function fetchServerData<T>(path: string): Promise<T | null> {
  const { cookieHeader, forwardedFor, forwardedHeaders } = await getRequestMetadata();
  const result = await requestInternalApi({
    path,
    method: "GET",
    cookieHeader,
    forwardedFor,
    forwardedHeaders,
  });

  if (!result.ok) {
    return null;
  }

  return unwrapDataPayload<T>(result.data);
}

export async function requestServerData<T>(options: ServerApiRequestOptions): Promise<T> {
  const { cookieHeader, forwardedFor, forwardedHeaders } = await getRequestMetadata();
  const result = await requestInternalApi({
    path: options.path,
    method: options.method ?? "GET",
    body: options.body,
    cookieHeader,
    forwardedFor,
    forwardedHeaders,
  });

  if (!result.ok) {
    throw new Error(toErrorMessage(result.status, result.data));
  }

  return unwrapDataPayload<T>(result.data) as T;
}

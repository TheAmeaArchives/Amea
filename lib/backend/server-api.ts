import { cookies, headers } from "next/headers";
import { normalizeInternalApiError, requestInternalApi } from "@/lib/backend/internal-api";

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

function getRequestMetadata(): {
  cookieHeader: string | null;
  forwardedFor: string | null;
} {
  return {
    cookieHeader: cookies().toString(),
    forwardedFor: headers().get("x-forwarded-for"),
  };
}

export async function fetchServerData<T>(path: string): Promise<T | null> {
  const { cookieHeader, forwardedFor } = getRequestMetadata();
  const result = await requestInternalApi({
    path,
    method: "GET",
    cookieHeader,
    forwardedFor,
  });

  if (!result.ok) {
    return null;
  }

  return unwrapDataPayload<T>(result.data);
}

export async function requestServerData<T>(options: ServerApiRequestOptions): Promise<T> {
  const { cookieHeader, forwardedFor } = getRequestMetadata();
  const result = await requestInternalApi({
    path: options.path,
    method: options.method ?? "GET",
    body: options.body,
    cookieHeader,
    forwardedFor,
  });

  if (!result.ok) {
    throw new Error(toErrorMessage(result.status, result.data));
  }

  return unwrapDataPayload<T>(result.data) as T;
}


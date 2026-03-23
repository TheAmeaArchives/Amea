type SafeErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

type InternalApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type InternalApiRequestOptions = {
  path: string;
  method: InternalApiMethod;
  body?: unknown;
  cookieHeader?: string | null;
  forwardedFor?: string | null;
};

type InternalApiResult = {
  status: number;
  ok: boolean;
  data: unknown;
  setCookies: string[];
};

const DEFAULT_INTERNAL_API_BASE_URL = "http://127.0.0.1:4000";
const INTERNAL_API_TOKEN_HEADER = "x-internal-api-token";

type ParsedSetCookie = {
  name: string;
  value: string;
  options: {
    path?: string;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    expires?: Date;
    maxAge?: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function getInternalApiBaseUrl(): string {
  const configured = process.env.INTERNAL_API_BASE_URL?.trim();
  const baseUrl = configured && configured.length > 0 ? configured : DEFAULT_INTERNAL_API_BASE_URL;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getInternalApiToken(): string | undefined {
  const token = process.env.INTERNAL_API_TOKEN?.trim();
  return token && token.length > 0 ? token : undefined;
}

function getDefaultErrorMessage(status: number): string {
  if (status === 400) return "Invalid request payload.";
  if (status === 401) return "Authentication is required.";
  if (status === 403) return "You are not authorized to perform this action.";
  if (status === 404) return "Requested endpoint was not found.";
  if (status === 429) return "Too many requests. Please wait and try again.";
  if (status >= 500) return "Backend service is currently unavailable.";
  return "Request failed.";
}

function getDefaultErrorCode(status: number): string {
  if (status === 400) return "INVALID_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "BACKEND_ERROR";
  return "REQUEST_FAILED";
}

export function normalizeInternalApiError(status: number, payload: unknown): SafeErrorResponse {
  if (isRecord(payload)) {
    const error = payload.error;
    if (isRecord(error) && typeof error.code === "string" && typeof error.message === "string") {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
  }

  return {
    error: {
      code: getDefaultErrorCode(status),
      message: getDefaultErrorMessage(status),
    },
  };
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return {
      error: {
        code: "INVALID_RESPONSE",
        message: "Backend returned a non-JSON response.",
      },
    };
  }
}

export function getSetCookieHeaders(headers: Headers): string[] {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  const rawSetCookie = headersWithSetCookie.getSetCookie?.();
  if (rawSetCookie && rawSetCookie.length > 0) {
    return rawSetCookie;
  }

  const combinedSetCookie = headers.get("set-cookie");
  if (!combinedSetCookie) {
    return [];
  }

  return combinedSetCookie
    .split(/,(?=\s*[^;,\s]+=)/g)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function parseSetCookieHeader(headerValue: string): ParsedSetCookie | null {
  const [nameValuePair, ...attributeTokens] = headerValue
    .split(";")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!nameValuePair) {
    return null;
  }

  const [name, ...valueParts] = nameValuePair.split("=");
  if (!name) {
    return null;
  }

  const parsedCookie: ParsedSetCookie = {
    name,
    value: valueParts.join("="),
    options: {},
  };

  for (const token of attributeTokens) {
    const [rawKey, ...rawValueParts] = token.split("=");
    const key = rawKey.toLowerCase();
    const value = rawValueParts.join("=");

    if (key === "path" && value) parsedCookie.options.path = value;
    if (key === "domain" && value) parsedCookie.options.domain = value;
    if (key === "httponly") parsedCookie.options.httpOnly = true;
    if (key === "secure") parsedCookie.options.secure = true;
    if (key === "samesite" && value) {
      const sameSite = value.toLowerCase();
      if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
        parsedCookie.options.sameSite = sameSite;
      }
    }
    if (key === "expires" && value) {
      const expires = new Date(value);
      if (!Number.isNaN(expires.getTime())) {
        parsedCookie.options.expires = expires;
      }
    }
    if (key === "max-age" && value) {
      const maxAge = Number.parseInt(value, 10);
      if (!Number.isNaN(maxAge)) {
        parsedCookie.options.maxAge = maxAge;
      }
    }
  }

  return parsedCookie;
}

export function hasSessionPayload(payload: unknown): boolean {
  return (
    isRecord(payload) &&
    Object.prototype.hasOwnProperty.call(payload, "session") &&
    payload.session !== null &&
    payload.session !== undefined
  );
}

export async function requestInternalApi(options: InternalApiRequestOptions): Promise<InternalApiResult> {
  const url = `${getInternalApiBaseUrl()}${normalizePath(options.path)}`;
  const headers = new Headers();

  headers.set("accept", "application/json");

  if (options.body !== undefined) {
    headers.set("content-type", "application/json");
  }

  if (options.cookieHeader && options.cookieHeader.length > 0) {
    headers.set("cookie", options.cookieHeader);
  }

  if (options.forwardedFor && options.forwardedFor.length > 0) {
    headers.set("x-forwarded-for", options.forwardedFor);
  }

  const internalApiToken = getInternalApiToken();
  if (internalApiToken) {
    headers.set(INTERNAL_API_TOKEN_HEADER, internalApiToken);
  }

  try {
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });

    return {
      status: response.status,
      ok: response.ok,
      data: await parseResponseBody(response),
      setCookies: getSetCookieHeaders(response.headers),
    };
  } catch {
    const status = 503;
    return {
      status,
      ok: false,
      data: normalizeInternalApiError(status, null),
      setCookies: [],
    };
  }
}

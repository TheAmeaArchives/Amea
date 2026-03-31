"use client";

import { createAuthClient, emailOTPClient } from "@/lib/auth/better-auth";

const publicAuthUrl = process.env.NEXT_PUBLIC_AUTH_URL?.trim();

export const authClient = createAuthClient({
  ...(publicAuthUrl
    ? { baseURL: publicAuthUrl }
    : { basePath: "/api/auth" }),
  plugins: [emailOTPClient()],
});

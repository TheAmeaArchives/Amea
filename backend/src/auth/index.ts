import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { env } from "../config/env.js";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { sendTransactionalEmail } from "../email/transactional.js";

function getRequiredAuthEnvValue(key: "BETTER_AUTH_SECRET" | "RESEND_API_KEY" | "RESEND_FROM_EMAIL"): string {
  const value = env[key];
  if (!value) {
    throw new Error(`${key} is required for Better Auth OTP configuration.`);
  }
  return value;
}

const betterAuthSecret = getRequiredAuthEnvValue("BETTER_AUTH_SECRET");
getRequiredAuthEnvValue("RESEND_API_KEY");
getRequiredAuthEnvValue("RESEND_FROM_EMAIL");

function resolveAuthBaseURL(): string {
  if (env.BETTER_AUTH_URL) {
    return env.BETTER_AUTH_URL;
  }

  const host = env.HOST === "0.0.0.0" ? "127.0.0.1" : env.HOST;
  return `http://${host}:${env.PORT}/api/auth`;
}

const trustedOrigins = (env.AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

async function sendVerificationOTP(data: {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}): Promise<void> {
  await sendTransactionalEmail({
    to: data.email,
    subject: "Your sign-in code",
    text: `Your one-time code is ${data.otp}. It expires in ${env.AUTH_OTP_EXPIRES_IN_SECONDS} seconds.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Your sign-in code</h2>
        <p style="margin: 0 0 16px;">Use this code to continue signing in.</p>
        <p style="font-size: 22px; font-weight: 700; letter-spacing: 0.08em; margin: 0 0 16px;">
          ${data.otp}
        </p>
        <p style="margin: 0; color: #555;">
          This code expires in ${env.AUTH_OTP_EXPIRES_IN_SECONDS} seconds.
        </p>
      </div>
    `,
  });
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: resolveAuthBaseURL(),
  secret: betterAuthSecret,
  trustedOrigins,
  emailAndPassword: {
    enabled: false,
  },
  rateLimit: {
    enabled: true,
    window: env.AUTH_OTP_RATE_LIMIT_WINDOW_SECONDS,
    max: env.AUTH_OTP_RATE_LIMIT_MAX,
  },
  plugins: [
    emailOTP({
      sendVerificationOTP,
      disableSignUp: env.AUTH_DISABLE_SIGNUP,
      expiresIn: env.AUTH_OTP_EXPIRES_IN_SECONDS,
      allowedAttempts: env.AUTH_OTP_ALLOWED_ATTEMPTS,
      rateLimit: {
        window: env.AUTH_OTP_RATE_LIMIT_WINDOW_SECONDS,
        max: env.AUTH_OTP_RATE_LIMIT_MAX,
      },
    }),
  ],
});

export type AuthErrorPayload = {
  code?: string;
  message?: string;
};

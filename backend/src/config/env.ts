import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const positiveIntFromString = z.coerce.number().int().positive();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: positiveIntFromString.default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  AUTH_TRUSTED_ORIGINS: z.string().optional(),
  AUTH_OTP_EXPIRES_IN_SECONDS: positiveIntFromString.default(300),
  AUTH_OTP_ALLOWED_ATTEMPTS: positiveIntFromString.default(3),
  AUTH_OTP_RATE_LIMIT_WINDOW_SECONDS: positiveIntFromString.default(60),
  AUTH_OTP_RATE_LIMIT_MAX: positiveIntFromString.default(3),
  AUTH_REQUEST_RATE_LIMIT_WINDOW_SECONDS: positiveIntFromString.default(600),
  AUTH_REQUEST_RATE_LIMIT_MAX: positiveIntFromString.default(5),
  AUTH_DISABLE_SIGNUP: booleanFromString.default(false),
  UPLOAD_PUBLIC_BASE_URL: z.string().url().optional(),
  UPLOAD_DIRECTORY: z.string().default("uploads"),
  UPLOAD_IMAGE_MAX_BYTES: positiveIntFromString.default(10 * 1024 * 1024),
  UPLOAD_VIDEO_MAX_BYTES: positiveIntFromString.default(100 * 1024 * 1024),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsedEnv.data;

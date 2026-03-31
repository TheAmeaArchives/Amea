import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const projectRoot = path.resolve(backendRoot, "..");

const envFiles = [
  path.resolve(projectRoot, ".env.local"),
  path.resolve(projectRoot, ".env"),
  path.resolve(backendRoot, ".env.local"),
  path.resolve(backendRoot, ".env"),
];

for (const envFile of envFiles) {
  loadEnv({ path: envFile, override: false });
}

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
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  AWS_S3_BUCKET: z.string().min(1).optional(),
  AWS_S3_REGION: z.string().min(1).optional(),
  AWS_S3_ENDPOINT: z.string().url().optional(),
  AWS_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  AWS_S3_KEY_PREFIX: z.string().default(""),
  AWS_S3_FORCE_PATH_STYLE: booleanFromString.default(false),
  UPLOAD_PUBLIC_BASE_URL: z.string().url().optional(),
  UPLOAD_DIRECTORY: z.string().default("uploads"),
  UPLOAD_IMAGE_MAX_BYTES: positiveIntFromString.default(10 * 1024 * 1024),
  UPLOAD_VIDEO_MAX_BYTES: positiveIntFromString.default(100 * 1024 * 1024),
}).superRefine((data, ctx) => {
  const usesS3 =
    Boolean(data.AWS_ACCESS_KEY_ID) ||
    Boolean(data.AWS_SECRET_ACCESS_KEY) ||
    Boolean(data.AWS_S3_BUCKET) ||
    Boolean(data.AWS_S3_REGION) ||
    Boolean(data.AWS_S3_ENDPOINT) ||
    Boolean(data.AWS_S3_PUBLIC_BASE_URL) ||
    Boolean(data.AWS_S3_KEY_PREFIX);

  if (!usesS3) {
    return;
  }

  if (!data.AWS_ACCESS_KEY_ID) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["AWS_ACCESS_KEY_ID"],
      message: "AWS_ACCESS_KEY_ID is required when S3 storage is configured",
    });
  }

  if (!data.AWS_SECRET_ACCESS_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["AWS_SECRET_ACCESS_KEY"],
      message: "AWS_SECRET_ACCESS_KEY is required when S3 storage is configured",
    });
  }

  if (!data.AWS_S3_BUCKET) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["AWS_S3_BUCKET"],
      message: "AWS_S3_BUCKET is required when S3 storage is configured",
    });
  }

  if (!data.AWS_S3_REGION) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["AWS_S3_REGION"],
      message: "AWS_S3_REGION is required when S3 storage is configured",
    });
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsedEnv.data;

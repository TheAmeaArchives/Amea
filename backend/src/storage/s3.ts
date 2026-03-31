import { randomUUID } from "node:crypto";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const IMAGE_EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
};

type S3UploadPayload = {
  buffer: Buffer;
  contentType: string;
  originalName: string;
  folder: string;
  size: number;
};

export type StoredUpload = {
  key: string;
  url: string;
  mimeType: string;
  size: number;
};

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_REGION) {
    throw new Error("S3 storage is not configured.");
  }

  if (s3Client) {
    return s3Client;
  }

  s3Client = new S3Client({
    region: env.AWS_S3_REGION,
    endpoint: env.AWS_S3_ENDPOINT,
    forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

function normalizeKeySegment(value: string): string {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/(^\/+|\/+$)/g, "")
    .replace(/\.\.+/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-");
}

function getPublicBaseUrl(): string {
  if (env.AWS_S3_PUBLIC_BASE_URL) {
    return env.AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  if (!env.AWS_S3_BUCKET || !env.AWS_S3_REGION) {
    throw new Error("S3 public base URL is not configured.");
  }

  if (env.AWS_S3_REGION === "us-east-1") {
    return `https://${env.AWS_S3_BUCKET}.s3.amazonaws.com`;
  }

  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_S3_REGION}.amazonaws.com`;
}

function getFileExtension(contentType: string, originalName: string): string {
  const originalExtension = path.extname(originalName || "").toLowerCase();
  if (originalExtension) {
    return originalExtension;
  }

  return IMAGE_EXTENSION_BY_MIME_TYPE[contentType] ?? "";
}

function buildStorageKey(folder: string, originalName: string, contentType: string): string {
  const prefix = normalizeKeySegment(env.AWS_S3_KEY_PREFIX);
  const normalizedFolder = normalizeKeySegment(folder);
  const extension = getFileExtension(contentType, originalName);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;

  return [prefix, normalizedFolder, filename].filter(Boolean).join("/");
}

export function isS3StorageConfigured(): boolean {
  return Boolean(
    env.AWS_ACCESS_KEY_ID &&
      env.AWS_SECRET_ACCESS_KEY &&
      env.AWS_S3_BUCKET &&
      env.AWS_S3_REGION,
  );
}

export async function uploadImageToS3(payload: S3UploadPayload): Promise<StoredUpload> {
  if (!env.AWS_S3_BUCKET) {
    throw new Error("S3 bucket is not configured.");
  }

  const key = buildStorageKey(payload.folder, payload.originalName, payload.contentType);

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: payload.buffer,
      ContentType: payload.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${getPublicBaseUrl()}/${key.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`,
    mimeType: payload.contentType,
    size: payload.size,
  };
}

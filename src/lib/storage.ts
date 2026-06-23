import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export type BucketType = "public" | "private";

function getBucket(type: BucketType): string {
  return type === "public"
    ? process.env.R2_BUCKET_PUBLIC!
    : process.env.R2_BUCKET_PRIVATE!;
}

export function getPublicUrl(key: string): string {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}

export async function generateUploadPresignedUrl(
  key: string,
  contentType: string,
  bucket: BucketType = "public"
): Promise<string> {
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_ATTACHMENT_TYPES];
  if (!allowed.includes(contentType)) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  const command = new PutObjectCommand({
    Bucket: getBucket(bucket),
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 minutes
}

export async function generateDownloadPresignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket("private"),
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export async function deleteObject(
  key: string,
  bucket: BucketType = "public"
): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(bucket),
      Key: key,
    })
  );
}

export function generateKey(folder: string, filename: string): string {
  const ext = filename.split(".").pop();
  return `${folder}/${uuidv4()}.${ext}`;
}

// Allowed file types per upload context
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const ALLOWED_ATTACHMENT_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

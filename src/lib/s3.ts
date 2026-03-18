import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type PresignPutArgs = {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
};

type PresignGetArgs = {
  key: string;
  expiresInSeconds?: number;
};

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;

  s3Client = new S3Client({
    region: process.env.S3_REGION || "default",
    endpoint: env("S3_ENDPOINT"),
    credentials: {
      accessKeyId: env("S3_ACCESS_KEY_ID"),
      secretAccessKey: env("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true" ? true : undefined,
  });

  return s3Client;
}

function bucket(): string {
  return env("S3_BUCKET");
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body) throw new Error("S3 object body is empty");

  if (Buffer.isBuffer(body)) return body;
  if (typeof body === "string") return Buffer.from(body);
  if (body instanceof Uint8Array) return Buffer.from(body);

  // Node.js stream case
  const stream = body as NodeJS.ReadableStream;
  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function downloadS3Object(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket(),
    Key: key,
  });

  const res = await getS3Client().send(command);
  return await bodyToBuffer(res.Body);
}

export async function getPresignedPutUrl(args: PresignPutArgs) {
  const expiresInSeconds = args.expiresInSeconds ?? 600;

  const command = new PutObjectCommand({
    Bucket: bucket(),
    Key: args.key,
    ContentType: args.contentType,
  });

  const url = await getSignedUrl(getS3Client(), command, {
    expiresIn: expiresInSeconds,
  });
  return { url, method: "PUT" as const, expiresInSeconds };
}

export async function getPresignedGetUrl(args: PresignGetArgs) {
  const expiresInSeconds = args.expiresInSeconds ?? 600;

  const command = new GetObjectCommand({
    Bucket: bucket(),
    Key: args.key,
  });

  const url = await getSignedUrl(getS3Client(), command, {
    expiresIn: expiresInSeconds,
  });
  return { url, method: "GET" as const, expiresInSeconds };
}


import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION ?? "default",
      endpoint: `https://${process.env.S3_ENDPOINT}`,
      forcePathStyle: true,
      // S3-compatible services (non-AWS) don't support SDK v3 automatic checksums
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export const S3_BUCKET = process.env.S3_BUCKET!;

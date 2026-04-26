import { S3Client } from "@aws-sdk/client-s3";

// Lazy singleton — created on first use, not at module load
let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export const S3_BUCKET = process.env.AWS_BUCKET_NAME!;

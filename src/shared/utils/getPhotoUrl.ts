export function getPhotoUrl(s3Key: string): string {
  const endpoint = (process.env.S3_ENDPOINT ?? "").replace(/\/$/, "");
  const bucket = process.env.S3_BUCKET ?? "";
  return `https://${endpoint}/${bucket}/${s3Key}`;
}

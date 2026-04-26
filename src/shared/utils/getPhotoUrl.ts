/** Constructs the public S3 URL from an s3Key stored in the database. */
export function getPhotoUrl(s3Key: string): string {
  const base = (process.env.AWS_S3_PUBLIC_URL ?? "").replace(/\/$/, "");
  return `${base}/${s3Key}`;
}

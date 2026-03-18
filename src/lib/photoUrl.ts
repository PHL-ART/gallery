import { getPresignedGetUrl } from "@/lib/s3";

function publicBaseUrl() {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!base) return null;
  return base.replace(/\/+$/, "");
}

function encodeKeyForUrl(key: string) {
  // S3 key может содержать '/' — encode делаем по сегментам.
  return key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

export async function getPhotoUrl(s3Key: string) {
  const base = publicBaseUrl();
  if (base) return `${base}/${encodeKeyForUrl(s3Key)}`;

  const res = await getPresignedGetUrl({
    key: s3Key,
    // Делаем подлинку достаточно длинной для комфортного просмотра
    expiresInSeconds: 60 * 60,
  });

  return res.url;
}


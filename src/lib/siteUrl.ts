export function getSiteUrl() {
  const v =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return v.replace(/\/+$/, "");
}


import { getSiteUrl } from "@/lib/siteUrl";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}


import prisma from "@/lib/prisma";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function sitemap() {
  const siteUrl = getSiteUrl();

  const [categories, tags, photos] = await Promise.all([
    prisma.category.findMany({
      where: {},
      select: { slug: true, updatedAt: true },
    }),
    prisma.tag.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.photo.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const urls: Array<{ url: string; lastModified?: string }> = [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/latest` },
    { url: `${siteUrl}/browse` },
  ];

  urls.push(
    ...categories.map((c) => ({
      url: `${siteUrl}/c/${c.slug}`,
      lastModified: c.updatedAt.toISOString(),
    })),
  );

  urls.push(
    ...tags.map((t) => ({
      url: `${siteUrl}/t/${t.slug}`,
      lastModified: t.updatedAt.toISOString(),
    })),
  );

  urls.push(
    ...photos.map((p) => ({
      url: `${siteUrl}/p/${p.slug}`,
      lastModified: p.updatedAt.toISOString(),
    })),
  );

  return urls;
}


import { cache } from "react";
import { prisma } from "./prisma";
import { notFound } from "next/navigation";

/** All query functions are wrapped in React cache() to deduplicate calls
 *  within a single request (e.g. generateMetadata + page both call the same fn). */

export const getPhoto = cache(async (id: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      albums: { include: { album: true } },
    },
  });
  if (!photo) notFound();
  return photo;
});

export const getAlbum = cache(async (id: string) => {
  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: {
        include: {
          photo: {
            include: { tags: { include: { tag: true } } },
          },
        },
        orderBy: { photo: { publishedAt: "desc" } },
      },
    },
  });
  if (!album) notFound();
  return album;
});

export const getTag = cache(async (id: string) => {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      photos: {
        include: { photo: true },
        orderBy: { photo: { publishedAt: "desc" } },
      },
    },
  });
  if (!tag) notFound();
  return tag;
});

export const getPhotos = cache(async () =>
  prisma.photo.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  })
);

export const getAlbums = cache(async (isSpecial?: boolean) =>
  prisma.album.findMany({
    where: isSpecial !== undefined ? { isSpecial } : {},
    include: {
      _count: { select: { photos: true } },
      photos: {
        take: 1,
        orderBy: { photo: { publishedAt: "desc" } },
        include: { photo: true },
      },
    },
    orderBy: { title: "asc" },
  })
);

export const getTags = cache(async () =>
  prisma.tag.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { title: "asc" },
  })
);

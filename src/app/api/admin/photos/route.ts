import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { downloadS3Object } from "@/lib/s3";
import * as exifr from "exifr";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { shotAt: "desc" },
    include: {
      category: true,
      location: true,
      tags: { include: { tag: true } },
    },
  });

  return Response.json({ photos });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    title: string;
    slug?: string;
    description?: string | null;
    shotAt: string; // ISO
    s3Key: string;
    isPublished?: boolean;
    categoryId?: string | null;
    locationId?: string | null;
    tagIds?: string[];
    width?: number | null;
    height?: number | null;
    exifJson?: unknown;
    dominantColor?: string | null;
  };

  if (!body?.title || !body?.shotAt || !body?.s3Key) {
    return Response.json(
      { error: "`title`, `shotAt`, `s3Key` are required" },
      { status: 400 },
    );
  }

  const shotAt = new Date(body.shotAt);
  if (Number.isNaN(shotAt.getTime())) {
    return Response.json({ error: "`shotAt` must be a valid date" }, { status: 400 });
  }

  const baseSlug = (body.slug ? slugify(body.slug) : slugify(body.title)).trim();
  if (!baseSlug) {
    return Response.json({ error: "Cannot generate photo `slug`" }, { status: 400 });
  }

  let slug = baseSlug;
  let i = 2;
  while (await prisma.photo.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  let parsedExif: unknown = null;
  let locationIdFromExif: string | null = null;

  try {
    const buffer = await downloadS3Object(body.s3Key);

    // EXIF-данные (без внешних сервисов)
    parsedExif = (await exifr.parse(buffer).catch(() => null)) ?? null;

    // GPS-геоданные (если есть)
    const gps = await exifr.gps(buffer).catch(() => null);
    const lat = gps && typeof gps.latitude === "number" ? gps.latitude : null;
    const lng = gps && typeof gps.longitude === "number" ? gps.longitude : null;

    if (lat !== null && lng !== null) {
      const latR = Number(lat.toFixed(5));
      const lngR = Number(lng.toFixed(5));
      const locSlug = `gps-${latR}-${lngR}`;
      const locName = `${latR.toFixed(5)}, ${lngR.toFixed(5)}`;

      const location = await prisma.location.upsert({
        where: { slug: locSlug },
        update: { lat: latR, lng: lngR, name: locName },
        create: { slug: locSlug, name: locName, lat: latR, lng: lngR },
      });

      locationIdFromExif = location.id;
    }
  } catch (e) {
    // Не блокируем создание Photo, если EXIF не удалось распарсить
    console.error("Failed to parse EXIF for photo", e);
  }

  const photo = await prisma.photo.create({
    data: {
      slug,
      title: body.title,
      description: body.description ?? null,
      shotAt,
      isPublished: body.isPublished ?? false,
      s3Key: body.s3Key,
      width: body.width ?? null,
      height: body.height ?? null,
      dominantColor: body.dominantColor ?? null,
      exifJson: parsedExif ?? body.exifJson ?? undefined,
      categoryId: body.categoryId ?? null,
      locationId: locationIdFromExif ?? body.locationId ?? null,
    },
  });

  if (body.tagIds?.length) {
    await prisma.photoTag.createMany({
      data: body.tagIds.map((tagId) => ({ photoId: photo.id, tagId })),
    });
  }

  const created = await prisma.photo.findUnique({
    where: { id: photo.id },
    include: {
      category: true,
      location: true,
      tags: { include: { tag: true } },
    },
  });

  return Response.json({ photo: created });
}


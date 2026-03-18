import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await req.json()) as {
    title?: string;
    slug?: string;
    description?: string | null;
    shotAt?: string;
    isPublished?: boolean;
    categoryId?: string | null;
    locationId?: string | null;
    tagIds?: string[]; // если передан - перезаписываем
    width?: number | null;
    height?: number | null;
    exifJson?: unknown;
    dominantColor?: string | null;
  };

  const current = await prisma.photo.findUnique({
    where: { id },
    select: { id: true, slug: true, title: true },
  });

  if (!current) {
    return Response.json({ error: "Photo not found" }, { status: 404 });
  }

  let nextSlug = current.slug;
  if (body.slug || body.title) {
    const base = slugify(body.slug ?? body.title ?? current.title).trim();
    if (base) nextSlug = base;
  }

  if (nextSlug !== current.slug) {
    let candidate = nextSlug;
    let i = 2;
    while (await prisma.photo.findUnique({ where: { slug: candidate } })) {
      candidate = `${nextSlug}-${i++}`;
    }
    nextSlug = candidate;
  }

  const shotAt =
    body.shotAt !== undefined ? new Date(body.shotAt) : undefined;
  if (shotAt && Number.isNaN(shotAt.getTime())) {
    return Response.json({ error: "`shotAt` must be a valid date" }, { status: 400 });
  }

  const updated = await prisma.photo.update({
    where: { id },
    data: {
      title: body.title ?? undefined,
      slug: nextSlug,
      description: body.description === undefined ? undefined : body.description,
      shotAt: shotAt ?? undefined,
      isPublished: body.isPublished ?? undefined,
      categoryId:
        body.categoryId === undefined ? undefined : body.categoryId,
      locationId:
        body.locationId === undefined ? undefined : body.locationId,
      width: body.width === undefined ? undefined : body.width,
      height: body.height === undefined ? undefined : body.height,
      exifJson:
        body.exifJson === undefined || body.exifJson === null
          ? undefined
          : body.exifJson,
      dominantColor:
        body.dominantColor === undefined ? undefined : body.dominantColor,
    },
  });

  if (body.tagIds) {
    await prisma.photoTag.deleteMany({ where: { photoId: id } });
    if (body.tagIds.length) {
      await prisma.photoTag.createMany({
        data: body.tagIds.map((tagId) => ({ photoId: updated.id, tagId })),
      });
    }
  }

  const photo = await prisma.photo.findUnique({
    where: { id: updated.id },
    include: {
      category: true,
      location: true,
      tags: { include: { tag: true } },
    },
  });

  return Response.json({ photo });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await prisma.photo.delete({ where: { id } });
  return Response.json({ ok: true });
}


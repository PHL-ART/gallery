import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const albumId = searchParams.get("albumId");
    const tagId = searchParams.get("tagId");
    const notInAlbumId = searchParams.get("notInAlbumId");
    const notInTagId = searchParams.get("notInTagId");
    const skip = Math.max(0, parseInt(searchParams.get("skip") ?? "0", 10) || 0);
    const take = Math.max(1, Math.min(parseInt(searchParams.get("take") ?? "24", 10) || 24, 50));

    const isPaginated = !!(notInAlbumId || notInTagId);

    const where = {
      ...(albumId ? { albums: { some: { albumId } } } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
      ...(notInAlbumId ? { albums: { none: { albumId: notInAlbumId } } } : {}),
      ...(notInTagId ? { tags: { none: { tagId: notInTagId } } } : {}),
    };

    if (isPaginated) {
      const [photos, total] = await prisma.$transaction([
        prisma.photo.findMany({
          where,
          select: { id: true, s3Key: true },
          orderBy: { publishedAt: "desc" },
          skip,
          take,
        }),
        prisma.photo.count({ where }),
      ]);

      const { getPhotoUrl } = await import("@/shared/utils/getPhotoUrl");
      return NextResponse.json({
        photos: photos.map((p) => ({ id: p.id, url: getPhotoUrl(p.s3Key) })),
        total,
      });
    }

    // Existing behaviour — returns raw array, unchanged
    const photos = await prisma.photo.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        albums: { include: { album: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch (err) {
    console.error("[GET /api/photos]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { s3Key, shotAt, exifData, albumIds = [], tagIds = [] } = body;

    if (!s3Key) return NextResponse.json({ error: "s3Key is required" }, { status: 400 });

    const photo = await prisma.photo.create({
      data: {
        s3Key,
        shotAt: shotAt ? new Date(shotAt) : null,
        exifData: exifData ?? undefined,
        albums: {
          create: (albumIds as string[]).map((albumId) => ({ albumId })),
        },
        tags: {
          create: (tagIds as string[]).map((tagId) => ({ tagId })),
        },
      },
      include: {
        tags: { include: { tag: true } },
        albums: { include: { album: true } },
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

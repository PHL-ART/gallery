import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const albumId = searchParams.get("albumId");
    const tagId = searchParams.get("tagId");

    const photos = await prisma.photo.findMany({
      where: {
        ...(albumId ? { albums: { some: { albumId } } } : {}),
        ...(tagId ? { tags: { some: { tagId } } } : {}),
      },
      include: {
        tags: { include: { tag: true } },
        albums: { include: { album: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch {
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

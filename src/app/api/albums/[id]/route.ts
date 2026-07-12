import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        _count: { select: { photos: true } },
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

    if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, description, isSpecial, photoIds } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const album = await tx.album.update({
        where: { id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(title !== undefined ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(isSpecial !== undefined ? { isSpecial } : {}),
        },
      });

      if (Array.isArray(photoIds)) {
        await tx.photoAlbum.deleteMany({ where: { albumId: id } });
        if (photoIds.length > 0) {
          await tx.photoAlbum.createMany({
            data: (photoIds as string[]).map((photoId) => ({
              photoId,
              albumId: id,
            })),
          });
        }
      }

      return album;
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[PUT /api/albums/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.album.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

interface Ctx {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: params.id },
      include: {
        tags: { include: { tag: true } },
        albums: { include: { album: true } },
      },
    });

    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { shotAt, exifData, albumIds, tagIds } = await req.json();

    const photo = await prisma.photo.update({
      where: { id: params.id },
      data: {
        shotAt: shotAt !== undefined ? (shotAt ? new Date(shotAt) : null) : undefined,
        exifData: exifData !== undefined ? exifData : undefined,
        ...(albumIds !== undefined
          ? {
              albums: {
                deleteMany: {},
                create: (albumIds as string[]).map((albumId) => ({ albumId })),
              },
            }
          : {}),
        ...(tagIds !== undefined
          ? {
              tags: {
                deleteMany: {},
                create: (tagIds as string[]).map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
      include: {
        tags: { include: { tag: true } },
        albums: { include: { album: true } },
      },
    });

    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.photo.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

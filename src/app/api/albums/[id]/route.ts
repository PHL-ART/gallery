import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

interface Ctx {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: params.id },
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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, description, isSpecial } = await req.json();

    const album = await prisma.album.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isSpecial !== undefined ? { isSpecial } : {}),
      },
    });

    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.album.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

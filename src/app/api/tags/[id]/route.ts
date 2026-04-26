import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

interface Ctx {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { photos: true } },
        photos: {
          include: { photo: true },
          orderBy: { photo: { publishedAt: "desc" } },
        },
      },
    });

    if (!tag) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tag);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, description } = await req.json();

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    });

    return NextResponse.json(tag);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.tag.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

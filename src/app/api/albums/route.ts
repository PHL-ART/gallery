import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const special = searchParams.get("special");

    const albums = await prisma.album.findMany({
      where: {
        ...(special !== null ? { isSpecial: special === "true" } : {}),
      },
      include: {
        _count: { select: { photos: true } },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(albums);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, description, isSpecial = false } = await req.json();

    if (!name || !title) {
      return NextResponse.json({ error: "name and title are required" }, { status: 400 });
    }

    const album = await prisma.album.create({
      data: { name, title, description, isSpecial },
    });

    return NextResponse.json(album, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

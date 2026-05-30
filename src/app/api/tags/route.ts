import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { photos: true } } },
      orderBy: { title: "asc" },
    });
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, title, description } = await req.json();

    if (!name || !title) {
      return NextResponse.json({ error: "name and title are required" }, { status: 400 });
    }

    const tag = await prisma.tag.create({ data: { name, title, description } });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

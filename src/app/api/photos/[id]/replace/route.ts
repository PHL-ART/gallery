import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

interface Ctx {
  params: Promise<{ id: string }>;
}

/** Replace the S3 file for a photo without touching metadata (tags, albums, dates). */
export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { s3Key } = await req.json();
    if (!s3Key) return NextResponse.json({ error: "s3Key is required" }, { status: 400 });

    const photo = await prisma.photo.update({
      where: { id },
      data: { s3Key },
    });

    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

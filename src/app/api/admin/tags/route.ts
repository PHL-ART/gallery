import prisma from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ tags });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { slug?: string; name: string };

  if (!body?.name) {
    return Response.json({ error: "`name` is required" }, { status: 400 });
  }

  const slug = body.slug?.trim() || body.name.trim();

  const tag = await prisma.tag.upsert({
    where: { slug },
    update: { name: body.name },
    create: { slug, name: body.name },
  });

  return Response.json({ tag });
}


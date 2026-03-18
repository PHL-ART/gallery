import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ categories });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    slug?: string;
    name: string;
    description?: string;
  };

  if (!body?.name) {
    return Response.json({ error: "`name` is required" }, { status: 400 });
  }

  const slug = body.slug?.trim() || body.name.trim();

  const category = await prisma.category.upsert({
    where: { slug },
    update: { name: body.name, description: body.description ?? null },
    create: {
      slug,
      name: body.name,
      description: body.description ?? null,
    },
  });

  return Response.json({ category });
}


import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const body = (await req.json()) as {
    name?: string;
    description?: string | null;
  };

  if (!body?.name) {
    return Response.json({ error: "`name` is required" }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { slug },
    data: {
      name: body.name,
      description: body.description ?? null,
    },
  });

  return Response.json({ category });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  await prisma.category.delete({ where: { slug } });

  return Response.json({ ok: true });
}


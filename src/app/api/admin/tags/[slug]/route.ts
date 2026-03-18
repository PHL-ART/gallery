import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const body = (await req.json()) as {
    name?: string;
  };

  if (!body?.name) {
    return Response.json({ error: "`name` is required" }, { status: 400 });
  }

  const tag = await prisma.tag.update({
    where: { slug },
    data: { name: body.name },
  });

  return Response.json({ tag });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  await prisma.tag.delete({ where: { slug } });
  return Response.json({ ok: true });
}


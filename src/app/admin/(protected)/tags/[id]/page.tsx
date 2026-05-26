import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminTagEditForm } from "@/shared/ui/AdminTagEditForm";
import { AdminDeleteButton } from "@/shared/ui/AdminDeleteButton";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function AdminTagEditPage({ params }: Props) {
  const [tag, rawPhotos] = await Promise.all([
    prisma.tag.findUnique({
      where: { id: params.id },
      include: { _count: { select: { photos: true } } },
    }),
    prisma.photo.findMany({
      where: { tags: { some: { tagId: params.id } } },
      select: { id: true, s3Key: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);
  if (!tag) notFound();

  const photos = rawPhotos.map((p) => ({ id: p.id, url: getPhotoUrl(p.s3Key) }));

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          <Link href="/admin/tags" className="no-underline hover:text-primary transition-colors">
            Tags
          </Link>{" "}
          / Edit
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {tag.title}
        </h1>
        <div className="font-mono text-[0.6rem] text-muted mt-2">
          {tag._count.photos} photo{tag._count.photos !== 1 ? "s" : ""}
        </div>
      </div>

      <AdminTagEditForm
        tag={{ id: tag.id, title: tag.title, description: tag.description ?? "" }}
        photos={photos}
      />

      <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--surface-hi)" }}>
        <AdminDeleteButton
          url={`/api/tags/${tag.id}`}
          label="Delete tag"
          redirectTo="/admin/tags"
        />
      </div>
    </div>
  );
}

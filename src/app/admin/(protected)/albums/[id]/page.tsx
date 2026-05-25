import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminAlbumEditForm } from "@/shared/ui/AdminAlbumEditForm";
import { AdminDeleteButton } from "@/shared/ui/AdminDeleteButton";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function AdminAlbumEditPage({ params }: Props) {
  const album = await prisma.album.findUnique({
    where: { id: params.id },
    include: { _count: { select: { photos: true } } },
  });
  if (!album) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          <Link href="/admin/albums" className="no-underline hover:text-primary transition-colors">
            Albums
          </Link>{" "}
          / Edit
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {album.title}
        </h1>
        <div className="font-mono text-[0.6rem] text-muted mt-2">
          {album._count.photos} photo{album._count.photos !== 1 ? "s" : ""}
        </div>
      </div>

      <AdminAlbumEditForm
        album={{
          id: album.id,
          title: album.title,
          description: album.description ?? "",
          isSpecial: album.isSpecial,
        }}
        photos={[]}
      />

      <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--surface-hi)" }}>
        <AdminDeleteButton
          url={`/api/albums/${album.id}`}
          label="Delete album"
          redirectTo="/admin/albums"
        />
      </div>
    </div>
  );
}

import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";
import { AdminDeleteButton } from "@/shared/ui/AdminDeleteButton";
import { AdminCreateAlbumForm } from "@/shared/ui/AdminCreateAlbumForm";

export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const albums = await prisma.album.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { photos: true } } },
  });

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Admin
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          Albums
        </h1>
      </div>

      <div className="bg-panel p-6 mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-4">
          New album
        </span>
        <AdminCreateAlbumForm />
      </div>

      <div className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted mb-3">
        {albums.length} album{albums.length !== 1 ? "s" : ""}
      </div>

      <div className="space-y-px">
        {albums.map((album) => (
          <div key={album.id} className="bg-panel flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs text-primary">{album.title}</div>
              <div className="font-mono text-[0.55rem] text-muted mt-0.5">
                {album._count.photos} photo{album._count.photos !== 1 ? "s" : ""}
                {album.isSpecial && (
                  <span className="ml-2 text-[var(--red)]">special</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/albums/${album.id}`}
                className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted hover:text-primary no-underline transition-colors"
              >
                Edit
              </Link>
              <AdminDeleteButton url={`/api/albums/${album.id}`} />
            </div>
          </div>
        ))}
        {albums.length === 0 && (
          <p className="font-mono text-xs text-muted py-8 text-center">
            No albums yet
          </p>
        )}
      </div>
    </div>
  );
}

import { prisma } from "@/shared/lib/prisma";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/shared/ui/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      albums: { include: { album: true } },
      tags: { include: { tag: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
            Admin
          </span>
          <h1
            className="font-display font-black uppercase leading-none tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Photos
          </h1>
        </div>
        <Link
          href="/admin/upload"
          className="font-mono text-xs font-bold uppercase tracking-[0.12em] bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 no-underline hover:bg-[var(--red)] hover:text-[oklch(0.97_0.006_25)] transition-colors duration-150"
        >
          + Upload
        </Link>
      </div>

      <div className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted mb-3">
        {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--surface-hi)" }}>
              <th className="text-left py-2 pr-4 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted w-14" />
              <th className="text-left py-2 pr-4 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted">
                Date
              </th>
              <th className="text-left py-2 pr-4 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted">
                Albums
              </th>
              <th className="text-left py-2 pr-4 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted">
                Tags
              </th>
              <th className="text-right py-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-muted w-28" />
            </tr>
          </thead>
          <tbody>
            {photos.map((photo) => (
              <tr key={photo.id} style={{ borderBottom: "1px solid var(--surface-hi)" }}>
                <td className="py-2 pr-4">
                  <Image
                    src={getPhotoUrl(photo.s3Key)}
                    alt=""
                    width={44}
                    height={44}
                    className="object-cover"
                    style={{ width: 44, height: 44 }}
                  />
                </td>
                <td className="py-2 pr-4">
                  <span className="font-mono text-xs text-primary whitespace-nowrap">
                    {(photo.shotAt ?? photo.publishedAt).toLocaleDateString("ru-RU")}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span className="font-mono text-[0.6rem] text-muted">
                    {photo.albums.map((a) => a.album.title).join(", ") || "—"}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span className="font-mono text-[0.6rem] text-muted">
                    {photo.tags.map((t) => t.tag.title).join(", ") || "—"}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/photos/${photo.id}`}
                      className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted hover:text-primary no-underline transition-colors"
                    >
                      Edit
                    </Link>
                    <AdminDeleteButton url={`/api/photos/${photo.id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {photos.length === 0 && (
          <div className="py-16 text-center font-mono text-xs text-muted">
            No photos yet
          </div>
        )}
      </div>
    </div>
  );
}

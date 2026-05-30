import { prisma } from "@/shared/lib/prisma";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [photoCount, albumCount, tagCount, recentPhotos] = await Promise.all([
    prisma.photo.count(),
    prisma.album.count(),
    prisma.tag.count(),
    prisma.photo.findMany({ take: 8, orderBy: { publishedAt: "desc" } }),
  ]);

  const stats = [
    { label: "Photos", value: photoCount, href: "/admin/photos" },
    { label: "Albums", value: albumCount, href: "/admin/albums" },
    { label: "Tags", value: tagCount, href: "/admin/tags" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          Overview
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-panel p-6 no-underline hover:bg-panel-hi transition-colors duration-150 group"
          >
            <div className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-3">
              {label}
            </div>
            <div className="font-display font-black text-5xl leading-none tracking-[-0.02em] group-hover:text-[var(--red)] transition-colors duration-150">
              {value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
          Recent uploads
        </span>
        <Link
          href="/admin/upload"
          className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--red)] no-underline hover:opacity-70 transition-opacity"
        >
          + Upload
        </Link>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {recentPhotos.map((photo) => (
          <Link
            key={photo.id}
            href={`/admin/photos/${photo.id}`}
            className="aspect-square overflow-hidden no-underline"
          >
            <Image
              src={getPhotoUrl(photo.s3Key)}
              alt=""
              width={100}
              height={100}
              className="w-full h-full object-cover hover:opacity-75 transition-opacity duration-150"
            />
          </Link>
        ))}
        {recentPhotos.length === 0 && (
          <div className="col-span-8 font-mono text-xs text-muted py-12 text-center">
            No photos yet —{" "}
            <Link href="/admin/upload" className="text-[var(--red)] no-underline">
              upload some
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

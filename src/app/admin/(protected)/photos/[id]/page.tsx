import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPhotoEditForm } from "@/shared/ui/AdminPhotoEditForm";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPhotoEditPage({ params }: Props) {
  const { id } = await params;
  const [photo, albums, tags] = await Promise.all([
    prisma.photo.findUnique({
      where: { id },
      include: { albums: true, tags: true },
    }),
    prisma.album.findMany({ orderBy: { title: "asc" } }),
    prisma.tag.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!photo) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <span className="block font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted mb-2">
          <Link href="/admin/photos" className="no-underline hover:text-primary transition-colors">
            Photos
          </Link>{" "}
          / Edit
        </span>
        <h1
          className="font-display font-black uppercase leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Edit Photo
        </h1>
      </div>

      <AdminPhotoEditForm
        photo={{
          id: photo.id,
          s3Key: photo.s3Key,
          shotAt: photo.shotAt?.toISOString() ?? null,
          albumIds: photo.albums.map((a) => a.albumId),
          tagIds: photo.tags.map((t) => t.tagId),
          exifData: (photo.exifData as Record<string, string> | null) ?? null,
        }}
        photoUrl={getPhotoUrl(photo.s3Key)}
        albums={albums.map((a) => ({ id: a.id, title: a.title, isSpecial: a.isSpecial }))}
        tags={tags.map((t) => ({ id: t.id, title: t.title }))}
      />
    </div>
  );
}

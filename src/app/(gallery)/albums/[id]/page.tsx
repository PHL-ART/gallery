import type { Metadata } from "next";
import { MotionPhotoGrid } from "@/shared/ui/MotionPhotoGrid";
import { TagChip } from "@/shared/ui/TagChip";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbum } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const album = await getAlbum(id);
  return {
    title: `${album.title} — Filat Astakhov`,
    description: `${album.photos.length} photos · ${album.title}`,
    openGraph: {
      images: [`/api/og?type=album&id=${id}`],
    },
  };
}

export default async function AlbumPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tag: activeTag } = await searchParams;
  const album = await getAlbum(id);

  // Collect all unique tags across photos in this album
  const flatTags = album.photos.flatMap((pa) => pa.photo.tags.map((pt) => pt.tag));
  const allTags = Array.from(new Map(flatTags.map((tag) => [tag.id, tag])).values());

  // Filter photos by active tag (server-side)
  const filteredPhotos = activeTag
    ? album.photos.filter((pa) =>
        pa.photo.tags.some((pt) => pt.tag.id === activeTag)
      )
    : album.photos;

  const context = `from=album&contextId=${id}`;

  return (
    <>
      <div className="px-xl pt-[var(--space-3xl)] pb-[var(--space-2xl)] grid grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-lg">
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
          {album.title}
        </h1>
        <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
          {album.isSpecial && (
            <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">
              Special
            </span>
          )}
          {filteredPhotos.length} photos
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="px-xl pb-xl flex gap-2 flex-wrap items-center max-md:px-md max-md:pb-lg" role="group" aria-label="Filter by tag">
          <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-muted mr-1">Filter</span>
          <TagChip href={`/albums/${id}`} label="All" active={!activeTag} />
          {allTags.map((tag) => (
            <TagChip
              key={tag.id}
              href={`/albums/${id}?tag=${tag.id}`}
              label={tag.title}
              active={activeTag === tag.id}
            />
          ))}
        </div>
      )}

      <MotionPhotoGrid
        photos={filteredPhotos.map(({ photo }) => ({
          id: photo.id,
          src: getPhotoUrl(photo.s3Key),
          alt: `Photo from ${album.title}`,
          tags: photo.tags.map((pt) => pt.tag.title),
          context,
        }))}
      />
    </>
  );
}

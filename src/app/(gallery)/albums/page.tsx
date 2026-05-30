import type { Metadata } from "next";
import { MotionAlbumGrid } from "@/shared/ui/MotionAlbumGrid";
import { getPhotoUrl } from "@/shared/utils/getPhotoUrl";
import { getAlbums } from "@/shared/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Albums — Filat Astakhov",
  description: "All photo albums by Filat Astakhov",
  openGraph: { images: ["/api/og?type=listing&label=Albums"] },
};

export default async function AlbumsPage() {
  const albums = await getAlbums(false);

  return (
    <>
      <div className="px-xl pt-[var(--space-3xl)] pb-[var(--space-2xl)] grid grid-cols-[1fr_auto] gap-[var(--space-2xl)] items-end max-md:grid-cols-1 max-md:px-md max-md:pt-[var(--space-2xl)] max-md:pb-xl max-md:gap-lg">
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
          Albums
        </h1>
        <div className="font-mono text-[0.72rem] text-muted text-right leading-[2] max-md:text-left">
          <span className="block font-bold text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-1">Collections</span>
          {albums.length} albums
        </div>
      </div>

      <MotionAlbumGrid
        albums={albums.map((a) => ({
          id: a.id,
          title: a.title,
          photoCount: a._count.photos,
          coverSrc: a.photos[0] ? getPhotoUrl(a.photos[0].photo.s3Key) : undefined,
        }))}
      />
    </>
  );
}
